/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The original design files live here; keep Next from trying to compile them.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
