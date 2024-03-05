import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userApi, UserDTO } from './api/UserApi'
import { queryOptions } from '../queryOptions'


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