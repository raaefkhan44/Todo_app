---
name: frontend-api-integration
description: Provides a secure, reusable pattern for integrating Next.js frontend with FastAPI backend. Centralizes API calls, manages JWT tokens in headers, and handles loading/error states cleanly.
---

# Frontend API Integration Skill

## Purpose
Integrate Next.js frontend with FastAPI backend securely. This skill prevents scattered `fetch` calls and ensures consistent authentication headers, error handling, and type safety across the Web UI.

## Context & Research
- **Centralized Client**: Use a singleton API client (e.g., `api/client.ts`) wrapping `fetch` or `axios`.
- **JWT Handling**: Tokens must be retrieved from secure storage (cookies/localStorage) and attached to `Authorization` header.
- **Server Components**: In App Router, use `cookies()` to retrieve tokens for server-side fetching.
- **Client Components**: Use a hook or context to access the token.

## Responsibilities
- **Typed Requests**: All API calls must return typed responses (e.g., `Promise<ApiResponse<T>>`).
- **Auth Injection**: Automatically attach `Authorization: Bearer <token>` to every authenticated request.
- **Error Normalization**: Convert HTTP errors (4xx, 5xx) into structured exceptions.
- **Environment Aware**: Use `NEXT_PUBLIC_API_URL` to avoid hardcoding localhost.

## Rules
1. **No Ad-Hoc Fetch**: Never use `fetch()` directly in UI components. Use the `apiClient` or specific service functions.
2. **Strict Types**: Request and Response bodies must be typed (shared with backend via separate package or interface duplication).
3. **Secure Tokens**: Never expose tokens in URLs or logs.
4. **Loading States**: UI must reflect loading state during fetch (use `useSWR`, `React Query`, or explicit state).

## Implementation Pattern

### 1. API Client (`lib/api.ts`)
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}
```

### 2. Service Layer (`services/todo.ts`)
```typescript
import { apiFetch } from '@/lib/api';
import type { Todo, TodoCreate } from '@/types/todo';

export const todoService = {
  getAll: (token: string) =>
    apiFetch<Todo[]>('/todos', { token }),

  create: (data: TodoCreate, token: string) =>
    apiFetch<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
      token
    }),
};
```

### 3. Usage in Component
```typescript
'use client';
import { useAuth } from '@/hooks/useAuth'; // Assumed auth hook

export default function TodoList() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (token) {
      todoService.getAll(token)
        .then(setTodos)
        .catch(console.error);
    }
  }, [token]);

  // ...
}
```

## Checklist
- [ ] Is `NEXT_PUBLIC_API_URL` defined in `.env.local`?
- [ ] Do all secure calls pass the JWT token?
- [ ] Are types defined for all API responses?
- [ ] Is error handling present in the service or component layer?
