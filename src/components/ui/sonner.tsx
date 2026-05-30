"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:border-site-border/60 group-[.toaster]:bg-site-card group-[.toaster]:text-site-text group-[.toaster]:shadow-lg dark:group-[.toaster]:border-white/8",
          description: "group-[.toast]:text-site-text-secondary",
          actionButton:
            "group-[.toast]:bg-site-accent group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-site-bg-secondary group-[.toast]:text-site-text-secondary",
          success: "group-[.toast]:text-site-accent",
          error: "group-[.toast]:text-red-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
