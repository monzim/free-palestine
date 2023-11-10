/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // images: {
  //   domains: ["freepalestine.blob.core.windows.net"],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "freepalestine.blob.core.windows.net",
      },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
