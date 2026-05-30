import { z } from "zod";

export const repoSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
});

export const searchSchema = z.object({
  items: z.array(repoSchema),
});

export const prCountSchema = z.object({
  total_count: z.number().int().nonnegative(),
});

export const ecosystemRepoSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  description: z.string().nullable(),
});

export const contributorEntrySchema = z.object({
  author: z.object({ login: z.string() }).nullable(),
  total: z.number().int().nonnegative().optional(),
  weeks: z.array(z.object({ c: z.number().int().nonnegative() })),
});

export const featuredRepoSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  html_url: z.string(),
});

export const stargazersSchema = z.array(z.object({ starred_at: z.string() }));
