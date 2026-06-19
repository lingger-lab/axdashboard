import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // skills/ 디렉토리를 서버리스 함수에 포함 (readFile 사용)
  outputFileTracingIncludes: {
    "/api/diagnose": ["./skills/**/*"],
  },
};

export default nextConfig;
