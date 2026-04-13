import type { NextConfig } from "next";
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname 
  : '';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:supabaseHostname, // Replace with your actual Supabase URL
      },
    ],
  },
  experimental: {
  caseSensitiveRoutes: true
}
};

export default nextConfig;
