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

/**
 * EUR 表記に円換算を併記する。
 * レート未設定（0）のときは EUR だけを返す。
 * 換算値は目安なので、千円単位に丸めて桁を落とす。
 */
export function formatEurWithJpy(
  amountEur: number,
  fx: FxSettings,
  locale: MoneyLocale,
): string {
  const eur = formatEur(amountEur, locale);
  if (!fx.eur_jpy) return eur;

  const jpy = Math.round((amountEur * fx.eur_jpy) / 1000) * 1000;
  return locale === 'ja'
    ? `${eur}（約${formatJpy(jpy, locale)}）`
    : `${eur} (approx. ${formatJpy(jpy, locale)})`;
}

/** 「1 EUR = ¥170（2026-09-17 時点）」のような注記。 */
export function fxNote(fx: FxSettings, locale: MoneyLocale): string {
  if (!fx.eur_jpy) return '';
  const rate = formatJpy(fx.eur_jpy, locale);
  return locale === 'ja'
    ? `円換算は 1 EUR = ${rate}（${fx.updated} 時点）で計算した目安です。`
    : `Yen figures are approximate, converted at 1 EUR = ${rate} as of ${fx.updated}.`;
}
