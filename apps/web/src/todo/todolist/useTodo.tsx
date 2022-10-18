import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "../api/TodoApi";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("/todo-events");

export const useTodo = (todoId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["todos", todoId];
  const { data } = useQuery(queryKey, () => todoApi.getById(todoId));
  const { mutate: update } = useMutation(
    queryKey,
    (newDescription: string) => todoApi.update(todoId, newDescription),
    {
      onMutate: (newDescription) => {
        queryClient.setQueryData(queryKey, (old: any) => ({
          ...old,
          description: newDescription,
        }));
      },
      onSuccess: () => {
        void queryClient.invalidateQueries(queryKey);
      },
    }
  );

  useEffect(() => {
    const listener = (data: { id: string }) => {
      void queryClient.invalidateQueries(["todos", data.id]);
    };
    socket.on("todo-update", listener);
    return () => {
      socket.off("todo-update", listener);
    };
  });

  return { update, todo: data ?? { id: -10, description: "error" } };
};
