import React, {
  FunctionComponent,
  KeyboardEventHandler, useCallback,
  useEffect,
  useState
} from "react";
import { todoApi, TodoDTO } from "../api/TodoApi";
import { Todo } from "./Todo";
import { useQueryClient } from "@tanstack/react-query";

const MemoTodo = React.memo(Todo)

interface TodoListProps {
  todos: TodoDTO[];
}

export const TodoList: FunctionComponent<TodoListProps> = ({ todos }) => {
  const [localTodos, setLocalTodos] = useState(todos);
  const queryClient = useQueryClient()

  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  const addTodo = (description: string) => {
    const tempTodo = { id: -Math.random(), description };
    setLocalTodos((localTodos) => [
      ...localTodos,
      tempTodo,
    ]);
    queryClient.setQueryData(["todos", tempTodo.id], tempTodo)
    void todoApi.create(description);
  };

  const removeTodo = useCallback((id: number) => {
    setLocalTodos((localTodos) => localTodos.filter((t) => t.id !== id));
    void todoApi.delete(id);
  }, []);

  const onEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      addTodo(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  return (
    <div>
      <div>
        {localTodos.map((todo) => (
          <MemoTodo
            key={todo.id}
            remove={removeTodo}
            todoId={todo.id}
          />
        ))}
      </div>
      <input type="text" placeholder="Type and Enter" onKeyDown={onEnter} />
    </div>
  );
};

