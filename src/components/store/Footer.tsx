import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { FooterConfig, SiteSettings } from "@/lib/types";

export function SiteFooter({
  settings,
  footer,
}: {
  settings: SiteSettings;
  footer: FooterConfig;
}) {
  return (
    <footer className="relative z-10 mt-20 border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-3xl font-extrabold tracking-tight">
            Domo<span className="text-volt-bright">Volt</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            {settings.tagline}. Качествени електроуреди и кухненски аксесоари с
            бърза доставка.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-volt-bright" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-volt-bright" />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-volt-bright" />
              <span>{settings.address}</span>
            </li>
          </ul>
        </div>

        {footer.columns.map((col) => (
          <div key={col.id}>
            <h3 className="font-display text-lg font-bold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-volt-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.bottomText}</p>
          <p>
            {settings.company} · ЕИК {settings.eik}
          </p>
        </div>
      </div>
    </footer>
  );
}
