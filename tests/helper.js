import { expect } from 'chai';
import { addPath } from 'app-module-path';
import path from 'path';

global.expect = expect;

global.__DEV__ = false;
global.__PORT__ = 8111;

addPath(path.resolve(__dirname, '../src'));
