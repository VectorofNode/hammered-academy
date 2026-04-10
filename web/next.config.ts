import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        localPatterns: [
            {
                pathname: "/api/image-proxy/**"
            }
        ]
    },
    experimental: {
        authInterrupts: true
    }
};

export default nextConfig;
