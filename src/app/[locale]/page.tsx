import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="flex flex-1 items-center bg-[var(--color-brand-green)] px-6 py-20 text-[var(--color-brand-cream)]">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-5 text-sm tracking-[0.2em] text-[var(--color-brand-gold)] uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="max-w-4xl font-serif text-5xl leading-tight sm:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--color-brand-cream-muted)]">
          {t("description")}
        </p>
      </div>
    </main>
  );
}
