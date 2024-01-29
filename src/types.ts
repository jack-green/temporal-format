import { Temporal } from "@js-temporal/polyfill";

export type Locale = string | string[];
export type TokenHandler = ((date: Temporal.ZonedDateTime, locale?: Locale) => string | number);
export type TokenHandlers = Record<string, TokenHandler>;
export type TokenFormat = 'moment' | 'date_fns';

export interface FormatOptions {
  formatter?: TokenFormat;
  locale?: Locale;
}

export interface StringToken {
  string: string;
  handler?: TokenHandler;
  start: number;
  end: number;
}

export interface Formatter {
  format: TokenFormat;
  tokenHandlers: TokenHandlers;
  escapeString: (input: string, start: number) => StringToken | undefined;
}
