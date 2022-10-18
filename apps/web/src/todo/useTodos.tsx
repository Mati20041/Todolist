import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "./api/TodoApi";
import { useEffect } from "react";
import { io } from "socket.io-client";

const todoEventTypes = ["todo-new", "todo-delete"];
const socket = io("/todo-events");

export const useTodos = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(["todos"], todoApi.getAll, {
    onSuccess: (data) => {
      data.forEach((todo) => {
        queryClient.setQueryData(["todos", todo.id], todo);
      });
    }
  });
  useEffect(() => {
    const listListener = (...data: any) => {
      console.log(data);
      void refetch();
    };
    const updateListener = (data: { id: string }) => {
      void queryClient.invalidateQueries(["todos", data.id]);
    };
    todoEventTypes.forEach((event) => {
      socket.on(event, listListener);
    });
    socket.on("todo-update", updateListener);
    return () => {
      todoEventTypes.forEach((e) => socket.off(e, listListener));
      socket.off("todo-update", updateListener);
    };
  }, [queryClient, refetch]);

  return { data, isLoading };
};
