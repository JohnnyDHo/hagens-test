import { headers } from "next/headers";

const LOCAL_ORIGIN = "http://localhost";

const firstForwardedValue = (value: string | null) =>
  value?.split(",", 1)[0]?.trim() || null;

const safeHost = (value: string | null) => {
  const host = firstForwardedValue(value);
  if (!host || /[\s/@\\]/.test(host)) return null;

  try {
    return new URL(`https://${host}`).host;
  } catch {
    return null;
  }
};

export const requestOriginFromHeaders = (requestHeaders: Headers) => {
  const host =
    safeHost(requestHeaders.get("x-forwarded-host")) ??
    safeHost(requestHeaders.get("host"));

  if (!host) return LOCAL_ORIGIN;

  const forwardedProtocol = firstForwardedValue(
    requestHeaders.get("x-forwarded-proto"),
  );
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host)
        ? "http"
        : "https";

  return `${protocol}://${host}`;
};

export const getRequestOrigin = async () =>
  requestOriginFromHeaders(await headers());

