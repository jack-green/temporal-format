import { Temporal, toTemporalInstant } from '@js-temporal/polyfill';
import moment from 'moment-timezone';
import { test, describe } from 'node:test';
import assert from 'node:assert';

import { formatTemporal } from '../src/index';
import NotImplementedError from '../src/NotImplementedError';

const DEFAULT_TIMEZONE = 'UTC';

declare global {
  interface Date {
    toTemporalInstant: typeof toTemporalInstant;
  }
}
Date.prototype.toTemporalInstant = toTemporalInstant;

interface TemporalSettings {
  calendar?: string;
  timeZone?: string;
}

function comparativeTest(jsDate: Date, format: string, expectedResult: string, temporalSettings?: TemporalSettings) {
  return test(`${jsDate.toUTCString()} with format '${format}' outputs '${expectedResult}'`, () => {
    const momentDate = moment.tz(jsDate, temporalSettings?.timeZone || DEFAULT_TIMEZONE);
    const momentResult = momentDate.format(format);
    assert.strictEqual(momentResult, expectedResult, `moment: got '${momentResult}' instead of '${expectedResult}'`);

    const temporalInstant = jsDate.toTemporalInstant();
    const dateTime = temporalInstant.toZonedDateTime({
      calendar: new Temporal.Calendar(temporalSettings?.calendar || 'iso8601'),
      timeZone: temporalSettings?.timeZone || DEFAULT_TIMEZONE
    });
    
    let temporalResult: string;
    try {
      temporalResult = formatTemporal(dateTime, format);
    } catch(error) {
      if (error instanceof NotImplementedError) return; // ignore this for now
      throw error;
    }
    assert.strictEqual(temporalResult, expectedResult, `temporal: got '${temporalResult}' instead of '${expectedResult}'`);
  });
}


describe('Month', () => {
  describe('M: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'},
      { date: new Date(Date.UTC(2024, 11, 1)), expected: '12'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'M', expected);
    })
  });

  describe('Mo: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1st'},
      { date: new Date(Date.UTC(2024, 1, 1)), expected: '2nd'},
      { date: new Date(Date.UTC(2024, 2, 1)), expected: '3rd'},
      { date: new Date(Date.UTC(2024, 3, 1)), expected: '4th'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'Mo', expected);
    })
  });

  describe('MM: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '01'},
      { date: new Date(Date.UTC(2024, 9, 1)), expected: '10'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'MM', expected);
    })
  });

  describe('MMM: short', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'Jan'},
      { date: new Date(Date.UTC(2024, 5, 1)), expected: 'Jun'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'MMM', expected);
    })
  });

  describe('MMMM: long', () => {
    [
      { date: new Date(Date.UTC(2024, 2, 1)), expected: 'March'},
      { date: new Date(Date.UTC(2024, 8, 1)), expected: 'September'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'MMMM', expected);
    })
  });
});

describe('Quarter', () => {
  describe('Q: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'},
      { date: new Date(Date.UTC(2024, 5, 1)), expected: '2'},
      { date: new Date(Date.UTC(2024, 8, 1)), expected: '3'},
      { date: new Date(Date.UTC(2024, 11, 1)), expected: '4'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'Q', expected);
    })
  });

  describe('Q: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1st'},
      { date: new Date(Date.UTC(2024, 5, 1)), expected: '2nd'},
      { date: new Date(Date.UTC(2024, 8, 1)), expected: '3rd'},
      { date: new Date(Date.UTC(2024, 11, 1)), expected: '4th'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'Qo', expected);
    })
  });
});

describe('Day of Month', () => {
  describe('D: number', () => {
    [
      { date: new Date(Date.UTC(2024, 1, 1)), expected: '1'},
      { date: new Date(Date.UTC(2024, 1, 29)), expected: '29'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'D', expected);
    })
  });

  describe('Do: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 1, 1)), expected: '1st'},
      { date: new Date(Date.UTC(2024, 1, 29)), expected: '29th'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'Do', expected);
    })
  });

  describe('DD: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 1, 1)), expected: '01'},
      { date: new Date(Date.UTC(2024, 1, 29)), expected: '29'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'DD', expected);
    })
  });
});

describe('Day of Year', () => {
  describe('DDD: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'},
      { date: new Date(Date.UTC(2024, 3, 3)), expected: '94'},
      { date: new Date(Date.UTC(2024, 11, 30)), expected: '365'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'DDD', expected);
    })
  });

  describe('DDDo: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1st'},
      { date: new Date(Date.UTC(2024, 3, 3)), expected: '94th'},
      { date: new Date(Date.UTC(2024, 11, 30)), expected: '365th'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'DDDo', expected);
    })
  });

  describe('DDDD: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '001'},
      { date: new Date(Date.UTC(2024, 3, 3)), expected: '094'},
      { date: new Date(Date.UTC(2024, 11, 30)), expected: '365'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'DDDD', expected);
    })
  });
});

