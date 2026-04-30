/**
 * Bapx Projects hooks — ported from apps/web/src/hooks/bapx/use-bapx-projects.ts
 *
 * Fetches from bapx-master's /bapx/projects API through the sandbox URL.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/api/config';

// ── Types ────────────────────────────────────────────────────────────────────

export interface BapxProject {
  id: string;
  name: string;
  path: string;
  description: string;
  created_at: string;
  opencode_id: string | null;
  sessionCount?: number;
  // Extended properties from OpenCode Project
  worktree?: string;
  time?: {
    created: number;
    updated: number;
    initialized?: number;
  };
}

// Task status — aligned with the live Bapx task pipeline.
// Pipeline: todo → [START] → in_progress → input_needed/awaiting_review → [APPROVE] → completed
export type BapxTaskStatus =
  | 'todo'
  | 'in_progress'
  | 'input_needed'
  | 'awaiting_review'
  | 'completed'
  | 'cancelled';

const VALID_TASK_STATUSES: BapxTaskStatus[] = [
  'todo',
  'in_progress',
  'input_needed',
  'awaiting_review',
  'completed',
  'cancelled',
];

/** Map legacy statuses from older backends to the new schema */
function normalizeTaskStatus(status: unknown): BapxTaskStatus {
  if (typeof status !== 'string') return 'todo';
  if ((VALID_TASK_STATUSES as string[]).includes(status)) return status as BapxTaskStatus;
  // Back-compat mapping for pre-26cf37f data
  if (status === 'pending') return 'todo';
  if (status === 'done') return 'completed';
  if (status === 'blocked') return 'input_needed';
  return 'todo';
}

function normalizeTask(raw: any): BapxTask {
  return {
    id: raw.id,
    project_id: raw.project_id,
    title: raw.title || '',
    description: raw.description || '',
    verification_condition: raw.verification_condition || '',
    status: normalizeTaskStatus(raw?.status),
    result: raw.result ?? null,
    verification_summary: raw.verification_summary ?? null,
    blocking_question: raw.blocking_question ?? null,
    owner_session_id: raw.owner_session_id ?? null,
    owner_agent: raw.owner_agent ?? null,
    requested_by_session_id: raw.requested_by_session_id ?? null,
    started_at: raw.started_at ?? null,
    completed_at: raw.completed_at ?? null,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export interface BapxTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  verification_condition: string;
  status: BapxTaskStatus;
  result: string | null;
  verification_summary: string | null;
  blocking_question: string | null;
  owner_session_id: string | null;
  owner_agent: string | null;
  requested_by_session_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BapxAgent {
  id: string;
  project_id: string;
  session_id: string;
  parent_session_id: string;
  agent_type: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'stopped';
  result: string | null;
  verification_summary: string | null;
  blocking_question: string | null;
  owner_session_id: string | null;
  owner_agent: string | null;
  requested_by_session_id?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Fetch helper ─────────────────────────────────────────────────────────────

async function bapxFetch<T>(sandboxUrl: string, path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthToken();
  const url = `${sandboxUrl.replace(/\/+$/, '')}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Bapx API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// ── Query keys ───────────────────────────────────────────────────────────────

export const bapxKeys = {
  projects: (url: string) => ['bapx', 'projects', url] as const,
  project: (url: string, id: string) => ['bapx', 'projects', url, id] as const,
  projectSessions: (url: string, id: string) =>
    ['bapx', 'projects', url, id, 'sessions'] as const,
  tasks: (url: string, projectId: string) => ['bapx', 'tasks', url, projectId] as const,
  agents: (url: string, projectId: string) => ['bapx', 'agents', url, projectId] as const,
  connectors: (url: string) => ['bapx', 'connectors', url] as const,
};

// ── Connector types & hooks ──────────────────────────────────────────────────

export interface BapxConnector {
  id: string;
  name: string;
  description: string | null;
  source: string | null;
  pipedream_slug: string | null;
  env_keys: string[] | null;
  notes: string | null;
  auto_generated: boolean;
  created_at: string;
  updated_at: string;
}

export function useBapxConnectors(sandboxUrl: string | undefined) {
  return useQuery<BapxConnector[]>({
    queryKey: bapxKeys.connectors(sandboxUrl || ''),
    queryFn: async () => {
      const data = await bapxFetch<{ connectors?: BapxConnector[] } | BapxConnector[]>(
        sandboxUrl!,
        '/bapx/connectors',
      );
      if (Array.isArray(data)) return data;
      return data.connectors ?? [];
    },
    enabled: !!sandboxUrl,
    staleTime: 30_000,
    retry: 2,
  });
}

// ── Project hooks ────────────────────────────────────────────────────────────

export function useBapxProjects(sandboxUrl: string | undefined) {
  return useQuery<BapxProject[]>({
    queryKey: bapxKeys.projects(sandboxUrl || ''),
    queryFn: () => bapxFetch<BapxProject[]>(sandboxUrl!, '/bapx/projects'),
    enabled: !!sandboxUrl,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

export function useBapxProject(sandboxUrl: string | undefined, id: string) {
  return useQuery<BapxProject>({
    queryKey: bapxKeys.project(sandboxUrl || '', id),
    queryFn: () =>
      bapxFetch<BapxProject>(sandboxUrl!, `/bapx/projects/${encodeURIComponent(id)}`),
    enabled: !!sandboxUrl && !!id,
    staleTime: 15_000,
    retry: 2,
  });
}

export function useBapxProjectSessions(sandboxUrl: string | undefined, projectId: string) {
  return useQuery<any[]>({
    queryKey: bapxKeys.projectSessions(sandboxUrl || '', projectId),
    queryFn: () =>
      bapxFetch<any[]>(sandboxUrl!, `/bapx/projects/${encodeURIComponent(projectId)}/sessions`),
    enabled: !!sandboxUrl && !!projectId,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

export function useBapxTasks(sandboxUrl: string | undefined, projectId: string | undefined) {
  const qs = projectId ? `?project_id=${encodeURIComponent(projectId)}` : '';
  return useQuery<BapxTask[]>({
    queryKey: bapxKeys.tasks(sandboxUrl || '', projectId || ''),
    queryFn: async () => {
      const rows = await bapxFetch<any[]>(sandboxUrl!, `/bapx/tasks${qs}`);
      return Array.isArray(rows) ? rows.map(normalizeTask) : [];
    },
    enabled: !!sandboxUrl && !!projectId,
    refetchInterval: 5000,
    retry: 2,
  });
}

/** Fetch a single task by ID (ported from web 26cf37f). */
export function useBapxTask(sandboxUrl: string | undefined, id: string | undefined) {
  return useQuery<BapxTask>({
    queryKey: ['bapx', 'tasks', sandboxUrl || '', 'detail', id || ''],
    queryFn: async () => {
      const raw = await bapxFetch<any>(sandboxUrl!, `/bapx/tasks/${encodeURIComponent(id!)}`);
      return normalizeTask(raw);
    },
    enabled: !!sandboxUrl && !!id,
    refetchInterval: 5000,
    retry: 2,
  });
}

export function useBapxAgents(sandboxUrl: string | undefined, projectId: string | undefined) {
  const qs = projectId ? `?project_id=${encodeURIComponent(projectId)}` : '';
  return useQuery<BapxAgent[]>({
    queryKey: bapxKeys.agents(sandboxUrl || '', projectId || ''),
    queryFn: async () => {
      try {
        return await bapxFetch<BapxAgent[]>(sandboxUrl!, `/bapx/agents${qs}`);
      } catch {
        return [];
      }
    },
    enabled: !!sandboxUrl && !!projectId,
    refetchInterval: 5000,
  });
}
// ── Mutation hooks ───────────────────────────────────────────────────────────

export function useUpdateProject(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string }) =>
      bapxFetch<BapxProject>(sandboxUrl!, `/bapx/projects/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, vars) => {
      if (sandboxUrl) {
        qc.invalidateQueries({ queryKey: bapxKeys.project(sandboxUrl, vars.id) });
        qc.invalidateQueries({ queryKey: bapxKeys.projects(sandboxUrl) });
      }
    },
  });
}

