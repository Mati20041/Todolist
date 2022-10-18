import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi, TodoDTO } from "./api/TodoApi";
import { TodoList } from "./todolist/TodoList";
import styled from "styled-components";
import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("/todo-events");

export const TodoView = () => {
  const { data, isLoading, refetch } = useQuery(["todos"], todoApi.getAll);

  useEffect(() => {
    const listener = (...data: any) => {
      console.log(data);
      void refetch();
    };
    ["todo-new", "todo-update", "todo-delete"].forEach((event) => {
      socket.on(event, listener);
    });
    return () => {
      ["todo-new", "todo-update", "todo-delete"].forEach((e) =>
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
