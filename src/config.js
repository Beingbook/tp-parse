// @flow
import path from 'path';

const env = process.env;

export const SERVER_PORT: number = parseInt(process.env.PORT, 10) || PORT;

export const PARSE_CLOUD_PATH: string = path.resolve(__dirname, './cloud.js');
export const PARSE_DATABASE_URI: string = env.PARSE_DATABASE_URI || 'mongodb://localhost:27017';
export const PARSE_APP_ID: string = env.PARSE_APP_ID || 'tp-parse-dev';
export const PARSE_MASTER_KEY: string =
  env.PARSE_MASTER_KEY || 'zj(SDYvFZHBCesB0eJE3ShG{FCo>Buhfmgq3LoFdp';
export const PARSE_SERVER_URL: string = env.PARSE_SERVER_URL || `http://localhost:${SERVER_PORT}/parse`;
