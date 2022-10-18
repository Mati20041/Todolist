import React, {
  FunctionComponent,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { TodoDTO } from "../api/TodoApi";
import { Todo } from "./Todo";

interface TodoListProps {
  todos: TodoDTO[];
}

export const TodoList: FunctionComponent<TodoListProps> = ({ todos }) => {
  const [localTodos, setLocalTodos] = useState(todos);

  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  const addTodo = (description: string) => {
    setLocalTodos((localTodos) => [
      ...localTodos,
      { id: -Math.random(), description },
    ]);
  };

  const removeTodo = (id: number) => {
    setLocalTodos((localTodos) => localTodos.filter((t) => t.id !== id));
  };

  const updateTodo = (id: number, description: string) => {
    setLocalTodos((localTodos) =>
      localTodos.map((t) => (t.id === id ? { ...t, description } : t))
    );
  };

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
          <Todo
            key={todo.id}
            remove={removeTodo}
            update={updateTodo}
            todo={todo}
          />
        ))}
      </div>
      <input type="text" placeholder="Type and Enter" onKeyDown={onEnter} />
    </div>
  );
};

