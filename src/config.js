// @flow
import path from 'path';

const env = process.env;

export const SERVER_PORT: number = parseInt(process.env.PORT, 10) || PORT;

export const REDIS_URL: string = env.REDIS_URL || 'redis://localhost:6379';
export const PARSE_CLOUD_PATH: string = path.resolve(__dirname, './cloud.js');
export const PARSE_DATABASE_URI: string = env.PARSE_DATABASE_URI || 'mongodb://localhost:27017';
export const PARSE_APP_ID: string = env.PARSE_APP_ID || 'telpo-parse';
export const PARSE_MASTER_KEY: string =
  env.PARSE_MASTER_KEY || 'zj(SDYvFZHBCesB0eJE3ShG{FCo>Buhfmgq3LoFdp';
export const PARSE_SERVER_URL: string = env.PARSE_SERVER_URL || `http://localhost:${SERVER_PORT}/parse`;
export const APP_URL: string = env.APP_URL || 'http://localhost:3000';

export const FACEBOOK_APP_ID: string = env.FACEBOOK_APP_ID || '816545098482181';
