import { initClient } from 'trailbase';

interface ServerClientOptions {
  cookieOptions?: {
    name: string;
    path: string;
    sameSite: string;
  };
  cookies: {
    getAll: () => Array<{ name: string; value: string }>;
    setAll: (cookies: Array<{ name: string; value: string; options?: any }>) => void;
  };
}

export function createServerClient(url: string, anonKey: string | undefined, options: ServerClientOptions) {
  const cookies = options.cookies.getAll();
  const authCookie = cookies.find(c => c.name === (options.cookieOptions?.name || 'bapx-trailbase-auth'));
  const initialToken = authCookie?.value || null;

  const client = initClient(url, initialToken ? { tokens: { auth_token: initialToken, refresh_token: null, csrf_token: null } } : undefined);

  const getToken = () => client.tokens()?.auth_token || initialToken;

  return {
    auth: {
      getUser: async () => {
        try {
          await client.refreshAuthToken().catch(() => undefined);
        } catch {}
        const user = client.user();
        return { data: { user: user || null }, error: null };
      },
      getSession: async () => {
        try {
          await client.refreshAuthToken().catch(() => undefined);
        } catch {}
        const token = getToken();
        const user = client.user();
        return {
          data: {
            session: token ? { access_token: token, user } : null,
          },
          error: null,
        };
      },
    },
  };
}