describe('Day of Week', () => {
  describe('d: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: '3'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: '5'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: '0'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'd', expected);
    })
  });

  describe('do: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1st'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: '3rd'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: '5th'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: '0th'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'do', expected);
    })
  });

  describe('dd: narrow', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'Mo'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: 'We'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: 'Fr'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: 'Su'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'dd', expected);
    })
  });

  describe('ddd: short', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'Mon'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: 'Wed'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: 'Fri'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: 'Sun'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'ddd', expected);
    })
  });

  describe('dddd: full', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'Monday'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: 'Wednesday'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: 'Friday'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: 'Sunday'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'dddd', expected);
    })
  });
});

describe('Day of Week (Locale)	', () => {
  describe('e: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: '3'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: '5'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: '0'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'e', expected);
    })
  });
});

describe('Day of Week (ISO)	', () => {
  describe('e: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'}, // Monday
      { date: new Date(Date.UTC(2024, 1, 14)), expected: '3'}, // Wednesday
      { date: new Date(Date.UTC(2024, 5, 7)), expected: '5'}, // Friday
      { date: new Date(Date.UTC(2024, 11, 22)), expected: '7'}, // Sunday
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'E', expected);
    })
  });
});

describe('Week of Year', () => {
  describe('w: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'},
      { date: new Date(Date.UTC(2024, 11, 28)), expected: '52'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'w', expected);
    })
  });

  describe('wo: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1st'},
      { date: new Date(Date.UTC(2024, 11, 28)), expected: '52nd'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'wo', expected);
    })
  });

  describe('ww: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '01'},
      { date: new Date(Date.UTC(2024, 11, 28)), expected: '52'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'ww', expected);
    })
  });
});

describe('Week of Year (ISO)', () => {
  describe('W: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1'},
      { date: new Date(Date.UTC(2024, 11, 28)), expected: '52'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'W', expected);
    })
  });

  describe('Wo: ordinal', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '1st'},
      { date: new Date(Date.UTC(2024, 11, 28)), expected: '52nd'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'Wo', expected);
    })
  });

  describe('WW: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '01'},
      { date: new Date(Date.UTC(2024, 11, 28)), expected: '52'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'WW', expected);
    })
  });
});

describe('Year', () => {
  describe('YY: short year', () => {
    [
      { date: new Date(Date.UTC(2023, 1, 1)), expected: '23'},
      { date: new Date(Date.UTC(150, 1, 1)), expected: '50'},
      { date: new Date(Date.UTC(-150, 1, 1)), expected: '-50'},
      { date: new Date('0004-01-01T00:00:00Z'), expected: '04'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'YY', expected);
    })
  });

  describe('YYYY: full year', () => {
    [
      { date: new Date(Date.UTC(2023, 1, 1)), expected: '2023'},
      { date: new Date(Date.UTC(150, 1, 1)), expected: '0150'},
      { date: new Date(Date.UTC(-150, 1, 1)), expected: '-0150'},
      { date: new Date('0004-01-01T00:00:00Z'), expected: '0004'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'YYYY', expected);
    })
  });
});

describe('Era Year', () => {
  describe('y: number', () => {
    [
      // iso8601 does not do era year, so we need to test using a different calendar
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '2024', settings: { calendar: 'gregory'} }, 
      { date: new Date(Date.UTC(-200, 0, 1)), expected: '201', settings: { calendar: 'gregory'} },
    ].forEach(({ date, expected, settings }) => {
      comparativeTest(date, 'y', expected, settings );
    })
  });

});

describe('Era', () => {
  describe('N, NN, NNN: Era', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'AD' }, 
      { date: new Date(Date.UTC(-200, 0, 1)), expected: 'BC' },
    ].forEach(({ date, expected }) => {
      ['N', 'NN', 'NNN'].forEach((token) => {
        comparativeTest(date, token, expected );
      });
    })
  });

  describe('NNNN: Full Era', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'Anno Domini'}, 
      { date: new Date(Date.UTC(-200, 0, 1)), expected: 'Before Christ'},
    ].forEach(({ date, expected }) => {
      comparativeTest(date, 'NNNN', expected );
    })
  });

  describe('NNNNN: Narrow Era', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: 'AD' }, 
      { date: new Date(Date.UTC(-200, 0, 1)), expected: 'BC' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'NNNNN', expected );
    })
  });

});

describe('Week Year', () => {
  describe('gg: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '24' }, 
      { date: new Date(Date.UTC(3050, 0, 1)), expected: '50' },
      { date: new Date(Date.UTC(-150, 0, 1)), expected: '-50' }, 
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'gg', expected );
    })
  });

  describe('gggg: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '2024' }, 
      { date: new Date(Date.UTC(3050, 0, 1)), expected: '3050' },
      { date: new Date(Date.UTC(-150, 0, 1)), expected: '-0150' }, 
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'gggg', expected );
    })
  });

});

