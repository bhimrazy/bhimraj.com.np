"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AdConfig } from "@/config/ads";

export default function SponsorCard({ ad }: { ad: AdConfig }) {
  const [image, setImage] = useState(ad.images[0]);

  useEffect(() => {
    setImage(ad.images[Math.floor(Math.random() * ad.images.length)]);
  }, [ad.images]);

  const href = `${ad.url}?utm_source=${ad.utmSource}&utm_medium=${ad.utmMedium}&utm_campaign=${ad.utmCampaign}`;

  return (
    <div className="mt-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-lg border border-site-border transition-colors duration-200 hover:border-site-border-hover"
      >
        <div className="relative aspect-4/5 w-full overflow-hidden">
          <Image
            src={image}
            alt={ad.name}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="bg-site-card px-2.5 py-2">
          <p className="font-display font-semibold text-[11px] text-site-text leading-tight">
            {ad.name}
          </p>
          <p className="mt-0.5 font-mono text-[9px] text-site-text-tertiary leading-snug">
            {ad.tagline}
          </p>
        </div>
      </a>
    </div>
  );
}
