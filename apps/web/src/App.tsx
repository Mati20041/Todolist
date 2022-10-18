import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { TodoView } from "./todo/TodoView";
import { queryClient } from "./QueryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoView />
    </QueryClientProvider>
  );
}

export default App;
