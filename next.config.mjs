// next.config.mjs / next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    // autorise tes images distantes
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};
export default nextConfig;