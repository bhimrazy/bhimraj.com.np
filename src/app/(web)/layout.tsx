import FeedbackWidget from "@/components/feedback-widget";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="min-h-dvh">{children}</div>
      <Footer />
      <FeedbackWidget />
      <Toaster />
    </>
  );
}
