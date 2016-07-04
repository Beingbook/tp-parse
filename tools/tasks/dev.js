import webpack from 'webpack';
import { webpackServer, stats } from '../config';
import run from '../lib/run';
import serve from './serve';
import clean from './clean';
import copy from './copy';

function devWatcher() {
  return new Promise((resolve, reject) => {
    const webpackPackage = [webpackServer];
    const bundler = webpack(webpackPackage);
    bundler.watch(200, async (error, res) => {
      if (error) {
        return reject(error);
      }
      console.log(res.toString(stats));
      await serve();
      return resolve();
    });
  });
}

async function dev() {
  await run(clean);
  await run(copy);
  await devWatcher();
}

export default dev;
