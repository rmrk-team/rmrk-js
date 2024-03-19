/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ['@rmrk-team/nft-renderer', '@rmrk-team/rmrk-evm-utils'],
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
