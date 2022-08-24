export type MetaData = {
  [key: string]: string;
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
