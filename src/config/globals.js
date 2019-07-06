import Debug from 'debug';

import createPool from './database';

export default (cb = () => {}) => {
  /*
  *  Loggers
  * */
  global.log = Debug('wayfarer-api:server');

  /*
  *  Database connection pool
  * */
  global.db = createPool();

  cb();
};
