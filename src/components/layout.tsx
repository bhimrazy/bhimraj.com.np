import React, { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import { MetaData, SEOProps, SiteInfo } from "@/lib/types";
import SEO from "./seo";
import settings from "./seo/settings";

export default function Layout({
  children,
  meta_data,
  site_info,
}: {
  children: ReactNode;
  meta_data: MetaData;
  site_info: SiteInfo;
}) {
  const MetaProps: SEOProps = {
    title: meta_data?.title,
    description: meta_data?.description,
    image: meta_data?.image,
    url: meta_data?.url ?? settings?.meta?.rootUrl,
    schemaType: meta_data?.schemaType ?? "WebPage",
    createdAt: meta_data?.createdAt,
    openGraphType: "website",
  };
  return (
    <div className="flex flex-col bg-white font-display antialiased dark:bg-slate-900 dark:text-white">
      <SEO
        url={MetaProps?.url}
        openGraphType={MetaProps?.openGraphType}
        schemaType={MetaProps?.schemaType}
        title={MetaProps?.title}
        description={MetaProps?.description}
        image={MetaProps?.image}
        createdAt={MetaProps?.createdAt}
      />
      <Header site_info={site_info} />
      {children}
      <Footer />
    </div>
  );
}
