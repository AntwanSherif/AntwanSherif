import Script from "next/script";

/** Loads the (renamed) Umami tracker. Renders nothing outside production or if config is missing. */
export function AnalyticsScripts() {
  if (process.env.NODE_ENV !== "production") return null;
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptName = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_NAME;
  if (!host || !websiteId || !scriptName) return null;
  return (
    <Script
      src={`${host}/${scriptName}`}
      data-website-id={websiteId}
      data-domains="antwan.me,www.antwan.me,antwansherif.com,www.antwansherif.com"
      data-host-url={host}
      data-performance="true"
      strategy="afterInteractive"
    />
  );
}
