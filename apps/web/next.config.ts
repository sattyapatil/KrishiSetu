import type { NextConfig } from 'next';
import { loadWebBuildConfig } from '@krishisetu/config/env';

const webBuildConfig = loadWebBuildConfig();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${webBuildConfig.apiBaseUrl}/:path*`,
      },
    ];
  },
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
    '@krishisetu/applications',
    '@krishisetu/dashboard',
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
