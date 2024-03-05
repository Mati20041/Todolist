import { useEffect, useState } from 'react'
import './UserView.css'
import { useIsUserMutating, useUser, useUserMutation } from './useUser'

export const UserView = () => {
    const { data: user, isLoading, error } = useUser()
    const {
        mutate: handleUpdate,
        isLoading: isPending,
        error: mutationError,
    } = useUserMutation()
    const isGlobalPending = useIsUserMutating();

    const [name, setName] = useState('')

    useEffect(() => {
        setName(user?.name ?? '')
    }, [user?.name])

    if (error || mutationError) {
        return <div>Error: {JSON.stringify(error ?? mutationError)}</div>
    }

    if (isLoading) {
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
            <span>
                <label>Global Mutation: {JSON.stringify(isGlobalPending)}</label>
            </span>
            <button type="submit">Submit</button>
        </form>
    )
}
