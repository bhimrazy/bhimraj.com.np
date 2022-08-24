import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import { MetaData, SiteInfo } from "@/lib/types";

export default function Layout({
  children,
  meta_data,
  site_info,
}: {
  children: ReactNode;
  meta_data: MetaData;
  site_info: SiteInfo;
}) {
  return (
    <div className="flex flex-col bg-white font-display antialiased dark:bg-slate-900 dark:text-white">
      <Head>
        <title>{meta_data?.title}</title>
      </Head>
      <Header site_info={site_info} />
      {children}
      <Footer />
    </div>
  );
}
