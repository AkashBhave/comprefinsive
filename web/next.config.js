/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NAME: process.env.NAME,
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
