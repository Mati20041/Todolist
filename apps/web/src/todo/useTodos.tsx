import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi, TodoDTO } from "./api/TodoApi";
import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const todoEventTypes = ["todo-new", "todo-delete"];
const socket = io("/todo-events");

export const todoKeys = {
  all: ["todos"],
  todo: (id: number) => ["todo", id],
};

export const useTodos = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery(["todos"], todoApi.getAll, {
    onSuccess: (data) => {
      data.forEach((todo) => {
        queryClient.setQueryData(todoKeys.todo(todo.id), todo);
      });
    },
  });

  useEffect(() => {
    const listListener = (...data: any) => {
      console.log(data);
      void queryClient.invalidateQueries(todoKeys.all);
    };
    const updateListener = (data: { id: number }) => {
      console.log(data);
      void queryClient.invalidateQueries(todoKeys.todo(data.id));
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

  return { todos: data ?? [], isLoading };
};

export const useTodosMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: addTodo } = useMutation(todoApi.create, {
    onMutate: (description: string) => {
      const tempTodo = { id: -Math.random(), description };
      queryClient.setQueryData(todoKeys.todo(tempTodo.id), tempTodo);
      queryClient.setQueryData(todoKeys.all, (old: any) => [...old, tempTodo]);
    },
    onSuccess: (d, t, c) => {

      return queryClient.invalidateQueries(todoKeys.all);
    },
  });

  const { mutate: removeTodo } = useMutation(todoApi.delete, {
    onMutate: (id: number) => {
      queryClient.setQueryData(todoKeys.all, ((old: TodoDTO[]) =>
        old.filter((todo) => todo.id !== id)) as any);
    },
    onSuccess: () => queryClient.invalidateQueries(todoKeys.all),
  });
  return useMemo(() => ({ addTodo, removeTodo }), [addTodo, removeTodo]);
};
