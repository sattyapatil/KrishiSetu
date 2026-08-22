import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@krishisetu/core',
    '@krishisetu/config',
    '@krishisetu/contracts',
    '@krishisetu/policy',
    '@krishisetu/i18n',
    '@krishisetu/notifications',
    '@krishisetu/weather-advisory',
    '@krishisetu/design-tokens',
    '@krishisetu/design-system',
    '@krishisetu/testing',
  ],
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;

