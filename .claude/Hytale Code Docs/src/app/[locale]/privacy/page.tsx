import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar, Footer } from "@/components/layout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
  };
}

export default async function PrivacyPage({
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
        <PrivacyContent />
      </main>
      <Footer />
    </div>
  );
}

function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1>{t("title")}</h1>
      <p className="text-muted-foreground">{t("lastUpdated")}: January 2026</p>

      <h2>{t("intro.title")}</h2>
      <p>{t("intro.content")}</p>

      <h2>{t("lawfulBasis.title")}</h2>
      <p>{t("lawfulBasis.content")}</p>
      <ul>
        <li><strong>{t("lawfulBasis.consent")}</strong>: {t("lawfulBasis.consentDesc")}</li>
        <li><strong>{t("lawfulBasis.legitimateInterest")}</strong>: {t("lawfulBasis.legitimateInterestDesc")}</li>
        <li><strong>{t("lawfulBasis.contract")}</strong>: {t("lawfulBasis.contractDesc")}</li>
      </ul>

      <h2>{t("dataCollection.title")}</h2>
      <p>{t("dataCollection.content")}</p>
      <ul>
        <li>{t("dataCollection.item1")}</li>
        <li>{t("dataCollection.item2")}</li>
        <li>{t("dataCollection.item3")}</li>
      </ul>

      <h2>{t("cookies.title")}</h2>
      <p>{t("cookies.content")}</p>
      <ul>
        <li><strong>{t("cookies.essential")}</strong>: {t("cookies.essentialDesc")}</li>
        <li><strong>{t("cookies.analytics")}</strong>: {t("cookies.analyticsDesc")}</li>
        <li><strong>{t("cookies.advertising")}</strong>: {t("cookies.advertisingDesc")}</li>
      </ul>

      <h3>{t("cookies.detailsTitle")}</h3>
      <p>{t("cookies.detailsIntro")}</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>{t("cookies.tableName")}</th>
              <th>{t("cookies.tablePurpose")}</th>
              <th>{t("cookies.tableDuration")}</th>
              <th>{t("cookies.tableType")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cookie_consent</code></td>
              <td>{t("cookies.consentCookieDesc")}</td>
              <td>1 {t("cookies.year")}</td>
              <td>{t("cookies.essential")}</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td>{t("cookies.themeCookieDesc")}</td>
              <td>1 {t("cookies.year")}</td>
              <td>{t("cookies.essential")}</td>
            </tr>
            <tr>
              <td><code>locale</code></td>
              <td>{t("cookies.localeCookieDesc")}</td>
              <td>1 {t("cookies.year")}</td>
              <td>{t("cookies.essential")}</td>
            </tr>
            <tr>
              <td><code>_ga, _gid</code></td>
              <td>{t("cookies.gaCookieDesc")}</td>
              <td>2 {t("cookies.years")}</td>
              <td>{t("cookies.analytics")}</td>
            </tr>
            <tr>
              <td><code>__gads, __gpi</code></td>
              <td>{t("cookies.adsCookieDesc")}</td>
              <td>13 {t("cookies.months")}</td>
              <td>{t("cookies.advertising")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>{t("retention.title")}</h2>
      <p>{t("retention.content")}</p>
      <ul>
        <li><strong>{t("retention.analytics")}</strong>: {t("retention.analyticsDesc")}</li>
        <li><strong>{t("retention.cookies")}</strong>: {t("retention.cookiesDesc")}</li>
        <li><strong>{t("retention.logs")}</strong>: {t("retention.logsDesc")}</li>
      </ul>

      <h2>{t("thirdParty.title")}</h2>
      <p>{t("thirdParty.content")}</p>
      <ul>
        <li><strong>Google AdSense</strong>: {t("thirdParty.adsense")}</li>
        <li><strong>Umami Analytics</strong>: {t("thirdParty.analytics")}</li>
      </ul>

      <h2>{t("transfers.title")}</h2>
      <p>{t("transfers.content")}</p>
      <ul>
        <li><strong>Google (AdSense)</strong>: {t("transfers.google")}</li>
        <li><strong>Vercel</strong>: {t("transfers.vercel")}</li>
      </ul>
      <p>{t("transfers.safeguards")}</p>

      <h2>{t("gdprRights.title")}</h2>
      <p>{t("gdprRights.intro")}</p>
      <ul>
        <li><strong>{t("gdprRights.access")}</strong>: {t("gdprRights.accessDesc")}</li>
        <li><strong>{t("gdprRights.rectification")}</strong>: {t("gdprRights.rectificationDesc")}</li>
        <li><strong>{t("gdprRights.erasure")}</strong>: {t("gdprRights.erasureDesc")}</li>
        <li><strong>{t("gdprRights.restriction")}</strong>: {t("gdprRights.restrictionDesc")}</li>
        <li><strong>{t("gdprRights.portability")}</strong>: {t("gdprRights.portabilityDesc")}</li>
        <li><strong>{t("gdprRights.object")}</strong>: {t("gdprRights.objectDesc")}</li>
        <li><strong>{t("gdprRights.withdraw")}</strong>: {t("gdprRights.withdrawDesc")}</li>
      </ul>
      <p>{t("gdprRights.exerciseRights")}</p>

      <h2>{t("dpo.title")}</h2>
      <p>{t("dpo.content")}</p>
      <ul>
        <li><strong>{t("dpo.email")}</strong>: privacy@hytale-docs.com</li>
        <li><strong>{t("dpo.github")}</strong>: {t("dpo.githubDesc")}</li>
      </ul>
      <p>{t("dpo.response")}</p>

      <h2>{t("complaint.title")}</h2>
      <p>{t("complaint.content")}</p>

      <h2>{t("changes.title")}</h2>
      <p>{t("changes.content")}</p>

      <h2>{t("contact.title")}</h2>
      <p>{t("contact.content")}</p>
    </article>
  );
}
