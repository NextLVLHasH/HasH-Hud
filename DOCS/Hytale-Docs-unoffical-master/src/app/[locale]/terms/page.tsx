import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar, Footer } from "@/components/layout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("title"),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-12 max-w-4xl">
        <TermsContent />
      </main>
      <Footer />
    </div>
  );
}

function TermsContent() {
  const t = useTranslations("terms");

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1>{t("title")}</h1>
      <p className="text-muted-foreground">{t("lastUpdated")}: January 2026</p>

      <h2>{t("acceptance.title")}</h2>
      <p>{t("acceptance.content")}</p>

      <h2>{t("use.title")}</h2>
      <p>{t("use.content")}</p>

      <h2>{t("content.title")}</h2>
      <p>{t("content.content")}</p>

      <h2>{t("license.title")}</h2>
      <p>{t("license.content")}</p>
      <ul>
        <li><strong>{t("license.documentation")}</strong>: {t("license.documentationDesc")}</li>
        <li><strong>{t("license.code")}</strong>: {t("license.codeDesc")}</li>
        <li><strong>{t("license.attribution")}</strong>: {t("license.attributionDesc")}</li>
      </ul>
      <p>{t("license.restrictions")}</p>

      <h2>{t("disclaimer.title")}</h2>
      <p>{t("disclaimer.content")}</p>

      <h2>{t("liability.title")}</h2>
      <p>{t("liability.content")}</p>
      <ul>
        <li>{t("liability.item1")}</li>
        <li>{t("liability.item2")}</li>
        <li>{t("liability.item3")}</li>
        <li>{t("liability.item4")}</li>
      </ul>
      <p>{t("liability.cap")}</p>

      <h2>{t("indemnification.title")}</h2>
      <p>{t("indemnification.content")}</p>
      <ul>
        <li>{t("indemnification.item1")}</li>
        <li>{t("indemnification.item2")}</li>
        <li>{t("indemnification.item3")}</li>
      </ul>

      <h2>{t("thirdParty.title")}</h2>
      <p>{t("thirdParty.content")}</p>

      <h2>{t("affiliation.title")}</h2>
      <p>{t("affiliation.content")}</p>

      <h2>{t("termination.title")}</h2>
      <p>{t("termination.content")}</p>

      <h2>{t("disputes.title")}</h2>
      <p>{t("disputes.content")}</p>
      <ol>
        <li><strong>{t("disputes.informal")}</strong>: {t("disputes.informalDesc")}</li>
        <li><strong>{t("disputes.mediation")}</strong>: {t("disputes.mediationDesc")}</li>
        <li><strong>{t("disputes.legal")}</strong>: {t("disputes.legalDesc")}</li>
      </ol>

      <h2>{t("governing.title")}</h2>
      <p>{t("governing.content")}</p>
      <p>{t("governing.jurisdiction")}</p>

      <h2>{t("severability.title")}</h2>
      <p>{t("severability.content")}</p>

      <h2>{t("changes.title")}</h2>
      <p>{t("changes.content")}</p>

      <h2>{t("contact.title")}</h2>
      <p>{t("contact.content")}</p>
    </article>
  );
}
