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
  preventLoginWithUnverifiedEmail: false,
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
