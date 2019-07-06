import { Pool } from 'pg';

export default () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return pool;
};
