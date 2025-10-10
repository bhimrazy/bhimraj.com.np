import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <React.Fragment>
      <Header />
      <div className="min-h-dvh">{children}</div>
      <Footer />
    </React.Fragment>
  );
}
