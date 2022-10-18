import React, { FunctionComponent, KeyboardEventHandler } from "react";
import { TodoDTO } from "../api/TodoApi";
import { Todo } from "./Todo";
import { useTodosMutation } from "../useTodos";

const MemoTodo = React.memo(Todo);

interface TodoListProps {
  todos: TodoDTO[];
}

export const TodoList: FunctionComponent<TodoListProps> = ({ todos }) => {
  const { addTodo, removeTodo } = useTodosMutation();

  const onEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      addTodo(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  return (
    <div>
      <div>
        {todos.map((todo) => (
          <MemoTodo key={todo.id} remove={removeTodo} todoId={todo.id} />
        ))}
      </div>
      <input type="text" placeholder="Type and Enter" onKeyDown={onEnter} />
    </div>
  );
};
