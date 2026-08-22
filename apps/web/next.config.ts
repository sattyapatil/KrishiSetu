import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@krishisetu/core',
    '@krishisetu/config',
    '@krishisetu/contracts',
    '@krishisetu/policy',
    '@krishisetu/i18n',
    '@krishisetu/design-tokens',
    '@krishisetu/design-system',
    '@krishisetu/testing',
  ],
};

export default nextConfig;
