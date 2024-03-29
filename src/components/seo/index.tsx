import { SEOProps } from "@/lib/types";
import Head from "next/head";
import React from "react";
import settings from "./settings";

const socialTags = ({
  openGraphType,
  url,
  title,
  description,
  image: image_url,
  createdAt,
  updatedAt,
}: SEOProps) => {
  const image = settings.meta.rootUrl + image_url;
  const metaTags = [
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:site",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:creator",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    { name: "twitter:image", content: image },
    { name: "twitter:image:src", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "og:title", content: title },
    { name: "og:type", content: openGraphType },
    { name: "og:url", content: url },
    { name: "og:image", content: image },
    { name: "og:description", content: description },
    {
      name: "og:site_name",
      content: settings && settings.meta && settings.meta.title,
    },
    {
      name: "og:published_time",
      content: createdAt
        ? new Date(createdAt).toISOString()
        : new Date("2021-05-01").toISOString(),
    },
    {
      name: "og:modified_time",
      content: updatedAt
        ? new Date(updatedAt).toISOString()
        : new Date().toISOString(),
    },
    {
      name: "article:publisher",
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter,
    },
    {
      name: "article:published_time",
      content: createdAt ? new Date(createdAt).toISOString() : "",
    },
    {
      name: "article:modified_time",
      content: updatedAt ? new Date(updatedAt).toISOString() : "",
    },
  ];

  return metaTags;
};

const SEO = (props: SEOProps) => {
  const {
    title,
    description,
    image: image_url,
    url,
    schemaType,
    siteInfo,
    createdAt,
    updatedAt,
  } = props;
  const image = settings.meta.rootUrl + image_url;
  let schema;
  if (schemaType) {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": url,
          url: url,
          name: title,
          isPartOf: { "@id": `${settings?.meta?.rootUrl}/#website` },
          primaryImageOfPage: {
            "@id": `${image}/#primaryimage`,
          },
          image: {
            "@id": `${image}/#primaryimage`,
          },
          thumbnailUrl: image,
          datePublished: createdAt ? new Date(createdAt).toISOString() : "",
          dateModified: updatedAt ? new Date(updatedAt).toISOString() : "",
          description: description,
          inLanguage: "en-US",
        },
        {
          "@type": "ImageObject",
          inLanguage: "en-US",
          "@id": `${image}/#primaryimage`,
          url: image,
          contentUrl: image,
          width: 1920,
          height: 1080,
        },
        {
          "@type": "WebSite",
          "@id": `${settings?.meta?.rootUrl}/#website`,
          url: settings?.meta?.rootUrl,
          name: siteInfo?.title,
          description: siteInfo?.description,
          inLanguage: "en-US",
        },
      ],
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${settings?.meta?.rootUrl}/#website`,
          url: settings?.meta?.rootUrl,
          name: siteInfo?.title,
          description: siteInfo?.description,
          inLanguage: "en-US",
        },
      ],
    };
  }
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta
        name="bingbot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      {socialTags(props).map(({ name, content }) => {
        return <meta key={name} name={name} content={content} />;
      })}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </Head>
  );
};

SEO.defaultProps = {
  title: settings && settings.meta && settings.meta.title,
  description: settings && settings.meta && settings.meta.description,
  image:
    settings &&
    settings.meta &&
    settings.meta.social &&
    settings.meta.social.graphic,
  url: settings && settings.meta && settings.meta.rootUrl,
  openGraphType: "website",
};

export default SEO;
