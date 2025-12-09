import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow the qualities used by Next/Image across the site (75 default + 90)
    // to avoid runtime warnings for Cloudinary assets.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
