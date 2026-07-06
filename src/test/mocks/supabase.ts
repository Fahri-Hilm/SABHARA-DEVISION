import { vi } from "vitest";

type Chainable<T = unknown> = {
  select: (columns?: string) => Chainable<T>;
  insert: (rows: unknown | unknown[]) => Chainable<T>;
  update: (rows: unknown) => Chainable<T>;
  delete: () => Chainable<T>;
  upsert: (rows: unknown | unknown[]) => Chainable<T>;
  eq: (column: string, value: unknown) => Chainable<T>;
  order: (column: string, opts?: { ascending?: boolean }) => Chainable<T>;
  limit: (n: number) => Chainable<T>;
  range: (from: number, to: number) => Chainable<T>;
  single: () => Promise<{ data: T | null; error: unknown }>;
  maybeSingle: () => Promise<{ data: T | null; error: unknown }>;
  then: <U>(onFulfilled: (value: { data: T | null; error: unknown }) => U) => Promise<U>;
};

function createChainable<T>(data: T | null = null, error: unknown = null): Chainable<T> {
  const chain: Chainable<T> = {
    select: (columns) => {
      void columns;
      return chain;
    },
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
    eq: () => chain,
    order: () => chain,
    limit: () => chain,
    range: () => chain,
    single: () => Promise.resolve({ data, error }),
    maybeSingle: () => Promise.resolve({ data, error }),
    then: (onFulfilled) => Promise.resolve({ data, error }).then(onFulfilled),
  };
  return chain;
}

export function createMockSupabaseClient(overrides: {
  fromData?: unknown;
  fromError?: unknown;
  storageData?: unknown;
  storageError?: unknown;
  authData?: unknown;
  authError?: unknown;
} = {}) {
  const mock = {
    from: vi.fn(() => createChainable(overrides.fromData ?? null, overrides.fromError ?? null)),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() =>
          Promise.resolve({
            data: { path: overrides.storageData ?? "mock/path" },
            error: overrides.storageError ?? null,
          }),
        ),
        remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
        createSignedUrl: vi.fn(() =>
          Promise.resolve({
            data: { signedUrl: "https://mock.supabase.co/signed/abc" },
            error: null,
          }),
        ),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://mock.supabase.co/public/abc" } })),
      })),
    },
    auth: {
      signInWithPassword: vi.fn(() =>
        Promise.resolve({ data: overrides.authData, error: overrides.authError ?? null }),
      ),
      signInWithOtp: vi.fn(() =>
        Promise.resolve({ data: overrides.authData, error: overrides.authError ?? null }),
      ),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getSession: vi.fn(() =>
        Promise.resolve({ data: { session: overrides.authData }, error: null }),
      ),
      getUser: vi.fn(() =>
        Promise.resolve({ data: { user: overrides.authData }, error: null }),
      ),
    },
    channel: vi.fn(() => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    })),
    removeChannel: vi.fn(),
  };
  return mock;
}

export const mockSupabaseClient = createMockSupabaseClient();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}));
