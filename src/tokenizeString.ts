import { Formatter, TokenFormat, StringToken } from "./types";

const tokenCache: Partial<Record<TokenFormat, string[]>> = {};
function getTokens(formatter: Formatter): string[] {
  const cached = tokenCache[formatter.format];
  if (cached !== undefined) return cached;

  const cache = Object.keys(formatter.tokenHandlers)
    .sort((a, b) => a.length > b.length ? -1 : 1);
  tokenCache[formatter.format] = cache;
  return cache;
}

const charCache: Partial<Record<TokenFormat, string[]>> = {};
function getTokenChars(formatter: Formatter): string[] {
  const cached = charCache[formatter.format];
  if (cached !== undefined) return cached;

  const cache: string[] = [];
  Object.keys(formatter.tokenHandlers).forEach((token) => {
    for(const char of token) {
      if (!cache.includes(char)) cache.push(char);
    }
  });
  charCache[formatter.format] = cache;
  return cache;
}

function getToken(input: string, start: number, formatter: Formatter): StringToken {
  const nextChar = input[start];

  // check if this is the start of an escaped string
  const escaped = formatter.escapeString(input, start);
  if (escaped) return escaped;

  // we already know we don't use this char
  const tokenChars = getTokenChars(formatter);
  if (!tokenChars.includes(nextChar)) {
    return { string: nextChar, start, end: start + 1 };
  }

  // actual format tokens
  const tokens = getTokens(formatter);
  for(const token of tokens) {
    if (input.substring(start, start + token.length) === token) {
      return {
        string: token,
        start,
        end: start + token.length,
        handler: formatter.tokenHandlers[token], // TODO: USE ACTUAL HANDLER HERE
      };
    }
  }

  // single unhandleable char
  return { string: nextChar, start, end: start + 1 };
}

// take a string and return an array of tokens to parse
const tokenizeString = (input: string, formatter: Formatter) => {
  const tokens: StringToken[] = [];
  let index = 0;
  while(index < input.length) {
    const match = getToken(input, index, formatter);
    if (tokens.at(-1) && !match.handler && !tokens.at(-1)?.handler) {
      // plain text token, if the previous one was also text, append it
      tokens.at(-1)!.string += match.string;
    } else {
      // otherwise, this is a new token
      tokens.push(match);
    }
    index = match.end;
  }

  return tokens;
}

export default tokenizeString;
