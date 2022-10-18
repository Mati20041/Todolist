import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi, TodoDTO } from "./api/TodoApi";
import { TodoList } from "./todolist/TodoList";
import styled from "styled-components";
import { io } from "socket.io-client";
import { useEffect } from "react";

const todoEventTypes = ["todo-new", "todo-delete"];

const socket = io("/todo-events");

export const TodoView = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, refetch } = useQuery(["todos"], todoApi.getAll, {
    onSuccess: (data) => {
      data.forEach(todo => {
        queryClient.setQueryData(['todos', todo.id], todo)
      })
    }
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
      void queryClient.invalidateQueries(['todos', data.id])
    })
    return () => {
      todoEventTypes.forEach((e) =>
        socket.off(e, listener)
      );
    };
  }, [refetch]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return <div>Error fetching data</div>;
  }

  return (
    data && (
      <StyledLayout>
        <h1>TODO LIST</h1>
        <TodoList todos={data} />
      </StyledLayout>
    )
  );
};

const StyledLayout = styled.div`
  width: 40rem;
  margin: 3rem auto;
  background-color: aliceblue;
  box-shadow: 1rem 1rem 1rem #949494;
  padding: 1rem;
`;
