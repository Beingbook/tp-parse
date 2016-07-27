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

export const TWITTER_CONSUMER_KEY: string = env.TWITTER_CONSUMER_KEY || '6666D9YOND3dtseR4omGs1QHq';
export const TWITTER_CONSUMER_SECRET: string =
  env.TWITTER_CONSUMER_SECRET || 'ASrzA77UL5qGd3uGYSZ4np5NT1bTwRlP4pvWA8DR9BcaNoFedW';

export const FACEBOOK_APP_ID: string = env.FACEBOOK_APP_ID || '816545098482181';

type pioAppConfig = {
  appId: number;
  accessKey: string;
  eventPort: string;
  enginePort: string;
  url: string;
};

export const PIO_TELPO_RECOMMENDATION: pioAppConfig =
  env.PIO_TELPO_RECOMMENDATION ? JSON.parse(env.PIO_TELPO_RECOMMENDATION) : {
    appId: 6,
    accessKey: '6qAF9oMdCYYW55Ln9TVm5iO9CXO1XAB6NotAUEGasAUls93yH4bsHCTedopkVttE',
    eventPort: '7070',
    enginePort: '8000',
    url: 'http://175.126.111.30',
  };
