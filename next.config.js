/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "apikey_01HwBcFiHXmVGhTCEBAx7YSU",
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || "apikey_01HwBcFiHXmVGhTCEBAx7YSU",
    LITELLM_API_KEY: process.env.LITELLM_API_KEY || "apikey_01HwBcFiHXmVGhTCEBAx7YSU",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "apikey_01HwBcFiHXmVGhTCEBAx7YSU",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "img.youtube.com",
      "i.ytimg.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
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
    ];
  },
};

module.exports = nextConfig;
