import "server-only";
import { createHash, randomBytes } from "node:crypto";

export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const UPLOAD_EXPIRY_MINUTES = 20;

export function cloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  let urlParts: { cloudName: string; apiKey: string; apiSecret: string } | null = null;

  if (cloudinaryUrl) {
    try {
      const url = new URL(cloudinaryUrl);
      if (url.protocol === "cloudinary:") {
        urlParts = {
          cloudName: url.hostname,
          apiKey: decodeURIComponent(url.username),
          apiSecret: decodeURIComponent(url.password),
        };
      }
    } catch {
      // Prefer explicit environment variables if CLOUDINARY_URL is malformed.
    }
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    urlParts?.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY ?? urlParts?.apiKey;
  const apiSecret = process.env.CLOUDINARY_API_SECRET ?? urlParts?.apiSecret;

  if (!cloudName || !apiKey || !apiSecret || !/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
    throw new Error("Cloudinary no está configurado correctamente");
  }

  return { cloudName, apiKey, apiSecret };
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newToken() {
  return randomBytes(32).toString("hex");
}

export function signCloudinary(params: Record<string, string>, secret: string) {
  const serialized = Object.entries(params)
    .filter(([key]) => !["api_key", "cloud_name", "file", "resource_type", "signature"].includes(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(serialized + secret).digest("hex");
}

export function parseCandidate(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const value = (key: string, max: number) =>
    typeof data[key] === "string" ? (data[key] as string).trim().slice(0, max + 1) : "";

  const fullName = value("fullName", 120);
  const email = value("email", 190).toLowerCase();
  const phone = value("phone", 30);
  const city = value("city", 120);
  const profession = value("profession", 140);
  const experience = value("experienceYears", 3);
  const message = value("message", 1200);
  const cvFileName = value("cvFileName", 180);
  const utmSource = value("utmSource", 120);
  const utmMedium = value("utmMedium", 120);
  const utmCampaign = value("utmCampaign", 150);
  const utmContent = value("utmContent", 150);

  if (
    fullName.length < 4 || fullName.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190 ||
    !/^\+?[0-9 ()-]{7,20}$/.test(phone) ||
    city.length < 2 || city.length > 120 ||
    profession.length < 2 || profession.length > 140 ||
    !/^(0|[1-9][0-9]?)$/.test(experience) || Number(experience) > 60 ||
    message.length > 1200 ||
    !/\.pdf$/i.test(cvFileName) || cvFileName.length > 180 ||
    [utmSource, utmMedium, utmCampaign, utmContent].some((x) => x.length > 150) ||
    data.consent !== true
  ) return null;

  return {
    fullName, email, phone, city, profession,
    experienceYears: Number(experience),
    message: message || null, cvFileName,
    utmSource: utmSource || null,
    utmMedium: utmMedium || null,
    utmCampaign: utmCampaign || null,
    utmContent: utmContent || null,
  };
}

export async function readCloudinaryAsset(publicId: string) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const encodedId = publicId.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw/authenticated/${encodedId}`,
    { headers: { Authorization: `Basic ${auth}` }, cache: "no-store", signal: AbortSignal.timeout(10000) }
  );
  if (!response.ok) return null;
  const item: unknown = await response.json();
  if (!item || typeof item !== "object") return null;
  const asset = item as Record<string, unknown>;
  return {
    assetId: typeof asset.asset_id === "string" ? asset.asset_id : "",
    publicId: typeof asset.public_id === "string" ? asset.public_id : "",
    bytes: typeof asset.bytes === "number" ? asset.bytes : -1,
    type: asset.type,
    resourceType: asset.resource_type,
    format: asset.format,
  };
}
