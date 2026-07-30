/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ["@novanews/core", "@novanews/database"],
};

export default nextConfig;
