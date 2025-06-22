/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  allowedDevOrigins: [
    "7cfde464-b609-44ab-9bb7-fa3009527c4c-00-1fhs4143tn3rs.pike.repl.co",
    ".repl.co"
  ],
};

export default nextConfig;
