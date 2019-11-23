import 'dotenv/config';

import throng from 'throng';

import app from './app';
import { WEB_CONCURRENCY } from './utils/constants';

const workers = parseInt(WEB_CONCURRENCY || '1');

throng({
  start: app,
  workers: workers,
});
