import { useEffect, useState } from 'react'
import { userApi, UserDTO } from './api/UserApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './UserView.css'
import { queryOptions } from '../queryOptions'

const fetchUserQueryOptions = queryOptions({
    queryKey: ['my-user'],
    queryFn: userApi.getUser,
})

export const UserView = () => {
    const queryClient = useQueryClient()
    const { data: user, isLoading, error } = useQuery(fetchUserQueryOptions)

    const {
        mutate: handleUpdate,
        isLoading: isPending,
        error: mutationError,
    } = useMutation({
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
    const [name, setName] = useState('')

    useEffect(() => {
        setName(user?.name ?? '')
    }, [user?.name])

    if (error || mutationError) {
        return <div>Error: {JSON.stringify(error ?? mutationError)}</div>
    }

    if (isLoading || isPending) {
        return <div>Loading</div>
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('username') as string
                const id = formData.get('id') as string
                void handleUpdate({ id, name })
            }}
        >
            <input type="hidden" name="id" id="id" value={user?.id} />
            <span>
                <label htmlFor="username">Username: </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                />
            </span>
            <span>
                <label htmlFor="cachedName">Cached Name: </label>
                <span id="age">{user?.name ?? 'N/A'}</span>
            </span>
            <span>
                <label htmlFor="age">Age: </label>
                <span id="age">{user?.age ?? 'N/A'}</span>
            </span>
            <span>
                <label>Mutation: {JSON.stringify(isPending)}</label>
            </span>
            <button type="submit">Submit</button>
        </form>
    )
}