export function useDeleteProject(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      bapxFetch<{ deleted: boolean; name: string; path: string }>(
        sandboxUrl!,
        `/bapx/projects/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      ),
    onSuccess: () => {
      if (sandboxUrl) {
        qc.invalidateQueries({ queryKey: bapxKeys.projects(sandboxUrl) });
      }
    },
  });
}

// ── Task mutation hooks (ported from web 8e1bc7b + 26cf37f) ─────────────────

export function useCreateBapxTask(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      project_id: string;
      title: string;
      description?: string;
      verification_condition?: string;
      status?: BapxTaskStatus;
    }) => {
      const raw = await bapxFetch<any>(sandboxUrl!, `/bapx/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return normalizeTask(raw);
    },
    onSuccess: () => {
      if (sandboxUrl) {
        qc.invalidateQueries({ queryKey: ['bapx', 'tasks', sandboxUrl] });
      }
    },
  });
}

export function useUpdateBapxTask(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<BapxTask>) => {
      const raw = await bapxFetch<any>(sandboxUrl!, `/bapx/tasks/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return normalizeTask(raw);
    },
    onSuccess: () => {
      if (sandboxUrl) {
        // Invalidate all task queries for this sandbox
        qc.invalidateQueries({ queryKey: ['bapx', 'tasks', sandboxUrl] });
      }
    },
  });
}

/** Start a task — transitions it from `todo` → `in_progress` (ported from web 26cf37f) */
export function useStartBapxTask(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      session_id,
      agent,
    }: {
      id: string;
      session_id?: string;
      agent?: string;
    }) => {
      const raw = await bapxFetch<any>(
        sandboxUrl!,
        `/bapx/tasks/${encodeURIComponent(id)}/start`,
        {
          method: 'POST',
          body: JSON.stringify({ session_id, agent }),
        }
      );
      return normalizeTask(raw);
    },
    onSuccess: () => {
      if (sandboxUrl) {
        qc.invalidateQueries({ queryKey: ['bapx', 'tasks', sandboxUrl] });
      }
    },
  });
}

/** Approve a task waiting for input/review — transitions it to `completed` (ported from web 26cf37f) */
export function useApproveBapxTask(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const raw = await bapxFetch<any>(
        sandboxUrl!,
        `/bapx/tasks/${encodeURIComponent(id)}/approve`,
        {
          method: 'POST',
        }
      );
      return normalizeTask(raw);
    },
    onSuccess: () => {
      if (sandboxUrl) {
        qc.invalidateQueries({ queryKey: ['bapx', 'tasks', sandboxUrl] });
      }
    },
  });
}

export function useDeleteBapxTask(sandboxUrl: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      bapxFetch<{ deleted: boolean }>(sandboxUrl!, `/bapx/tasks/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      if (sandboxUrl) {
        qc.invalidateQueries({ queryKey: ['bapx', 'tasks', sandboxUrl] });
      }
    },
  });
}
