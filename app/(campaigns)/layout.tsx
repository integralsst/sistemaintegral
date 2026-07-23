import type { ReactNode } from "react";

type CampaignsLayoutProps = {
  children: ReactNode;
};

export default function CampaignsLayout({
  children,
}: CampaignsLayoutProps) {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#040608] text-white">
      {children}
    </main>
  );
}
