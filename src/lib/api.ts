const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5247';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function request<T>(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const { method = 'GET', body, headers = {} } = options;

  const isJson = body !== undefined;
  const response = await fetch(url, {
    method,
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: isJson ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const hasJson = contentType.includes('application/json');
  const data = hasJson ? await response.json() : (undefined as unknown as T);

  if (!response.ok) {
    const message = (hasJson && (data as any)?.message) || response.statusText || 'Erro na requisição';
    throw new Error(message);
  }

  return data as T;
}

export interface RegisterPayload {
  name: string; // UI field
  email: string;
  password: string;
}

export interface MonthlyScheduleItemDto {
  userId: number;
  username: string;
  date: string; // ISO date from API
  workMode: number; // 0=Remote,1=Office,2=Out
}

export const api = {
  // Health/welcome
  welcome: () => request<{ message: string }>(`/v1`),

  // Users
  register: (payload: RegisterPayload) => request<{ message: string }>(`/api/Users/register`, {
    method: 'POST',
    body: { Username: payload.name, Email: payload.email, Password: payload.password },
  }),

  login: (payload: { email: string; password: string }) => request<{ userId: number; username: string; email: string }>(`/api/Users/login`, {
    method: 'POST',
    body: { email: payload.email, password: payload.password },
  }),

  // Schedule
  getMonthlySchedule: (params: { year: number; month: number; userId?: number }) => {
    const query = new URLSearchParams({
      year: String(params.year),
      month: String(params.month),
      ...(params.userId ? { userId: String(params.userId) } : {}),
    });
    return request<MonthlyScheduleItemDto[]>(`/api/Schedule/monthly?${query.toString()}`);
  },
  // Admin - Users
  admin: {
    users: {
      list: () => request<any[]>(`/api/admin/users`),
      get: (id: number) => request<any>(`/api/admin/users/${id}`),
      create: (user: { Username: string; Email: string; RoleId: number; GroupId: number; ManagerId?: number | null }) =>
        request<any>(`/api/admin/users`, { method: 'POST', body: user }),
      update: (id: number, user: { Username: string; Email: string; RoleId: number; GroupId: number; ManagerId?: number | null }) =>
        request<void>(`/api/admin/users/${id}`, { method: 'PUT', body: user }),
      remove: (id: number) => request<void>(`/api/admin/users/${id}`, { method: 'DELETE' }),
    },
    groups: {
      list: () => request<any[]>(`/api/admin/groups`),
      create: (group: { Name: string; Description?: string | null; PrimaryScheduleId?: number | null; SecondaryScheduleId?: number | null }) =>
        request<any>(`/api/admin/groups`, { method: 'POST', body: group }),
      update: (id: number, group: { Name: string; Description?: string | null; PrimaryScheduleId?: number | null; SecondaryScheduleId?: number | null }) =>
        request<void>(`/api/admin/groups/${id}`, { method: 'PUT', body: group }),
      remove: (id: number) => request<void>(`/api/admin/groups/${id}`, { method: 'DELETE' }),
    },
    schedules: {
      list: () => request<any[]>(`/api/admin/schedules`),
      create: (s: { Title: string; Description?: string | null; Days?: { WeekdayId?: number; DayName?: string; IsRemote: boolean }[] }) =>
        request<any>(`/api/admin/schedules`, { method: 'POST', body: s }),
      update: (id: number, s: { Title: string; Description?: string | null; Days?: { WeekdayId?: number; DayName?: string; IsRemote: boolean }[] }) =>
        request<void>(`/api/admin/schedules/${id}`, { method: 'PUT', body: s }),
      remove: (id: number) => request<void>(`/api/admin/schedules/${id}`, { method: 'DELETE' }),
    },
    roles: {
      list: () => request<any[]>(`/api/admin/roles`),
      create: (r: { Name: string; DisplayName?: string | null }) => request<any>(`/api/admin/roles`, { method: 'POST', body: r }),
      update: (id: number, r: { Name: string; DisplayName?: string | null }) => request<void>(`/api/admin/roles/${id}`, { method: 'PUT', body: r }),
      remove: (id: number) => request<void>(`/api/admin/roles/${id}`, { method: 'DELETE' }),
    },
  },
};

export { API_BASE_URL };


