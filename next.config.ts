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
      {
        protocol: 'https',
        hostname: 'www.rubbex.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifencheck.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifencheck.de',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifencheck.de',
        pathname: '/images/blogs/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/p/:slug',
        destination: '/produkte/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
