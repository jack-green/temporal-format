// import * as handlers from '../tokenHandlers';
import { Formatter } from '../types';

const dateFnsFormatters: Formatter = {
  format: 'date-fns',
  escapeString: () => undefined,
  tokenHandlers: {},
};

export default dateFnsFormatters;