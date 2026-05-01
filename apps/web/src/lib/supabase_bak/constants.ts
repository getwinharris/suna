/**
 * Scope the local-dev auth cookie to the actual frontend port so running
 * multiple local frontends on the same host (localhost:3000, localhost:13737)
 * does not cause cross-app Trailbase sign-out/session churn.
 *
 * Browsers scope cookies by host, not port. If two local apps on localhost use
 * the same cookie name and the same Trailbase project, auth operations in one
 * app can overwrite or clear the other's session cookie.
 */
function resolveAuthCookieName() {
  const appUrl =
    process.env.BAPX_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    process.env.PUBLIC_URL;

  if (!appUrl) return 'sb-bapx-auth-token';

  try {
    const url = new URL(appUrl);
    const isLocalhost = ['localhost', '127.0.0.1'].includes(url.hostname);
    const port = url.port;

    if (isLocalhost && port) {
      return `sb-bapx-auth-token-${port}`;
    }
  } catch {
    // Fall back to the historical cookie name.
  }

  return 'sb-bapx-auth-token';
}

export const BAPX_TRAILBASE_AUTH_COOKIE = resolveAuthCookieName();
