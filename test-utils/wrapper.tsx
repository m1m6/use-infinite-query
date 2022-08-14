import { ReactNode } from "react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";

export const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    }
);
setLogger({
    log: console.log,
    warn: console.warn,
    error: () => { },
});
export const wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};