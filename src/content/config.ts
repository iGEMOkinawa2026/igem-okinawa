import { defineCollection, z } from 'astro:content';

const activities = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    title_ja: z.string().optional(),
    description_ja: z.string().optional(),
    date: z.string().optional(),
    date_ja: z.string().optional(),
    detail: z.string().optional(),
    detail_ja: z.string().optional(),
    image: z.string().optional(),
    imagePlaceholder: z.string().optional(),
    imagePlaceholder_ja: z.string().optional(),
    order: z.number().default(0),
  }),
});

const sponsors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    name_ja: z.string().optional(),
    logo: z.string().optional(),
    tier: z.enum(['gold', 'silver', 'bronze', 'partner']).default('partner'),
    order: z.number().default(0),
  }),
});

const archive = defineCollection({
  type: 'content',
  schema: z.object({
    year: z.number(),
    title: z.string(),
    summary: z.string(),
    title_ja: z.string().optional(),
    summary_ja: z.string().optional(),
    wiki_url: z.string().optional(),
    universities: z.string().optional(),
    order: z.number().default(0),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    language: z.enum(['en', 'ja']),
    published: z.boolean().default(false),
    slug: z.string(),
    category: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    name_ja: z.string().optional(),
    role: z.string().optional(),
    role_ja: z.string().optional(),
    team: z.enum(['wet', 'dry', 'human practice', 'funding', 'wiki-video']).optional(),
    roles: z.array(z.string()).optional(),
    is_leader: z.boolean().default(false),
    image: z.string().optional(),
    bio: z.string().optional(),
    bio_ja: z.string().optional(),
    institution: z.string().optional(),
    institution_ja: z.string().optional(),
    order: z.number().default(0),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: z.object({
    year: z.number(),
    title: z.string(),
    title_ja: z.string().optional(),
    summary: z.string(),
    summary_ja: z.string().optional(),
    wiki_url: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    description_ja: z.string().optional(),
  }),
});

export const collections = {
  activities,
  sponsors,
  archive,
  news,
  members,
  project,
};
