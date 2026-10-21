import { PlanPricing, SupportedCurrency } from './types';

export interface CountryInfo {
  code: string;
  name: string;
  currency: SupportedCurrency;
  phoneCode: string;
  timezone: string;
  locale: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'US', name: 'United States', currency: 'USD', phoneCode: '+1', timezone: 'America/New_York', locale: 'en-US' },
  { code: 'GB', name: 'United Kingdom', currency: 'EUR', phoneCode: '+44', timezone: 'Europe/London', locale: 'en-GB' },
  { code: 'DE', name: 'Germany', currency: 'EUR', phoneCode: '+49', timezone: 'Europe/Berlin', locale: 'de-DE' },
  { code: 'FR', name: 'France', currency: 'EUR', phoneCode: '+33', timezone: 'Europe/Paris', locale: 'fr-FR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', phoneCode: '+31', timezone: 'Europe/Amsterdam', locale: 'nl-NL' },
  { code: 'IN', name: 'India', currency: 'INR', phoneCode: '+91', timezone: 'Asia/Kolkata', locale: 'en-IN' },
  { code: 'CA', name: 'Canada', currency: 'USD', phoneCode: '+1', timezone: 'America/Toronto', locale: 'en-CA' },
  { code: 'AU', name: 'Australia', currency: 'USD', phoneCode: '+61', timezone: 'Australia/Sydney', locale: 'en-AU' },
  { code: 'SG', name: 'Singapore', currency: 'USD', phoneCode: '+65', timezone: 'Asia/Singapore', locale: 'en-SG' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'USD', phoneCode: '+971', timezone: 'Asia/Dubai', locale: 'en-AE' },
  { code: 'CH', name: 'Switzerland', currency: 'EUR', phoneCode: '+41', timezone: 'Europe/Zurich', locale: 'de-CH' },
  { code: 'SE', name: 'Sweden', currency: 'EUR', phoneCode: '+46', timezone: 'Europe/Stockholm', locale: 'sv-SE' },
  { code: 'ES', name: 'Spain', currency: 'EUR', phoneCode: '+34', timezone: 'Europe/Madrid', locale: 'es-ES' },
  { code: 'IT', name: 'Italy', currency: 'EUR', phoneCode: '+39', timezone: 'Europe/Rome', locale: 'it-IT' },
  { code: 'JP', name: 'Japan', currency: 'USD', phoneCode: '+81', timezone: 'Asia/Tokyo', locale: 'ja-JP' },
  { code: 'BR', name: 'Brazil', currency: 'USD', phoneCode: '+55', timezone: 'America/Sao_Paulo', locale: 'pt-BR' },
  { code: 'ZA', name: 'South Africa', currency: 'USD', phoneCode: '+27', timezone: 'Africa/Johannesburg', locale: 'en-ZA' },
  { code: 'NZ', name: 'New Zealand', currency: 'USD', phoneCode: '+64', timezone: 'Pacific/Auckland', locale: 'en-NZ' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', phoneCode: '+353', timezone: 'Europe/Dublin', locale: 'en-IE' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', phoneCode: '+32', timezone: 'Europe/Brussels', locale: 'fr-BE' }
];

export const REGIONAL_PRICING: Record<SupportedCurrency, PlanPricing> = {
  EUR: {
    currency: 'EUR',
    symbol: '€',
    monthly: 9,
    annual: 90,
    formattedMonthly: '€9',
    formattedAnnual: '€90',
    taxNote: 'VAT included where applicable'
  },
  USD: {
    currency: 'USD',
    symbol: '$',
    monthly: 10,
    annual: 100,
    formattedMonthly: '$10',
    formattedAnnual: '$100',
    taxNote: 'Local taxes may apply at checkout'
  },
  INR: {
    currency: 'INR',
    symbol: '₹',
    monthly: 899,
    annual: 8999,
    formattedMonthly: '₹899',
    formattedAnnual: '₹8,999',
    taxNote: 'GST (18%) included where applicable'
  }
};

export function getCountryByCode(code: string): CountryInfo {
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase()) || COUNTRIES[0];
}

export function formatPrice(amount: number, currency: SupportedCurrency): string {
  const info = REGIONAL_PRICING[currency];
  return `${info.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: amount % 1 === 0 ? 0 : 2 })}`;
}
