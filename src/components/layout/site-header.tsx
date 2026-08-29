import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { LanguageSwitcher } from "./language-switcher";

const navigationItems = [
  ["home", "/"],
  ["services", "/services"],
  ["sectors", "/sectors"],
  ["trainings", "/trainings"],
  ["equipment", "/equipment"],
  ["projects", "/projects"],
  ["about", "/about"],
  ["contact", "/contact"],
] as const;

export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header className="border-b border-white/10 bg-[var(--color-brand-green)] text-[var(--color-brand-cream)]">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-6 px-6">
        <Link href="/" className="mr-auto font-serif text-2xl text-white">
          Mihenk
        </Link>
        <nav aria-label={t("primaryLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {navigationItems.map(([key, href]) => (
              <li key={key}>
                <Link href={href} className="transition-colors hover:text-[var(--color-brand-gold)]">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
