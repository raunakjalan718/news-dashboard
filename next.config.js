/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'source.unsplash.com', 
      'static.foxnews.com', 
      'media.cnn.com', 
      'cdn.cnn.com', 
      'i.kinja-img.com', 
      'nypost.com', 
      'static01.nyt.com',
      'ichef.bbci.co.uk',
      'assets.bwbx.io'
    ],
  },
  // This is needed to allow Next.js to process SVG files
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
}

module.exports = nextConfig
