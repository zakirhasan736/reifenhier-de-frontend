// eslint-disable-next-line @typescript-eslint/no-require-imports
const { HTML_LIMITED_BOT_UA_RE_STRING } = require('next/dist/shared/lib/router/utils/is-bot');

/**
 * Next streams <title>, description, canonical and OpenGraph tags into the
 * body for user agents it believes run JavaScript — including Googlebot.
 * Search and AI crawlers get the full <head> in the first HTML instead,
 * so indexing never depends on rendering.
 */
const SEO_BOTS =
  'Googlebot|GoogleOther|Storebot-Google|AdsBot-Google|Mediapartners-Google|bingbot|msnbot|PerplexityBot|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|SeznamBot|ecosia|Applebot';

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots: new RegExp(`${HTML_LIMITED_BOT_UA_RE_STRING}|${SEO_BOTS}`, 'i'),
  images: {
    // Extra widths so a 1280–1600px wide screen doesn't download the 1920px
    // hero.
    deviceSizes: [640, 750, 828, 1080, 1200, 1366, 1600, 1920, 2048, 3840],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wp.reifexa.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-ilddjdl.nitrocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.productserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images1.productserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images2.productserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.awin.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.awin1.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.productserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.awin.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifen.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'reifen.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.rubbex.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifexa.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifexa.de',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reifexa.de',
        pathname: '/images/blogs/**',
      },
    ],
  },
  /**
   * Product images downloaded by the backend's daily AWIN job land in
   * public/images/product-image, but `next start` only serves public files
   * that existed at build time — every image added since the last deploy
   * 404'd and products showed the placeholder wheel. Fallback rewrites run
   * only after a public file wasn't found, so build-time images are still
   * served by Next and newer ones are fetched from the API, which reads the
   * same folder on disk. The URL Google and visitors see stays on www.
   */
  async rewrites() {
    const api = (process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de')
      .replace(/\/$/, '')
      .replace(/\/api$/, '');
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/images/product-image/:path*',
          destination: `${api}/images/product-image/:path*`,
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/p/:slug',
        destination: '/produkte/:slug',
        permanent: true,
      },
      {
        source: '/products/:id([0-9a-fA-F]+)',
        destination: '/produkte',
        permanent: true,
      },
      {
        source: '/produkte/:id([0-9a-fA-F]+)',
        destination: '/produkte',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/produkte',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/impressum-datenschutz',
        permanent: true,
      },
      {
        source: '/term-of-services',
        destination: '/AGB',
        permanent: true,
      },
      {
        source: '/term-of-service',
        destination: '/AGB',
        permanent: true,
      },
      {
        source: '/term-services',
        destination: '/AGB',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
