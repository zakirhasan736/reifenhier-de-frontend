/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-ilddjdl.nitrocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images2.productserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifen.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
