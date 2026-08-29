import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-2xl text-[var(--color-brand-green)]">Mihenk</p>
          <p className="mt-2 max-w-md text-sm text-[var(--color-text-muted)]">{t("description")}</p>
        </div>
        <nav aria-label={t("legalLabel")}>
          <ul className="flex flex-wrap gap-5 text-sm">
            <li><Link href="/legal/kvkk" className="hover:underline">{t("kvkk")}</Link></li>
            <li><Link href="/legal/privacy" className="hover:underline">{t("privacy")}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-[var(--color-border)] px-6 py-5 text-center text-xs text-[var(--color-text-muted)]">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
