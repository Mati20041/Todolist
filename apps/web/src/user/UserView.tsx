import { useEffect, useState } from 'react'
import { userApi } from './api/UserApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import './UserView.css'
import { queryOptions } from '../queryOptions'

const fetchUserQueryOptions = queryOptions({
    queryKey: ['my-user'],
    queryFn: userApi.getUser,
})

export const UserView = () => {
    const queryClient = useQueryClient()
    const { data: user, isLoading, error } = useQuery(fetchUserQueryOptions)

    const [name, setName] = useState('')

    useEffect(() => {
        setName(user?.name ?? '')
    }, [user?.name])

    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>
    }

    if (isLoading) {
        return <div>Loading</div>
    }
    const handleUpdate = async (id: string, name: string) => {
        userApi
            .update(id, name)
            .then((updatedUser) =>
                queryClient.setQueryData(
                    fetchUserQueryOptions.queryKey,
                    updatedUser,
                ),
            )
            .finally(() => {
                queryClient.invalidateQueries(fetchUserQueryOptions.queryKey)
            })
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('username') as string
                const id = formData.get('id') as string
                void handleUpdate(id, name)
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
                <label htmlFor="age">Age: </label>
                <p id="age">{user?.age ?? 'N/A'}</p>
            </span>
            <button type="submit">Submit</button>
        </form>
    )
}
