import { Temporal } from "@js-temporal/polyfill";
import tokenizeString from "./tokenizeString";
import momentFormatter from "./formatters/moment";
import dateFnsFormatter from "./formatters/date_fns";
import { getUserLocale } from "./utils";
import { FormatOptions, Formatter, Locale, TokenFormat } from "./types";

const formatters: Record<TokenFormat, Formatter> = {
  moment: momentFormatter,
  date_fns: dateFnsFormatter,
};

let defaultLocale: Locale = getUserLocale();
let defaultFormatter: TokenFormat = 'moment'

export function setLocale(locale: Locale | undefined) {
  // todo: validate locale?
  defaultLocale = locale || getUserLocale();
}

export function setFormatter(format: TokenFormat) {
  // todo: validate format?
  defaultFormatter = format;
}

function getLocale(options?: FormatOptions) {
  let locale = options?.locale || defaultLocale;
  // todo: validate locale
  return locale;
}

function getFormatter(options?: FormatOptions): Formatter {
  const formatterName = options?.formatter || defaultFormatter;
  if (!formatterName) throw new Error('No formatter specified');

  const formatter = formatters[formatterName as keyof typeof formatters];
  if (!formatter) throw new Error(`Token mapping ${formatterName} does not exist`);

  return formatter;
}

export function formatZonedDateTime(date: Temporal.ZonedDateTime, format: string, options?: FormatOptions) {
  const locale = getLocale(options);
  const formatter = getFormatter(options);
  const tokens = tokenizeString(format, formatter)

  const output = tokens.reduce((current, token) => {
    return `${current}${token.handler ? token.handler(date, locale) : token.string}`;
  }, '');

  return output;
}

export function formatInstant(date: Temporal.Instant, format: string, options?: FormatOptions & { timeZone?: Temporal.TimeZoneLike }) {
  const tz = options?.timeZone || Temporal.Now.timeZoneId();
  const zoned = date.toZonedDateTimeISO(tz);
  return formatZonedDateTime(zoned, format, options);
}

type TemporalThing = Temporal.ZonedDateTime | Temporal.Instant;

export function formatTemporal(date: TemporalThing, format: string, options?: FormatOptions) {
  if (date instanceof Temporal.ZonedDateTime) return formatZonedDateTime(date, format, options);
  else if(date instanceof Temporal.Instant) return formatInstant(date, format, options);
  throw new Error(`Don't know how to format this ting.`);
}
