import { useMutation } from "react-query";
import axiosClient from "./axiosClient";

export const useCreateUserMutation = () => {
  const mutation = useMutation(
    (request: { firstName: string; lastName: string; email: string }) => {
      return axiosClient({
        url: `/data/v1/user/create`,
        method: "POST",
        data: request,
        headers: {
          "app-id": "62f43477f19452557ba1ce76",
        },
      });
    }
  );

  return mutation;
};
