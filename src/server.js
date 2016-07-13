// @flow
/* eslint no-console: 0 */
import express from 'express';
import { ParseServer } from 'parse-server';
import {
  PARSE_CLOUD_PATH,
  PARSE_DATABASE_URI,
  PARSE_APP_ID,
  PARSE_SERVER_URL,
  PARSE_MASTER_KEY,
  SERVER_PORT,
  FACEBOOK_APP_ID,
} from './config';

const app = express();

app.use('/parse', new ParseServer({
  databaseURI: PARSE_DATABASE_URI,
  masterKey: PARSE_MASTER_KEY,
  appId: PARSE_APP_ID,
  cloud: PARSE_CLOUD_PATH,
  serverURL: PARSE_SERVER_URL,
  oauth: {
    facebook: {
      appId: FACEBOOK_APP_ID,
    },
  },
}));

app.get('*', (req, res) => {
  res.status(200).send('Hello World');
});

const server = app.listen(SERVER_PORT, () => {
  const { port } = server.address();
  console.log(`The server is listening at http://localhost:${port}`);
  if (DEV) {
    console.log('__DEV_START__');
  }
});

export default server;
