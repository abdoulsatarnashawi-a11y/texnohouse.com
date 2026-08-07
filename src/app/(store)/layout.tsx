import { SiteHeader } from "@/components/store/Header";
import { SiteFooter } from "@/components/store/Footer";
import { getFooterConfig, getHeaderConfig, getSiteSettings } from "@/lib/store";

// Header, footer and site settings are editable in the admin panel.
export const dynamic = "force-dynamic";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings();
  const header = getHeaderConfig();
  const footer = getFooterConfig();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <SiteHeader settings={settings} header={header} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} footer={footer} />
    </div>
  );
}
