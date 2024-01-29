// import * as handlers from '../tokenHandlers';
import { Formatter } from '../types';

const dateFnsFormatters: Formatter = {
  format: 'date_fns',
  escapeString: () => undefined,
  tokenHandlers: {},
};

export default dateFnsFormatters;