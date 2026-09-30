// src/lib/settings.ts
import settingsRaw from '../data/settings.yaml?raw';
import YAML from 'yaml';

export interface BankTransferSettings {
  enabled: boolean;
  bank_name: string;
  branch_name: string;
  account_type: string;
  account_number: string;
  account_holder: string;
  note: string;
}

export interface DonationMethodSettings {
  enabled: boolean;
  url: string;
  note: string;
}

export interface DonationLocaleSettings {
  title: string;
  description: string;
  funding_plan_url: string;
  returns_url: string;
  updates_url: string;
  oist: DonationMethodSettings;
  bank_transfer?: BankTransferSettings;
}

export interface FxSettings {
  /** 1 EUR あたりの円。0 なら円換算を表示しない。取得に失敗したときの表示にも使う。 */
  eur_jpy: number;
  updated: string;
  /** true なら表示時に api_url からその日のレートを取り直す。 */
  live: boolean;
  api_url: string;
  source_url: string;
  converter_url: string;
}

export interface FundingCost {
  label: string;
  label_ja: string;
}

export interface FundingSettings {
  registration_fee_eur: number;
  participation_fee_eur: number;
  /** 表示順そのまま */
  other_costs: FundingCost[];
}

export interface DonationSettings {
  goal_amount: number;
  current_amount: number;
  currency: 'JPY';
  last_updated: string;
  fx: FxSettings;
  funding: FundingSettings;
  ja: DonationLocaleSettings;
  en: DonationLocaleSettings;
}

export interface SiteSettings {
  current_year: number;
  donation: DonationSettings;
}

const emptyBankTransfer: BankTransferSettings = {
  enabled: false,
  bank_name: '',
  branch_name: '',
  account_type: '',
  account_number: '',
  account_holder: '',
  note: '',
};

const emptyDonationLocale = (includeBankTransfer: boolean): DonationLocaleSettings => ({
  title: '',
  description: '',
  funding_plan_url: '',
  returns_url: '',
  updates_url: '',
  oist: { enabled: false, url: '', note: '' },
  ...(includeBankTransfer ? { bank_transfer: { ...emptyBankTransfer } } : {}),
});

const emptyFx: FxSettings = {
  eur_jpy: 0,
  updated: '',
  live: false,
  api_url: '',
  source_url: '',
  converter_url: '',
};

const emptyFunding: FundingSettings = {
  registration_fee_eur: 0,
  participation_fee_eur: 0,
  other_costs: [],
};

const emptyDonation: DonationSettings = {
  goal_amount: 0,
  current_amount: 0,
  currency: 'JPY',
  last_updated: '',
  fx: emptyFx,
  funding: emptyFunding,
  ja: emptyDonationLocale(true),
  en: emptyDonationLocale(false),
};

export function getSettings(): SiteSettings {
  try {
    const parsed = YAML.parse(settingsRaw) as Partial<SiteSettings>;
    const donation = (parsed.donation ?? {}) as Partial<DonationSettings>;
    return {
      current_year: parsed.current_year ?? new Date().getFullYear(),
      donation: {
        ...emptyDonation,
        ...donation,
        currency: 'JPY',
        fx: { ...emptyFx, ...donation.fx },
        funding: {
          ...emptyFunding,
          ...donation.funding,
          other_costs: donation.funding?.other_costs ?? [],
        },
        ja: {
          ...emptyDonation.ja,
          ...donation.ja,
          bank_transfer: {
            ...emptyBankTransfer,
            ...donation.ja?.bank_transfer,
          },
          oist: { ...emptyDonation.ja.oist, ...donation.ja?.oist },
        },
        en: {
          ...emptyDonation.en,
          ...donation.en,
          oist: { ...emptyDonation.en.oist, ...donation.en?.oist },
        },
      },
    };
  } catch (e) {
    console.error('Failed to parse settings.yaml', e);
    return { current_year: new Date().getFullYear(), donation: emptyDonation };
  }
}
