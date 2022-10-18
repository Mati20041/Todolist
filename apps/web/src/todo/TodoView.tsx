import { useQuery } from "@tanstack/react-query";
import { todoApi, TodoDTO } from "./api/TodoApi";
import { TodoList } from "./todolist/TodoList";
import styled from "styled-components";

export const TodoView = () => {
  // const { data, isLoading } = useQuery(["todos"], todoApi.getAll);

  // if(isLoading) {
  //   return <div>Loading</div>
  // }
  const data: TodoDTO[] = [];
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
