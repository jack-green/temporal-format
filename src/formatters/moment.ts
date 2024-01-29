import * as handlers from '../tokenHandlers';
import { Formatter } from '../types';
import { notImplemented } from '../utils';

const ESCAPE_START = '[';
const ESCAPE_END = ']';

const momentFormatter: Formatter = {
  format: 'moment',
  escapeString: (input: string, start: number) => {
    if (input[start] !== ESCAPE_START) return undefined;
    const end = input.indexOf(ESCAPE_END, start);
    if (end < start) throw new Error('Found escape start with no end');
    return {
      start,
      end,
      string: input.substring(start, end)
    }
  },
  tokenHandlers: {
    // Months
    'M': handlers.monthNumber,
    'Mo': handlers.monthOrdinal,
    'MM': handlers.monthPadded,
    'MMM': handlers.monthShort,
    'MMMM': handlers.monthLong,
    
    // Quarter
    'Q': handlers.quarterNumber,
    'Qo': handlers.quarterOrdinal,
    
    // Day of Month
    'D': handlers.dayOfMonthNumber,
    'Do': handlers.dayOfMonthOrdinal,
    'DD': handlers.dayOfMonthPadded,
    
    // Day of Year
    'DDD': handlers.dayOfYearNumber,
    'DDDo': handlers.dayOfYearOrdinal,
    'DDDD': handlers.dayOfYearPadded,

    // Day of Week
    'd': handlers.dayOfWeekNumber,
    'do': handlers.dayOfWeekOrdinal,
    'dd': handlers.dayOfWeekNarrow,
    'ddd': handlers.dayOfWeekShort,
    'dddd': handlers.dayOfWeekLong,

    // Day of Week (Locale) // todo: why is this different from 'd' ?
    'e': handlers.dayOfWeekNumber,

    // Day of Week (ISO)
    'E': handlers.dayOfWeekISONumber,
    
    // Week of Year
    'w': handlers.weekOfYearNumber,
    'wo': handlers.weekOfYearOrdinal,
    'ww': handlers.weekOfYearPadded,

    // Week of Year (ISO) // todo: research this, why is it different from 'w' ?
    'W': handlers.weekOfYearNumber,
    'Wo': handlers.weekOfYearOrdinal,
    'WW': handlers.weekOfYearPadded,
    
    // Year
    'YY': handlers.yearShort,
    'YYYY': handlers.yearFull,
    'YYYYYY': notImplemented,
    'Y': notImplemented,

    // Era Year
    'y': handlers.eraYear,

    // Era
    'N': handlers.eraShort,
    'NN': handlers.eraShort,
    'NNN': handlers.eraShort,
    'NNNN': handlers.eraLong,
    'NNNNN': handlers.eraShort, // todo: what is the difference between this and N, NN, NNN

    // Week Year
    'gg': handlers.weekYearShort,
    'gggg': handlers.weekYearFull,

    // Week Year (ISO)
    'GG': notImplemented,
    'GGGG': notImplemented,

    // AM/PM
    'A': handlers.amPmUpper,
    'a': handlers.amPmLower,

    // Hour
    'H': handlers.hourNumber,
    'HH': handlers.hourPadded,
    'h': handlers.hour12,
    'hh': handlers.hour12Padded,
    'k': notImplemented,
    'kk': notImplemented,

    // Minute
    'm': handlers.minuteNumber,
    'mm': handlers.minutePadded,

    // Second
    's': handlers.secondNumber,
    'ss': handlers.secondPadded,

    // Fractional Second
    'S': notImplemented,
    'SS': notImplemented,
    'SSS': notImplemented,
    'SSSS': notImplemented,
    'SSSSS': notImplemented,
    'SSSSSS': notImplemented,
    'SSSSSSS': notImplemented,
    'SSSSSSSS': notImplemented,
    'SSSSSSSSS': notImplemented,

    // Time Zone
    'z': notImplemented,
    'zz': notImplemented,
    'Z': notImplemented,
    'ZZ': notImplemented,

    // Unix Timestamp
    'X': handlers.timeStampNumber,

    // Unix Millesecond Timestamp
    'x': handlers.timeStampMilleseconds,
  }
}

export default momentFormatter;
