const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : '')

const isConnectionError = (err: unknown) =>
  err instanceof TypeError && (err.message === 'Failed to fetch' || (err as Error).cause?.toString?.().includes('ECONNREFUSED'))

async function request<T>(
  path: string,
  options?: RequestInit & { userId?: string },
  retries = import.meta.env.DEV ? 3 : 1
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  if (options?.userId) headers['x-user-id'] = options.userId
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const text = await res.text()
    const json = text ? JSON.parse(text) : {}
    if (!res.ok) {
      const msg = json.error?.message ?? json.message
      throw new Error(Array.isArray(msg) ? msg.join(', ') : msg || 'Request failed')
    }
    return text ? json : ({ data: null } as { data: T; meta?: Record<string, unknown> })
  } catch (err) {
    if (retries > 1 && isConnectionError(err)) {
      await new Promise((r) => setTimeout(r, 1000))
      return request<T>(path, options, retries - 1)
    }
    throw err
  }
}

export const api = {
  getUsers: () => request<any[]>('/users'),
  getUser: (id: string) => request<any>(`/users/${id}`),
  getQuestions: (params?: { search?: string; tag?: string; author_id?: string; page?: number; limit?: number; sort?: 'newest' | 'votes'; userId?: string }) => {
    const q = new URLSearchParams()
    if (params?.search) q.set('search', params.search)
    if (params?.tag) q.set('tag', params.tag)
    if (params?.author_id) q.set('author_id', params.author_id)
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.sort) q.set('sort', params.sort)
    return request<any[]>(`/questions?${q}`, params?.userId ? { userId: params.userId } : undefined)
  },
  getQuestion: (id: string, userId?: string) =>
    request<any>(`/questions/${id}`, userId ? { userId } : undefined),
  voteQuestion: (questionId: string, userId: string) =>
    request<{ voteCount: number }>(`/questions/${questionId}/vote`, { method: 'POST', userId }),
  unvoteQuestion: (questionId: string, userId: string) =>
    request<{ voteCount: number }>(`/questions/${questionId}/vote`, { method: 'DELETE', userId }),
  voteAnswer: (answerId: string, userId: string) =>
    request<{ voteCount: number }>(`/answers/${answerId}/vote`, { method: 'POST', userId }),
  unvoteAnswer: (answerId: string, userId: string) =>
    request<{ voteCount: number }>(`/answers/${answerId}/vote`, { method: 'DELETE', userId }),
  createQuestion: (body: { title: string; body: string; tags?: string[] }, userId: string) =>
    request<any>('/questions', { method: 'POST', body: JSON.stringify(body), userId }),
  updateQuestion: (id: string, body: Partial<{ title: string; body: string; tags: string[]; status: 'OPEN' | 'CLOSED' }>, userId: string) =>
    request<any>(`/questions/${id}`, { method: 'PATCH', body: JSON.stringify(body), userId }),
  deleteQuestion: (id: string, userId: string) =>
    request<void>(`/questions/${id}`, { method: 'DELETE', userId }),
  createAnswer: (questionId: string, body: { body: string }, userId: string) =>
    request<any>(`/questions/${questionId}/answers`, { method: 'POST', body: JSON.stringify(body), userId }),
  updateAnswer: (id: string, body: { body: string }, userId: string) =>
    request<any>(`/answers/${id}`, { method: 'PATCH', body: JSON.stringify(body), userId }),
  deleteAnswer: (id: string, userId: string) =>
    request<void>(`/answers/${id}`, { method: 'DELETE', userId }),
}
