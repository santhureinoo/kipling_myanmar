/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: { domains: ['s1.dmcdn.net'] },
  // reactStrictMode: true,
  // env: {
  //   'MYSQL_HOST': '65e.h.filess.io',
  //   'MYSQL_PORT': '3307',
  //   'MYSQL_DATABASE': 'kpdummy_uscrewkept',
  //   'MYSQL_USER': 'kpdummy_uscrewkept',
  //   'MYSQL_PASSWORD': 'e4077a75408ea303ba68b71ac305899794bcccb6',
  // },
  headers: [
    {
      // matching all API routes
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
      ]
    }
  ],
  images: {
    unoptimized: true,
  },
  // env: {
  //   'MYSQL_HOST': '127.0.0.1',
  //   'MYSQL_PORT': '3306',
  //   'MYSQL_DATABASE': 'kipling_db',
  //   'MYSQL_USER': 'root',
  //   'MYSQL_PASSWORD': '',
  //   'REACT_APP_DAILYMOTION_SECRET': '7fd69e1811f3bf45d6443c449e225c834dccc570',
  //   'REACT_APP_DAILYMOTION_KEY': '2a90bd7fee74fd813cab',
  //   'IRON_SESSION_PASS': 'Cg1gpjtDf7xysym3TrkPP2Zj4MqUsdbR'
  // },
  env: {
    'MYSQL_HOST': 'a9b.h.filess.io',
    'MYSQL_PORT': '3305',
    'MYSQL_DATABASE': 'kiplingdb_almosthas',
    'MYSQL_USER': 'kiplingdb_almosthas',
    'MYSQL_PASSWORD': 'da4fe978ce7a543754e55fce063b0fc750ab8707',
    'REACT_APP_DAILYMOTION_SECRET': '7fd69e1811f3bf45d6443c449e225c834dccc570',
    'REACT_APP_DAILYMOTION_KEY': '2a90bd7fee74fd813cab',
    'IRON_SESSION_PASS': 'Cg1gpjtDf7xysym3TrkPP2Zj4MqUsdbR'
  },
  // env: {
  //   'MYSQL_HOST': 'sql6.freemysqlhosting.net',
  //   'MYSQL_PORT': '3306',
  //   'MYSQL_DATABASE': 'sql6594436',
  //   'MYSQL_USER': 'sql6594436',
  //   'MYSQL_PASSWORD': 'weiueKaMUM',
  //   'REACT_APP_DAILYMOTION_SECRET': '7fd69e1811f3bf45d6443c449e225c834dccc570',
  //   'REACT_APP_DAILYMOTION_KEY': '2a90bd7fee74fd813cab',
  //   'IRON_SESSION_PASS': 'Cg1gpjtDf7xysym3TrkPP2Zj4MqUsdbR'
  // },
}

module.exports = nextConfig
