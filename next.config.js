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
  env: {
    'MYSQL_HOST': '127.0.0.1',
    'MYSQL_PORT': '3306',
    'MYSQL_DATABASE': 'kipling_db',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': '',
  },
}

module.exports = nextConfig
