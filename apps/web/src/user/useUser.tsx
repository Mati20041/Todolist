import { useMutation, useQuery, useQueryClient, useIsMutating } from '@tanstack/react-query'
import { userApi, UserDTO } from './api/UserApi'
import { queryOptions } from '../queryOptions'


// don't use onError, onSuccess etc,
const fetchUserQueryOptions = queryOptions({
    queryKey: ['my-user'],
    queryFn: userApi.getUser,
})

export function useUser() {
    return useQuery(fetchUserQueryOptions)
}

export function useUserMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['my-user'],
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            userApi.update(id, name),
        onMutate: async ({ name }) => {
            await queryClient.cancelQueries({
                queryKey: fetchUserQueryOptions.queryKey,
            })

            const previousValue = queryClient.getQueryData<UserDTO>(
                fetchUserQueryOptions.queryKey,
            )

            queryClient.setQueryData(
                fetchUserQueryOptions.queryKey,
                (data: UserDTO | undefined) => data && { ...data, name },
            )
            return { previousValue }
        },
        onError: (error, variables, context) => {
            context &&
            queryClient.setQueryData(
                fetchUserQueryOptions.queryKey,
                context.previousValue,
            )
        },
        // onSuccess: (data) =>
        //     queryClient.setQueryData(fetchUserQueryOptions.queryKey, data),
        onSettled: () =>
            queryClient.invalidateQueries(fetchUserQueryOptions.queryKey),
    })
}

export const useIsUserMutating = () => {
    return useIsMutating(['my-user']) > 0;
}