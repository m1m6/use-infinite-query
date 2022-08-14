import React from 'react';
import { useUsersQuery } from './useInfiniteQuery';
import InfiniteScroll from 'react-infinite-scroll-component';
import { User } from './types';

export default function App() {
  const { data, error, fetchNextPage, hasNextPage, status } = useUsersQuery();

  if (status === 'loading') {
    return <div>Loading users...</div>;
  }
  if (status === 'error') {
    return <div>{error?.message}</div>;
  }
  if (data === undefined) {
    return <div>No users data found!</div>;
  }
  const dataLength = data.pages.reduce((counter, page) => {
    return counter + page.results.length;
  }, 0);

  return (
    <div style={{ margin: '20px' }}>
      <h1>Users List</h1>
      <div style={{ border: '1px solid #ccc', height: '400px', overflow: 'scroll' }} id="scrollbar-target">
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<p style={{ color: 'deepskyblue', fontSize: '20px', textAlign: 'center' }}><b>Loading...</b></p>}
          data-testid="infinite-scroll"
          scrollableTarget="scrollbar-target"
          style={{ padding: '5px' }}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.results.map((user: User) => (
                <p key={user.firstName + user.lastName}>
                  {user.firstName} {user.lastName}
                </p>
              ))}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}