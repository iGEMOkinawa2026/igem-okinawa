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

export interface DonationSettings {
  goal_amount: number;
  current_amount: number;
  currency: 'JPY';
  last_updated: string;
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

const emptyDonation: DonationSettings = {
  goal_amount: 0,
  current_amount: 0,
  currency: 'JPY',
  last_updated: '',
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
