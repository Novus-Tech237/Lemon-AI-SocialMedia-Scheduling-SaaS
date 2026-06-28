"use client"
import { useState } from "react";
import { QueryClient, QueryClientProvider, keepPreviousData } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Treat data as fresh for 1 min. Re-navigating to a page within this
                // window renders instantly from cache with no skeleton flash; the data
                // only revalidates in the background once it's older than this.
                staleTime: 60 * 1000,
                // Keep unused query data in memory for 10 min so back-navigation and
                // prefetched routes stay warm instead of refetching from scratch.
                gcTime: 10 * 60 * 1000,
                // On key change (tab/filter switch) keep showing the previous data
                // while the new data loads, rather than dropping to a skeleton.
                placeholderData: keepPreviousData,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                retry: 1,
            }
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}