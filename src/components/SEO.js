import Head from "next/head";
import siteConfig from "@/src/config/site";

export default function SEO({
  title,
  description,
  canonical,
  ogImage = "/icons/rologo.png",
  ogType = "website",
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} | ${siteConfig.brandName}`
    : `${siteConfig.brandName} - ${siteConfig.tagline}`;
  const metaDescription = description || siteConfig.description;
  const siteUrl = siteConfig.url;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta charSet="utf-8" />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteConfig.brandName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`} />

      {/* Favicon & Theme */}
      <link rel="icon" href="/favicon.ico" />
      <meta name="theme-color" content="#2563eb" />
    </Head>
  );
}
