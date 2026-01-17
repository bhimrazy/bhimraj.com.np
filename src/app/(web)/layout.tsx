import Footer from "@/components/footer";
import Header from "@/components/header";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="min-h-dvh">{children}</div>
      <Footer />
    </>
  );
}
