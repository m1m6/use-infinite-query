import { useInfiniteQuery } from "react-query";
import { UsersPage } from "./types";

export async function getData({ pageParam = 0 }) {
  const url = `https://dummyapi.io/data/v1/user?page=${pageParam}&limit=50`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "app-id": "62f43477f19452557ba1ce76",
    },
  });

  if (!response.ok) {
    throw new Error("Problem fetching data");
  }

  const dataFromServer = await response.json();
  const data: UsersPage = {
    results: dataFromServer.data,
    next:
      dataFromServer.total > dataFromServer.page * dataFromServer.limit
        ? pageParam + 1
        : undefined,
  };
  return data;
}

export const useUsersQuery = () => {
  const query = useInfiniteQuery<UsersPage, Error>("users", getData, {
    getNextPageParam: (lastPage) => lastPage.next,
  });

  return query;
};
