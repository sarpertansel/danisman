"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Languages");
  const [isPending, startTransition] = useTransition();
  const nextLocale: AppLocale = locale === "tr" ? "en" : "tr";

  function switchLocale() {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={isPending}
      aria-label={t("switchTo", { language: t(nextLocale) })}
      className="rounded-sm border border-[var(--color-brand-gold)] px-3 py-2 text-xs font-semibold tracking-[0.12em] text-[var(--color-brand-cream)] uppercase transition-colors hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-green)] disabled:opacity-60"
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
