export interface AdConfig {
  name: string;
  tagline: string;
  url: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  images: string[];
  enabled: boolean;
}

export const ads: AdConfig[] = [
  {
    name: "Stable Cluster",
    tagline: "Domain. Email. Hosting. One Stable Solution.",
    url: "https://stablecluster.com",
    utmSource: "bhimraj",
    utmMedium: "blog-sidebar",
    utmCampaign: "stable-cluster",
    images: [
      "/sponsors/stable-cluster/1.jpg",
      "/sponsors/stable-cluster/2.jpg",
      "/sponsors/stable-cluster/3.jpg",
      "/sponsors/stable-cluster/4.jpg",
    ],
    enabled: false,
  },
];
