export type MetaData = {
  // [key: string]: string;
  title: string;
  description: string;
  image: string;
  url?: string;
  schemaType?: string;
  createdAt?: string;
};
export type SiteInfo = {
  title: string;
  description: string;
  tagline: string;
  logo: string;
  logo_white: string;
  image: string;
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
};

export type Project = {
  slug: string;
  data: {
    title: string;
    description: string;
    published_at: string;
    tags: string;
    image: string;
    link: string;
  };
  content: any;
};

export type SEOProps = {
  title: string;
  description: string;
  image: string;
  url: string;
  openGraphType?: string;
  schemaType?: string;
  createdAt?: string;
  updatedAt?: string;
};
