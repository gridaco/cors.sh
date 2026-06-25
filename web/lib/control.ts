/**
 * Typed fetch wrapper for the cors.sh control API.
 *
 * The control plane is folded into this Next app as same-origin route handlers
 * under `/api/v1/*` (no cross-origin call, no CORS). The session cookie rides
 * along automatically once auth lands. An override is kept for flexibility.
 */

export const CONTROL_API_URL = process.env.NEXT_PUBLIC_CONTROL_API_URL ?? "/api";

export interface Project {
  id: string;
  name: string;
  allowedOrigins: string[];
  allowedTargets: string[];
  createdAt: number;
}

export interface ProjectKey {
  key: string;
  key_type: "live" | "test";
  active: number;
}

export interface ProjectUsage {
  period: string;
  requests: number;
  bytes: number;
}

export interface ProjectDetail {
  id: string;
  name: string;
  allowedOrigins: string[];
  allowedTargets: string[];
  createdAt: number;
  keys: ProjectKey[];
  usage: ProjectUsage;
}

export interface CreateProjectInput {
  name: string;
  allowedOrigins?: string[];
  allowedTargets?: string[];
}

export interface CreatedProject {
  id: string;
  name: string;
  allowedOrigins: string[];
  allowedTargets: string[];
  /** Plaintext keys are returned ONCE, only on create. */
  keys: { live: string; test: string };
}

export interface UpdateProjectInput {
  name?: string;
  allowedOrigins?: string[];
  allowedTargets?: string[];
}

export interface UpdatedProject {
  id: string;
  name?: string;
  allowedOrigins: string[];
  allowedTargets: string[];
}

export interface Usage {
  period: string;
  requests: number;
  bytes: number;
  quota: { requests: number; bytes: number };
}

export class ControlApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ControlApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const res = await fetch(`${CONTROL_API_URL}${path}`, {
    ...rest,
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  const text = await res.text();
  const parsed = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message =
      (parsed && (parsed.error || parsed.message)) ||
      `Control API request failed (${res.status})`;
    throw new ControlApiError(res.status, message, parsed);
  }

  return parsed as T;
}

export function listProjects(): Promise<{ projects: Project[] }> {
  return request<{ projects: Project[] }>("/v1/projects");
}

export function createProject(
  input: CreateProjectInput
): Promise<CreatedProject> {
  return request<CreatedProject>("/v1/projects", {
    method: "POST",
    json: input,
  });
}

export function getProject(id: string): Promise<ProjectDetail> {
  return request<ProjectDetail>(`/v1/projects/${encodeURIComponent(id)}`);
}

export function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<UpdatedProject> {
  return request<UpdatedProject>(`/v1/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: input,
  });
}

export function deleteProject(id: string): Promise<{ deleted: string }> {
  return request<{ deleted: string }>(
    `/v1/projects/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}

export function getUsage(): Promise<Usage> {
  return request<Usage>("/v1/usage");
}
