// @flow
/* eslint no-console: 0 */
import express from 'express';

const app = express();
const server = app.listen(process.env.PORT || PORT, () => {
  const { port } = server.address();
  console.log(`The server is listening at http://localhost:${port}`);
  if (DEV) {
    console.log('__DEV_START__');
  }
});

app.get('*', (req, res) => {
  res.status(200).send('Hello World');
});

export default server;
