/**
 * Bapx Projects hooks.
 *
 * Fetches from bapx-master's /bapx/projects API through the currently
 * active sandbox route (/v1/p/.../8000/bapx/projects). This keeps Bapx
 * workspace data on the same authenticated transport path as the rest of the
 * dashboard/OpenCode APIs.
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useServerStore } from '@/stores/server-store';
import { authenticatedFetch } from '@/lib/auth-token';
import { useAuth } from '@/components/AuthProvider';

// ── Types ────────────────────────────────────────────────────────────────────

export interface BapxProject {
  id: string;
  name: string;
  path: string;
  description: string;
  created_at: string;
  opencode_id: string | null;
  /** 1 = legacy tasks layout, 2 = new tickets/board. New projects default to 2. */
  structure_version?: number;
  sessionCount?: number;
  // Extended properties from OpenCode Project (optional for compatibility)
  worktree?: string;
  time?: {
    created: number;
    updated: number;
    initialized?: number;
  };
}

// ── Fetch helper ─────────────────────────────────────────────────────────────

async function bapxFetch<T>(serverUrl: string, apiPath: string, init?: RequestInit): Promise<T> {
  const url = `${serverUrl.replace(/\/+$/, '')}/bapx/projects${apiPath}`;
  const res = await authenticatedFetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bapx API ${res.status}: ${text.slice(0, 100)}`);
  }
  return res.json();
}

// ── Query keys ───────────────────────────────────────────────────────────────

export const bapxKeys = {
  projects: () => ['bapx', 'projects'] as const,
  project: (id: string) => ['bapx', 'projects', id] as const,
};

interface BapxProjectQueryOptions {
  enabled?: boolean;
}

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useBapxProjects() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const serverVersion = useServerStore((s) => s.serverVersion);
  const serverUrl = useServerStore((s) => s.getActiveServerUrl());
  return useQuery<BapxProject[]>({
    queryKey: [...bapxKeys.projects(), user?.id ?? 'anonymous', serverUrl, serverVersion],
    queryFn: () => bapxFetch<BapxProject[]>(serverUrl, ''),
    enabled: !isAuthLoading && !!user && !!serverUrl,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

export function useBapxProject(id: string) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const serverVersion = useServerStore((s) => s.serverVersion);
  const serverUrl = useServerStore((s) => s.getActiveServerUrl());
  return useQuery<BapxProject>({
    queryKey: [...bapxKeys.project(id), user?.id ?? 'anonymous', serverUrl, serverVersion],
    queryFn: () => bapxFetch<BapxProject>(serverUrl, `/${encodeURIComponent(id)}`),
    enabled: !isAuthLoading && !!user && !!serverUrl && !!id,
    staleTime: 15_000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    // Keep previous data while a new query (e.g. from a serverVersion bump
    // when another tab closes) is loading. Prevents the skeleton flash.
    placeholderData: keepPreviousData,
  });
}

export function useBapxProjectForSession(sessionId: string, options: BapxProjectQueryOptions = {}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const serverVersion = useServerStore((s) => s.serverVersion);
  const serverUrl = useServerStore((s) => s.getActiveServerUrl());
  return useQuery<BapxProject | null>({
    queryKey: ['bapx', 'projects', 'by-session', sessionId, user?.id ?? 'anonymous', serverUrl, serverVersion],
    queryFn: async () => {
      try {
        return await bapxFetch<BapxProject>(serverUrl, `/by-session/${encodeURIComponent(sessionId)}`);
      } catch {
        return null;
      }
    },
    enabled: !isAuthLoading && !!user && !!serverUrl && !!sessionId && (options.enabled ?? true),
    staleTime: 15_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch sessions linked to a specific project.
 * Returns OpenCode session objects enriched with title, time, etc.
 */
export function useBapxProjectSessions(
  projectId: string,
  options: BapxProjectQueryOptions = {},
) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const serverVersion = useServerStore((s) => s.serverVersion);
  const serverUrl = useServerStore((s) => s.getActiveServerUrl());
  return useQuery<any[]>({
    queryKey: ['bapx', 'projects', projectId, 'sessions', user?.id ?? 'anonymous', serverUrl, serverVersion],
    queryFn: () => bapxFetch<any[]>(serverUrl, `/${encodeURIComponent(projectId)}/sessions`),
    enabled: !isAuthLoading && !!user && !!serverUrl && !!projectId && (options.enabled ?? true),
    staleTime: 15_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: keepPreviousData,
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  const serverUrl = useServerStore((s) => s.getActiveServerUrl());
  return useMutation({
    mutationFn: (id: string) =>
      bapxFetch<{ deleted: boolean; name: string; path: string }>(serverUrl, `/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bapxKeys.projects() });
    },
  });
}

export function usePatchProject() {
  const qc = useQueryClient();
  const serverUrl = useServerStore((s) => s.getActiveServerUrl());
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name?: string; description?: string; user_handle?: string | null }) =>
      bapxFetch<BapxProject>(serverUrl, `/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: bapxKeys.project(vars.id) });
      qc.invalidateQueries({ queryKey: bapxKeys.projects() });
    },
  });
}

