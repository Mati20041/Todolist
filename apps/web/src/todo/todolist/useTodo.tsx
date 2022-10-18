import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoApi } from "../api/TodoApi";

export const useTodo = (todoId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["todos", todoId];
  const { data } = useQuery(queryKey, () => todoApi.getById(todoId));
  const { mutate: update } = useMutation(
    queryKey,
    (newDescription: string) => todoApi.update(todoId, newDescription),
    {
      onMutate: (newDescription) => {
        queryClient.setQueryData(queryKey, (old: any) => ({
          ...old,
          description: newDescription
        }));
      },
      onSuccess: () => {
        void queryClient.invalidateQueries(queryKey);
      }
    }
  );
  return { update, todo: data ?? { id: -10, description: "error" } };
};
