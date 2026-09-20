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
    date: z.union([z.string(), z.date()]).transform((value) =>
      value instanceof Date ? value.toISOString().slice(0, 10) : value,
    ),
    description: z.string(),
    language: z.enum(['en', 'ja']).optional(),
    published: z.boolean().default(true),
    category: z.string().optional(),
    image: z.string().nullable().optional(),
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

/**
 * プロジェクトページ（/project/ と /ja/project/）のストーリー本文。
 * EN / JA で同じ構造を持ち、`story`（英語）と `story_ja`（日本語）に分かれる。
 *
 * 複数行を持つ項目は、入力した改行位置がそのまま画面上の改行になる。
 * レイアウトが デザインの座標に合わせた絶対配置のため、行数や1行の文字数を
 * 大きく増やすと図形や画像と重なる。既存の行数・文字数を目安にすること。
 */
const projectStory = z.object({
  intent: z.string().default(''),
  problem_heading: z.string().default(''),
  problem_body: z.string().default(''),
  but_lead: z.string().default(''),
  resistance_heading: z.string().default(''),
  resistance_body: z.string().default(''),
  reveal_before: z.string().default(''),
  reveal_word: z.string().default(''),
  reveal_after: z.string().default(''),
  phage_heading: z.string().default(''),
  phage_body: z.string().default(''),
  weakness_heading: z.string().default(''),
  weakness_body: z.string().default(''),
  goal: z.string().default(''),
  how_heading: z.string().default(''),
  how_body: z.string().default(''),
  ai_heading: z.string().default(''),
  ai_body: z.string().default(''),
  impact_heading: z.string().default(''),
  /** 地域課題のカード。レイアウト上、表示されるのは先頭3件まで。 */
  cards: z
    .array(
      z.object({
        title: z.string().default(''),
        body: z.string().default(''),
      }),
    )
    .default([]),
  closing: z.string().default(''),
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
    /**
     * 未入力の場合、プロジェクトページは summary / description
     * （日本語は summary_ja / description_ja）を使った簡易表示にフォールバックする。
     */
    story: projectStory.optional(),
    story_ja: projectStory.optional(),
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
