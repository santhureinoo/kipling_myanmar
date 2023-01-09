import mysql from 'serverless-mysql';
import { Sql } from 'sql-ts';
import { users } from './type';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3000,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  }
});

export default async function excuteQuery({ query, values }: any) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

export function getUserSQLObj() {
  //(optionally) set the SQL dialect
  const sql = new Sql('mysql');

  return sql.define<users>({
    name: 'users',
    columns: ['id', 'name', 'password', 'status']
  });
}