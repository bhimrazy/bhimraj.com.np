import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";

export default function Layout({
  children,
  meta_data,
}: {
  children: ReactNode;
  meta_data: any;
}) {
  return (
    <div className="flex flex-col bg-white font-display antialiased dark:bg-slate-900 dark:text-white">
      <Head>
        <title>{meta_data?.title}</title>
      </Head>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
