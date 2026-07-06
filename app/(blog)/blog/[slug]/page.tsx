export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // En Next.js 16, params es una promesa que debe resolverse
  const resolvedParams = await params;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
        Entrada: {resolvedParams.slug}
      </h1>
      <p className="mt-4 text-gray-600 font-medium">
        Lineamientos técnicos e información de prevención en construcción.
      </p>
    </div>
  );
}