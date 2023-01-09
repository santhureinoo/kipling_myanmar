/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // env: {
  //   'MYSQL_HOST': '65e.h.filess.io',
  //   'MYSQL_PORT': '3307',
  //   'MYSQL_DATABASE': 'kpdummy_uscrewkept',
  //   'MYSQL_USER': 'kpdummy_uscrewkept',
  //   'MYSQL_PASSWORD': 'e4077a75408ea303ba68b71ac305899794bcccb6',
  // },
  // env: {
  //   'MYSQL_HOST': '127.0.0.1',
  //   'MYSQL_PORT': '3306',
  //   'MYSQL_DATABASE': 'kipling_db',
  //   'MYSQL_USER': 'root',
  //   'MYSQL_PASSWORD': '',
  // },
   env: {
    'MYSQL_HOST': 'vercel-db-7959.7tt.cockroachlabs.cloud',
    'MYSQL_PORT': '26257',
    'MYSQL_DATABASE': 'kipling_db',
    'MYSQL_USER': 'new-admin',
    'MYSQL_PASSWORD': 'q8WcvTTFOqIkB6UcI2TlwQ',
  },
}

module.exports = nextConfig
