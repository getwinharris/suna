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

export function createServerClient(url: string, options: ServerClientOptions) {
  const cookies = options.cookies.getAll();
  const authCookie = cookies.find(c => c.name === (options.cookieOptions?.name || 'bapx-trailbase-auth'));
  const initialToken = authCookie?.value || null;

  const trailFetch = (path: string, opts?: RequestInit) =>
    fetch(`${url}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...opts?.headers },
    });

  const getToken = () => initialToken;

  return {
    auth: {
      getUser: async () => {
        let user = null;
        if (initialToken) {
          try {
            const payload = initialToken.split('.')[1];
            if (payload) {
              const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
              const padding = (4 - (padded.length % 4)) % 4;
              const decoded = JSON.parse(atob(padded + '='.repeat(padding)));
              if (decoded.sub) {
                user = { id: decoded.sub, email: decoded.email || '', admin: decoded.admin };
              }
            }
          } catch {}
        }
        return { data: { user }, error: null };
      },
      getSession: async () => {
        const token = getToken();
        return {
          data: {
            session: token ? { access_token: token, user: null } : null,
          },
          error: null,
        };
      },
    },
  };
}
