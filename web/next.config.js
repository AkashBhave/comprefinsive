/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NAME: process.env.NAME,
  },
};

module.exports = nextConfig;
