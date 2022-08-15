import { useInfiniteQuery } from "react-query";
// Import axiosClient
import axiosClient from "./axiosClient";
import { UsersPage } from "./types";

export async function getData({ pageParam = 0 }) {
  // Update the http client to use axiosClient instead of fetch api
  const response = await axiosClient({
    url: `/data/v1/user?page=${pageParam}&limit=50`,
    method: "GET",
    headers: {
      "app-id": "62f43477f19452557ba1ce76",
    },
  });

  // Destruct the following properties from response.data
  const { data, limit, page, total } = response.data;

  // Update the variable usaga
  const pageResponse: UsersPage = {
    results: data,
    next: total > page * limit ? pageParam + 1 : undefined,
  };
  return pageResponse;
}

export const useUsersQuery = () => {
  const query = useInfiniteQuery<UsersPage, Error>("users", getData, {
    getNextPageParam: (lastPage) => lastPage.next,
  });

  return query;
};
