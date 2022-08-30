import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import nock from 'nock';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useCreateUserMutation } from '../useCreateUserMutation';

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

describe("useCreateUserMutation", () => {
  // 1- Adding test case for the happy path
  it("should create new user", async () => {
    const { result, waitFor } = renderHook(() => useCreateUserMutation(), {
      wrapper: wrapper,
    });
    nock('https://dummyapi.io', {
      reqheaders: {
        'app-id': () => true
      }
    })
      .post(`/data/v1/user/create`)
      // Mocking the response with status code = 200
      .reply(200, {});

    act(() => {
      result.current.mutate({
        firstName: 'fTest',
        lastName: 'lTest',
        email: 'eTest@test.com'
      });
    });

    // Waiting for the request status to resolve as success, i.e: statusCode = 200
    await waitFor(() => {
      return result.current.isSuccess;
    });

    // Make sure the request status resolved to true
    expect(result.current.isSuccess).toBe(true);
  });

  // 2- Adding test case for the sad path (i.e when no form data sent to the backend)
  it("should return an error from the server", async () => {
    const { result, waitFor } = renderHook(() => useCreateUserMutation(), {
      wrapper: wrapper,
    });
    nock('https://dummyapi.io', {
      reqheaders: {
        'app-id': () => true
      }
    })
      .post(`/data/v1/user/create`)
      // 2- Mocking the response with status code = 200
      .reply(400);

    act(() => {
      result.current.mutate({
        firstName: '',
        lastName: '',
        email: ''
      });
    });

    // Waiting for the request status to resolve as success, i.e: statusCode = 200
    await waitFor(() => {
      return result.current.isError;
    });

    // Make sure the request status resolved to true
    expect(result.current.isError).toBe(true);
  });
});
