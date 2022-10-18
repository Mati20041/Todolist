import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "./api/TodoApi";
import { TodoList } from "./todolist/TodoList";
import { io } from "socket.io-client";
import { useEffect } from "react";

const todoEventTypes = ["todo-new", "todo-delete"];

const socket = io("/todo-events");

export const TodoView = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(["todos"], todoApi.getAll, {
    onSuccess: (data) => {
      data.forEach((todo) => {
        queryClient.setQueryData(["todos", todo.id], todo);
      });
    },
  });

  useEffect(() => {
    const listener = (...data: any) => {
      console.log(data);
      void refetch();
    };
    todoEventTypes.forEach((event) => {
      socket.on(event, listener);
    });
    socket.on("todo-update", (data) => {
      void queryClient.invalidateQueries(["todos", data.id]);
    });
    return () => {
      todoEventTypes.forEach((e) => socket.off(e, listener));
    };
  }, [queryClient, refetch]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return <div>Error fetching data</div>;
  }

  return data && <TodoList todos={data} />;
};
