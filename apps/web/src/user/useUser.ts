import {useIsMutating, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {userApi} from "./api/UserApi";


const QUERY_KEY = ['user'];
export const useUser = () => {
    const {data, error, isFetching: isLoading} = useQuery(QUERY_KEY, userApi.getUser.bind(userApi));
    return {user: data, error, isLoading};
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const {mutate: updateUser, isLoading: isMutating, error: mutationError} = useMutation(['user'], (args: {
        id: string,
        name: string
    }) => userApi.update(args.id, args.name), {
        onSuccess: (data) => {
            void queryClient.setQueryData(QUERY_KEY, data);
        }
    });

    return {updateUser, isMutating, mutationError};
}

export const useUserMutating = () => {
    const isMutatingGlobal = useIsMutating(QUERY_KEY) > 0;
    return isMutatingGlobal;
}