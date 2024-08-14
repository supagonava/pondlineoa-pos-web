/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    exportTrailingSlash: true,
    images: { unoptimized: true }
};

export default nextConfig;
