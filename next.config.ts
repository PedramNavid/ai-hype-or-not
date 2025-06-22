import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self';
      connect-src 'self' https://api.github.com https://api.anthropic.com;
      frame-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://www.hypeflo.ws https://www.hypeflo.ws/api/auth/* https://accounts.google.com https://github.com;
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
