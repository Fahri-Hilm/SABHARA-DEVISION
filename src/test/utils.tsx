import React, { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchInterval: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type ProvidersProps = { children: ReactNode; queryClient?: QueryClient };

export function Providers({ children, queryClient }: ProvidersProps) {
  const client = queryClient ?? makeQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { queryClient?: QueryClient },
) {
  const { queryClient, ...rest } = options ?? {};
  return render(<Providers queryClient={queryClient}>{ui}</Providers>, rest);
}

export { makeQueryClient };
