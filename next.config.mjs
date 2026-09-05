import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Was X-Frame-Options: DENY. Replaced with the CSP equivalent so the Umami
            // dashboard can still render its Heatmaps page-preview iframe — X-Frame-Options
            // can override frame-ancestors in some browsers, so the two can't coexist. Blocks
            // framing from anywhere except this site and the Umami dashboard origin.
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://stats.antwansherif.com",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Keep the auto-assigned *.vercel.app deployment URL out of the index —
        // the canonical site is antwansherif.com; this host is a duplicate.
        source: "/:path*",
        has: [{ type: "host", value: "antwan-sherif.vercel.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
