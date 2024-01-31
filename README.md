# Temporal Formatter

## Moment.js compatible formatter for Temporal Polyfill

## Motivation

During the porting of a large project from moment.js to using the up-coming TC39 Temporal API (still in development) I realised there was no good way of formatting Temporal date objects without having to convert back to a JS Date and using `date-fns` or similar.  This is a small package to introduce string formatting for Temporal objects.

## Installation

```shell
npm install temporal-format

# or
yarn add temporal-format

# or
pnpm install temporal-format
```

## Basic Usage

```js
import { temporalFormat } from `temporal-format`;

const myInstant = Temporal.Now.instant();

const output = temporalFormat(myInstant, 'dddd, MMMM Do YYYY, h:mm:ss a');

// output === 'Sunday, February 14th 2010, 3:25:50 pm'
```

## String format tokens

By default Temporal Format uses the [moment.js format](https://momentjs.com/docs/#/displaying/format/) for displaying dates.

You can switch to the [date-fns format](https://date-fns.org/v3.3.1/docs/format) by either:
```js
// Globally change the formatter
import { setFormatter } from `temporal-format`;
setFormatter('date-fns');

//  Or change the formatter for a specific call via options
temporalFormat(myDate, 'YYYY', { formatter: 'date-fns' });
```

## Options

### formatter: 'moment' | 'date-fns'
Choose which formatter to use to parse the display string (see above).

default: `moment`.

### locale: string | string[]
Specify locale(s) to use when displaying certain tokens (e.g. month name).

A string with a BCP 47 language tag with an optional Unicode extension key, or an array of such strings.

default: User's locale aquired via `Intl.DateTimeFormat().resolvedOptions().locale`


```js

import { temporalFormat } from `temporal-format`;

const myInstant = Temporal.Now.instant(); // pretend this is a thursday.
const displayString = 'EEEE'; // day of the week name
const options = {
  formatter: 'date-fns',
  locale: 'de-DE'
}

const output = temporalFormat(myInstant, displayString, options);

// output === 'Donnerstag'
```

## Tests

Temporal Format has some basic unit tests using the node test runner.

Download this repository, run `(p)npm|yarn install`, then `(p)npm|yarn test` to run the tests.

