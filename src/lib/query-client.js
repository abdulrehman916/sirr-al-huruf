import { QueryClient } from '@tanstack/react-query';


export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 5 * 60 * 1000,       // 5 min — avoid redundant refetches
			gcTime: 30 * 60 * 1000,          // 30 min — keep cache for returning visitors
		},
	},
});