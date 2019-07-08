import { Pool } from 'pg';

let pool;
export default () => {
  if (pool) {
    return pool;
  }
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return pool;
};
