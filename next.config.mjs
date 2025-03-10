/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.pedigree.com.br',
      },
    ],
  },
};

export default nextConfig;
