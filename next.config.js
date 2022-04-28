const WP_HOST = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL).hostname;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: ['node_modules'],
  },
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: [WP_HOST],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
