/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gaza.azureedge.net",
      },
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
