import { CapacitorHttp, HttpResponse } from '@capacitor/core';
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

export async function dailyMotionAuth(token: string | null) {
  if (!token) {
    let token;
    const options = {
      url: '/api/dailymotion_auth',
    };
    const response: HttpResponse = await CapacitorHttp.get(options)
    // localStorage.setItem('daily_motion_token', JSON.stringify(response.data));
    token = response.data;
    return token;
  } else {
    const tokenData = JSON.parse(token || '');
    return tokenData;
  }
}

export const ironOptions = {
  cookieName: "iron_session_cookie",
  password: process.env.IRON_SESSION_PASS || '',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const mysqlLastId = 'SELECT LAST_INSERT_ID() as ID';