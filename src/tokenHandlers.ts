import { Temporal } from "@js-temporal/polyfill";
import { Locale, TokenHandler } from "./types";
import { ordinal, shortSigned, zeroPad } from "./utils";

function createPlainDate(date: Temporal.PlainDateLike) {
  if(!date.year || !date.month || !date.day) throw new Error('Couldn\'t construct PlainDate');
  return new Temporal.PlainDate(date.year, date.month, date.day, date.calendar);
}

function plainDateLocaleString(date: Temporal.PlainDateLike,  locale?: Locale, options?: Intl.DateTimeFormatOptions | undefined) {
  const plainDate = createPlainDate(date);
  return plainDate.toLocaleString(locale, options);
}

// Month
export const monthNumber = (date: Temporal.PlainDateLike, locale?: Locale) => plainDateLocaleString(date, locale, { month: 'numeric'}); // 1 2 ... 11 12
export const monthOrdinal = (date: Temporal.PlainDateLike, locale?: Locale) => ordinal(monthNumber(date, locale), locale); // 1st 2nd ... 11th 12th
export const monthPadded = (date: Temporal.PlainDateLike, locale?: Locale) => zeroPad(monthNumber(date, locale), 2); // 01 02 ... 11 12
export const monthShort = (date: Temporal.PlainDateLike, locale?: Locale) => plainDateLocaleString(date, locale, { month: 'short' }); // Jan Feb ... Nov Dec
export const monthLong = (date: Temporal.PlainDateLike, locale?: Locale) => plainDateLocaleString(date, locale, { month: 'long' }); // January February ... November December

// Quarter
export const quarterNumber: TokenHandler = (date) => (Math.floor(((date.month - 1) / 12) * 4)) + 1; // 1 2 3 4
export const quarterOrdinal: TokenHandler = (date, locale) => ordinal(quarterNumber(date), locale); // 1st 2nd 3rd 4th

// Day of Month
export const dayOfMonthNumber: TokenHandler = (date) => date.day; // 1 2 ... 30 31
export const dayOfMonthOrdinal: TokenHandler = (date, locale) => ordinal(dayOfMonthNumber(date), locale); // 1st 2nd ... 30th 31st
export const dayOfMonthPadded: TokenHandler = (date) => zeroPad(dayOfMonthNumber(date), 2); // 01 02 ... 30 31

// Day of Year
export const dayOfYearNumber: TokenHandler = (date) => date.dayOfYear; // 1 2 ... 364 365
export const dayOfYearOrdinal: TokenHandler = (date, locale) => ordinal(dayOfYearNumber(date), locale); // 1st 2nd ... 364th 365th
export const dayOfYearPadded: TokenHandler = (date) => zeroPad(dayOfYearNumber(date), 3); // 001 002 ... 364 365

// Day of Week
export const dayOfWeekNumber: TokenHandler = (date) => date.dayOfWeek === 7 ? 0 : date.dayOfWeek; // 0 1 ... 5 6
export const dayOfWeekOrdinal: TokenHandler = (date, locale) => ordinal(dayOfWeekNumber(date), locale); // 0th 1st ... 5th 6th
export const dayOfWeekNarrow: TokenHandler = (date, locale) => date.toLocaleString(locale, { weekday: 'long' }).substring(0, 2); // Su Mo ... Fr Sa
export const dayOfWeekShort: TokenHandler = (date, locale) => date.toLocaleString(locale, { weekday: 'short' }); // Sun Mon ... Fri Sat
export const dayOfWeekLong: TokenHandler = (date, locale) => date.toLocaleString(locale, { weekday: 'long' }); // Sunday Monday ... Friday Saturday

// Day of Week (ISO)
export const dayOfWeekISONumber: TokenHandler = (date) => date.dayOfWeek // 1 2 ... 6 7

// Week of Year
export const weekOfYearNumber: TokenHandler = (date) => date.weekOfYear; // 1 2 ... 52 53
export const weekOfYearOrdinal: TokenHandler = (date, locale) => ordinal(weekOfYearNumber(date), locale); // 1st 2nd ... 52nd 53rd
export const weekOfYearPadded: TokenHandler = (date) => zeroPad(date.weekOfYear, 2); // 01 02 ... 52 53

// Year
export const yearFull: TokenHandler = (date) => (date.year < 0 ? '-' : '') + zeroPad(Math.abs(date.year), 4) // 1970 1971 ... 2029 2030
export const yearShort: TokenHandler = (date) => (date.year < 0 ? '-' : '') + zeroPad(Math.abs(date.year).toString().slice(-2), 2); // 70 71 ... 29 30

// Era Year
export const eraYear: TokenHandler = (date) => date.eraYear || ''; // 1 2 ... 2020 ...

// Era
// toLocaleString can't just return the era - you get the whole shebang.
const fixEra = (input: string) => {
  const match = /^[^ ]+ ([^,]+)/.exec(input);
  if (!match) throw new Error('Era returned unexpected result');
  return match[1];
}
export const eraShort: TokenHandler = (date, locale) => fixEra(date.toLocaleString(locale, { era: 'short' })); // BC AD
export const eraLong: TokenHandler = (date, locale) => fixEra(date.toLocaleString(locale, { era: 'long' })); // Before Christ, Anno Domini

// Week Year
export const weekYearFull: TokenHandler = (date) => (date.yearOfWeek < 0 ? '-' : '') + zeroPad(Math.abs(date.yearOfWeek), 4) // 1970 1971 ... 2029 2030
export const weekYearShort: TokenHandler = (date) => (date.yearOfWeek < 0 ? '-' : '') + zeroPad(Math.abs(date.yearOfWeek).toString().slice(-2), 2); // 70 71 ... 29 30

// AM/PM
// toLocaleString can't just return am/pm - you get the whole shebang.
const fixAmPm = (input: string) => {
  const match = /^[\d:]+ (.*)/.exec(input);
  if (!match) throw new Error('AM/PM returned unexpected result');
  return match[1];
}
export const amPmUpper: TokenHandler = (date, locale) => fixAmPm(date.toLocaleString(locale, { hour12: true, timeStyle: 'short' }).toUpperCase()); // AM PM
export const amPmLower: TokenHandler = (date, locale) => (amPmUpper(date, locale) as string).toLowerCase(); // am pm

// Hour
export const hourNumber: TokenHandler = (date) => date.hour; // 0 1 ... 22 23
export const hourPadded: TokenHandler = (date) => zeroPad(hourNumber(date), 2); // 00 01 ... 22 23
export const hour12: TokenHandler = (date) => { // 1 2 ... 11 12
  if (date.hour > 11) return date.hour - 12;
  if (date.hour === 0) return 12;
  return date.hour;
}; 
export const hour12Padded: TokenHandler = (date) => zeroPad(hour12(date), 2); // 01 02 ... 11 12

// Minute
export const minuteNumber: TokenHandler = (date) => date.minute; // 0 1 ... 58 59
export const minutePadded: TokenHandler = (date) => zeroPad(minuteNumber(date), 2); // 00 01 ... 58 59

// Second
export const secondNumber: TokenHandler = (date) => date.second; // 0 1 ... 58 59
export const secondPadded: TokenHandler = (date) => zeroPad(secondNumber(date), 2); // 00 01 ... 58 59

// todo: less than a second

// todo: Time Zone

// Unix Timestamp
export const timeStampNumber: TokenHandler = (date) => date.epochSeconds; // 1360013296
export const timeStampMilleseconds: TokenHandler = (date) => date.epochMilliseconds; // 1360013296123
