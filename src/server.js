// @flow
/* eslint no-console: 0 */
import express from 'express';
import http from 'http';
import { ParseServer } from 'parse-server';
import {
  PARSE_CLOUD_PATH,
  PARSE_DATABASE_URI,
  PARSE_APP_ID,
  PARSE_SERVER_URL,
  PARSE_MASTER_KEY,
  SERVER_PORT,
  FACEBOOK_APP_ID,
  REDIS_URL,
  APP_URL,
} from './config';

const app = express();

app.use('/parse', new ParseServer({
  databaseURI: PARSE_DATABASE_URI,
  masterKey: PARSE_MASTER_KEY,
  appId: PARSE_APP_ID,
  cloud: PARSE_CLOUD_PATH,
  serverURL: PARSE_SERVER_URL,
  publicServerURL: PARSE_SERVER_URL,
  oauth: {
    facebook: {
      appId: FACEBOOK_APP_ID,
    },
  },
  verbose: true,
  liveQuery: {
    classNames: ['_User', 'Game', 'Review'],
    redisURL: REDIS_URL,
  },
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      fromAddress: 'no-reply@telpo.co.kr',
      domain: 'sandbox62078ad2f196482eba6fc91e6d1295fd.mailgun.org',
      apiKey: 'key-90728348be076a93b3e949cf66e9e0ee',
    },
  },
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60,
  preventLoginWithUnverifiedEmail: false,
  appName: 'Telpo App',
  customPages: {
    invalidLink: `${APP_URL}/invalidLink`,
    verifyEmailSuccess: `${APP_URL}/verifyEmailSuccess`,
    choosePassword: `${APP_URL}/choosePasword`,
    passwordResetSuccess: `${APP_URL}/passwordResetSuccess`,
  },
}));

app.get('*', (req, res) => {
  res.status(200).send('Hello World');
});

const server: Object = http.createServer(app);
server.listen(SERVER_PORT, () => {
  const { port } = server.address();
  console.log(`The server is listening at http://localhost:${port}`);
  if (DEV) {
    console.log('__DEV_START__');
  }
});

ParseServer.createLiveQueryServer(server, {
  redisURL: REDIS_URL,
});

export default server;
