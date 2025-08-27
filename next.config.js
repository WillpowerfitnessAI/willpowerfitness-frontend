// next.config.js

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self' https://*.stripe.com",
      "img-src 'self' data: https:",
      // allow Stripe/Vercel insights + eval for Next bundles
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: *.stripe.com *.vercel-insights.com",
      // allow remote CSS if any (e.g., hosted fonts stylesheets)
      "style-src 'self' 'unsafe-inline' https:",
      // ✅ allow HTTPS fonts (fixes your CSP font error)
      "font-src 'self' data: https:",
      // API & realtime calls your app needs
      "connect-src 'self' https://api.willpowerfitnessai.com https://*.supabase.co https://*.stripe.com https://*.vercel-insights.com",
      // Stripe iframes
      "frame-src https://js.stripe.com"
    ].join('; ')
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
