import { TodoList } from "./todolist/TodoList";
import { useTodos } from "./useTodos";

export const TodoView = () => {
  const { data, isLoading } = useTodos();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!data) {
    return <div>Error fetching data</div>;
  }

  return data && <TodoList todos={data} />;
};
