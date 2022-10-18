import { TodoList } from "./todolist/TodoList";
import { useTodos } from "./useTodos";

export const TodoView = () => {
  const { todos, isLoading } = useTodos();

  if (isLoading) {
    return <div>Loading</div>;
  }

  return <TodoList todos={todos} />;
};
