import React, { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { TodoDTO } from "../api/TodoApi";
import styled from "styled-components";

interface TodoProps {
  todo: TodoDTO;
  remove: (id: number) => unknown;
  update: (id: number, description: string) => unknown;
}

export const Todo = ({
  remove,
  update,
  todo: { description, id },
}: TodoProps) => {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  const updateTodo = (newDescription: string) => {
    update(id, newDescription);
    setEdit(false);
  };

  useEffect(() => {
    if(edit) {
      const listener = () => {
        updateTodo(inputRef.current?.value ?? '')
      };
      window.addEventListener("click", listener);
      return () => window.removeEventListener("click", listener);
    }
  }, [edit, updateTodo]);

  const onEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      updateTodo(e.currentTarget.value);
    }
  };

  return (
    <StyledTodo onClick={e => e.stopPropagation()}>
      <StyledDescription>
        {edit ? (
          <input
            ref={inputRef}
            onKeyDown={onEnter}
            type="text"
            defaultValue={description}
            autoFocus
          />
        ) : (
          <span onClick={() => setEdit(true)}>{description}</span>
        )}
      </StyledDescription>
      <StyledButton onClick={() => remove(id)}>X</StyledButton>
    </StyledTodo>
  );
};

const StyledDescription = styled.span`
  flex: 1;
  background-color: #efeded;
  padding: 1rem;
`;

const StyledButton = styled.span`
  justify-items: center;
  background-color: aqua;
  display: inline-flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 1rem;
  cursor: pointer;
`;

const StyledTodo = styled.div`
  width: 20rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin: 1rem;
  overflow: hidden;
`;
