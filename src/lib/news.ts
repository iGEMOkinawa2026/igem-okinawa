import type { CollectionEntry } from 'astro:content';

type NewsEntry = CollectionEntry<'news'>;
type NewsLanguage = 'en' | 'ja';

export function getNewsLanguage(post: NewsEntry): NewsLanguage {
  if (post.data.language) return post.data.language;
  return post.id.startsWith('ja/') ? 'ja' : 'en';
}

export function getPublishedNewsByLanguage(posts: NewsEntry[], language: NewsLanguage) {
  return posts
    .filter((post) => getNewsLanguage(post) === language && post.data.published)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}
