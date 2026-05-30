import type { allProjects } from "content-collections";

export type Project = (typeof allProjects)[number] & {
  liveLink?: string;
  updatedAt?: string;
};

export enum Form {
  Initial,
  Loading,
  Success,
  Error,
}

export type FormState = {
  state: Form;
  message?: string;
};
