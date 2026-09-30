// src/lib/money.ts
import type { FxSettings } from './settings';

export type MoneyLocale = 'en' | 'ja';

const localeTag = (locale: MoneyLocale) => (locale === 'ja' ? 'ja-JP' : 'en-US');

/** 円。小数は出さない。 */
export function formatJpy(amount: number, locale: MoneyLocale): string {
  return new Intl.NumberFormat(localeTag(locale), {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatEur(amount: number, locale: MoneyLocale): string {
  return new Intl.NumberFormat(localeTag(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** 為替レート自体は小数を落とさない（1 EUR = ￥178.75）。 */
export function formatRate(rate: number, locale: MoneyLocale): string {
  return new Intl.NumberFormat(localeTag(locale), {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 2,
  }).format(rate);
}

/**
 * EUR を円に換算する。目安なので千円単位に丸める。
 * FxNote.astro のブラウザ側の計算と同じ式にしていること。
 */
export function jpyFromEur(amountEur: number, eurJpy: number): number {
  return Math.round((amountEur * eurJpy) / 1000) * 1000;
}
