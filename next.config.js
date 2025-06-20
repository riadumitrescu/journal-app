/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tlisradyhpaqlzxbblhm.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig 