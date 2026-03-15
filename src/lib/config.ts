export const ACCESS_COOKIE_NAME = "rbac_access_token";
export const REFRESH_COOKIE_NAME = "rbac_refresh_token";

const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL
  );
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
