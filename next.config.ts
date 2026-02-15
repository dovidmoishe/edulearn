import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'syvlfqtwjnnhohajuhhg.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lmektyexzejjvisjpzxu.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer }) => {
    // Exclude server-only Remotion packages from client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Exclude server-only Remotion packages
        '@remotion/renderer': false,
        '@remotion/studio-server': false,
        'remotion': false,
      };

      // Set fallbacks for Node.js core modules to false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        worker_threads: false,
        module: false,
        constants: false,
        os: false,
        tty: false,
        prettier: false,
      };
    }

    return config;
  },
};

export default nextConfig;
