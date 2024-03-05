import {
    useMutation,
    useQuery,
    useQueryClient,
    useIsMutating,
} from '@tanstack/react-query'
import { userApi, UserDTO } from './api/UserApi'
import { queryOptions } from '../queryOptions'
import { io } from 'socket.io-client'
import { ReactNode, useEffect } from 'react'

const socket = io('/user-events')

// don't use onError, onSuccess etc,
const fetchUserQueryOptions = queryOptions({
    queryKey: ['my-user'],
    queryFn: userApi.getUser,
    staleTime: 60000,
})

export const UserListener = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient()
    useEffect(() => {
        const listener = () => {
            void queryClient.invalidateQueries(fetchUserQueryOptions.queryKey)
        }
        socket.on('user-update', listener)

        return () => {
            socket.off('user-update', listener)
        }
    }, [queryClient])
    return <>{children}</>
}

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
    return useIsMutating(['my-user']) > 0
}
