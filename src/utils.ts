import NotImplementedError from "./NotImplementedError";
import { Locale } from "./types";

// todo: I18-ify this?
const pluralMapping = {
  "one" : "st",
  "two" : "nd",
  "few" : "rd",
  "other" : "th"
} as const;

export function ordinal(number: number | string, locale?: Locale): string {
  const plurals = new Intl.PluralRules(locale, { type: 'ordinal' });
  const rule = plurals.select(Number(number));
  const suffix = pluralMapping[rule as keyof typeof pluralMapping];
  if (suffix === undefined) throw new Error(`Unable to get ordinal suffix for ${number}`);
  return `${number}${suffix}`;
}

export function zeroPad(number: number | string, length: number): string {
  return number.toString().padStart(length, '0');
}

export function shortSigned(number: number | string, length: number): string {
  let negative = Number(number) < 0;
  return (negative ? '-' : '') + number.toString().slice(-2);
}

export function getUserLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale;
}

export function notImplemented() {
  throw new NotImplementedError();
  return '';
}