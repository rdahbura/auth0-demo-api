import 'dotenv/config';

import throng from 'throng';

import start from './app';
import { WEB_CONCURRENCY } from './utils/constants';

const WORKERS = WEB_CONCURRENCY || 1;

throng(WORKERS, start);
