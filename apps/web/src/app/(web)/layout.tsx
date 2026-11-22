import FeedbackWidget from "@/components/feedback-widget";
import Footer from "@/components/footer";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-100 rounded-md bg-site-accent px-4 py-2 font-medium text-site-on-accent text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:outline-2 focus-visible:outline-site-text focus-visible:outline-offset-2"
      >
        Skip to content
      </a>
      <Header />
      {/* tabIndex: lets the skip link focus this */}
      <div id="main" tabIndex={-1} className="min-h-dvh outline-none">
        {children}
      </div>
      <Footer />
      <FeedbackWidget />
      <Toaster />
    </>
  );
}
