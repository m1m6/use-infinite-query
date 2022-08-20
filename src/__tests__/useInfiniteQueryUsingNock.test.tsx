import { renderHook } from '@testing-library/react-hooks';
import nock from 'nock';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { responseForPage0, responseForPage1, responseForPage2 } from '../fixtures';
import { useUsersQuery } from '../useInfiniteQuery';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe('useUsersQuery', () => {
    it('fetches the users list', async () => {
        nock('https://dummyapi.io', {
            reqheaders: {
                'app-id': () => true
            }
        })
            .persist()
            .get(`/data/v1/user?page=0&limit=50`)
            .reply(200, responseForPage0)

        const { result, waitFor } = renderHook(() => useUsersQuery(), { wrapper });
        await waitFor(() => result.current.isSuccess);
        expect(result.current.data?.pages[0]).toStrictEqual({ results: responseForPage0.data, next: 1 });

        // Calling the next page=1 and with mocked data from page1
        nock('https://dummyapi.io')
            .persist()
            .get(`/data/v1/user?page=1&limit=50`)
            .reply(200, responseForPage1);

        result.current.fetchNextPage();
        await waitFor(() => result.current.isFetching);
        await waitFor(() => !result.current.isFetching);

        expect(result.current.data?.pages).toStrictEqual([
            { results: responseForPage0.data, next: 1 },
            { results: responseForPage1.data, next: 2 },
        ]);

        // Calling the next page=2 and with mocked data from page2
        nock('https://dummyapi.io')
            .persist()
            .get(`/data/v1/user?page=2&limit=50`)
            .reply(200, responseForPage2);

        result.current.fetchNextPage();
        await waitFor(() => result.current.isFetching);
        await waitFor(() => !result.current.isFetching);

        expect(result.current.data?.pages).toStrictEqual([
            { results: responseForPage0.data, next: 1 },
            { results: responseForPage1.data, next: 2 },
            { results: responseForPage2.data, next: undefined },
        ]);
    });
});
