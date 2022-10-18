import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { todoApi, TodoDTO } from "../api/TodoApi";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface TodoProps {
  todoId: number;
  remove: (id: number) => unknown;
}

export const Todo = ({ remove, todoId }: TodoProps) => {
  const queryClient = useQueryClient();
  const { data } = useQuery(["todos", todoId], () => todoApi.getById(todoId));
  const { mutate: update } = useMutation(
    ["todos", todoId],
    (newDescription: string) => todoApi.update(todoId, newDescription),
    {
      onMutate: (newDescription) => {
        queryClient.setQueryData(["todos", todoId], (old: any) => ({
          ...old,
          description: newDescription,
        }));
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["todos", todoId]);
      },
    }
  );
  const { id, description } = data!;

  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTodo = (newDescription: string) => {
    if (newDescription !== description) {
      update(newDescription);
    }
    setEdit(false);
  };

  useEffect(() => {
    if (edit) {
      const listener = () => {
        updateTodo(inputRef.current?.value ?? "");
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
    <StyledTodo
      onClick={(e) => {
        setEdit(true);
        e.stopPropagation();
      }}
    >
      <StyledDescription>
        {edit ? (
          <input
            ref={inputRef}
            onKeyDown={onEnter}
            type="text"
            defaultValue={description}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span>{description}</span>
        )}
      </StyledDescription>
      <StyledButton onClick={() => remove(id)}>X</StyledButton>
    </StyledTodo>
  );
};

const StyledDescription = styled.span`
  flex: 1;
  background-color: rgba(239, 237, 237, 0.8);
  padding: 1rem;
`;

const StyledButton = styled.span`
  justify-items: center;
  background-color: rgba(178, 84, 215, 0.8);
  display: inline-flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 2rem;
  cursor: pointer;
`;

const StyledTodo = styled.div`
  width: 20rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  margin: 1rem;
  overflow: hidden;
  box-shadow: black inset 0 0 1rem;
`;