describe('Week Year (ISO)', () => {
  describe('GG: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '24' }, 
      { date: new Date(Date.UTC(3050, 0, 1)), expected: '50' },
      { date: new Date(Date.UTC(-150, 0, 1)), expected: '-50' }, 
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'GG', expected );
    })
  });

  describe('GGGG: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1)), expected: '2024' }, 
      { date: new Date(Date.UTC(3050, 0, 1)), expected: '3050' },
      { date: new Date(Date.UTC(-150, 0, 1)), expected: '-0150' }, 
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'GGGG', expected );
    })
  });
});

describe('AM/PM', () => {

  describe('A: upper case', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 4)), expected: 'AM' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 16)), expected: 'PM' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'A', expected );
    })
  });

  describe('a: lower case', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 4)), expected: 'am' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 16)), expected: 'pm' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'a', expected );
    })
  });

});

describe('Hour', () => {
  describe('H: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0)), expected: '0' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 16)), expected: '16' },
      { date: new Date(Date.UTC(2024, 0, 1, 23)), expected: '23' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'H', expected );
    })
  });

  describe('HH: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0)), expected: '00' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 16)), expected: '16' },
      { date: new Date(Date.UTC(2024, 0, 1, 23)), expected: '23' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'HH', expected );
    })
  });

  describe('h: number (12h)', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0)), expected: '12' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 8)), expected: '8' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 16)), expected: '4' },
      { date: new Date(Date.UTC(2024, 0, 1, 23)), expected: '11' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'h', expected );
    })
  });

  describe('hh: padded (12h)', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0)), expected: '12' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 8)), expected: '08' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 16)), expected: '04' },
      { date: new Date(Date.UTC(2024, 0, 1, 23)), expected: '11' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'hh', expected );
    })
  });

  describe.skip('k: ', () => {
    // todo
  });

  describe.skip('kk: ', () => {
    // todo
  });

});

describe('Minute', () => {
  describe('m: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0)), expected: '0' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 8)), expected: '8' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 31)), expected: '31' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 59)), expected: '59' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'm', expected );
    })
  });

  describe('mm: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0)), expected: '00' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 8)), expected: '08' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 31)), expected: '31' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 59)), expected: '59' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'mm', expected );
    })
  });

});

describe('Second', () => {
  describe('s: number', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0)), expected: '0' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 8)), expected: '8' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 31)), expected: '31' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 59)), expected: '59' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 's', expected );
    })
  });

  describe('ss: padded', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0)), expected: '00' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 8)), expected: '08' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 31)), expected: '31' }, 
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 59)), expected: '59' },
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'ss', expected );
    })
  });

});

describe('Fractional Second', () => {
  const full = '123000000';
  for(let length = 1; length < 10; length +=1 ) {
    const format = 'S'.repeat(length);
    describe(`${format}: ${length} digits`, () => {
      [
        { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0)), expected: '0'.repeat(length) }, 
        { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 123)), expected: full.substring(0, length) }, 
      ].forEach(({ date, expected }) => {
          comparativeTest(date, format, expected );
      })
    });
  }
});

describe('Time Zone', () => {
  describe('z or zz: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0)), expected: 'UTC' }, // default
      { date: new Date(2024, 0, 1, 0, 0, 0, 0), expected: 'AEDT', settings: { timeZone: 'Australia/Melbourne'} },
    ].forEach(({ date, expected, settings }) => {
        comparativeTest(date, 'z', expected, settings);
    })
  });

  describe('Z: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0)), expected: '+00:00' },
      { date: new Date(2024, 0, 1, 0, 0, 0, 0), expected: '+11:00', settings: { timeZone: 'Australia/Melbourne'} },
    ].forEach(({ date, expected, settings }) => {
        comparativeTest(date, 'Z', expected, settings);
    })
  });

  describe('ZZ: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0)), expected: '+0000' },
      { date: new Date(2024, 0, 1, 0, 0, 0, 0), expected: '+1100', settings: { timeZone: 'Australia/Melbourne'} },
    ].forEach(({ date, expected, settings }) => {
        comparativeTest(date, 'ZZ', expected, settings);
    })
  });

});

describe('Unix Timestamp', () => {
  describe('X: timestamp', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0)), expected: '1704067200' }, 
      { date: new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0)), expected: '0' }, 
      { date: new Date(Date.UTC(-150, 0, 1)), expected: '-66900729600' }, 
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'X', expected );
    })
  });
});

describe('Unix Millisecond Timestamp', () => {
  describe('x: ', () => {
    [
      { date: new Date(Date.UTC(2024, 0, 1, 0, 0, 0)), expected: '1704067200000' }, 
      { date: new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0)), expected: '0' }, 
      { date: new Date(Date.UTC(-150, 0, 1)), expected: '-66900729600000' }, 
    ].forEach(({ date, expected }) => {
        comparativeTest(date, 'x', expected );
    })
  });
});
