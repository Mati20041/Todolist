import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { TodoView } from "./todo/TodoView";
import { queryClient } from "./QueryClient";
import styled from "styled-components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledLayout>
        <h1>TODO LIST</h1>
        <TodoView />
      </StyledLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const StyledLayout = styled.div`
  width: 40rem;
  margin: 3rem auto;
  background-color: aliceblue;
  box-shadow: 1rem 1rem 1rem #949494;
  padding: 1rem;
`;

export default App;
