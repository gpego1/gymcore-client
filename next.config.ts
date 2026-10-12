import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  experimental: {
    cpus: 2,
    workerThreads: true
  }
};
export default config;
