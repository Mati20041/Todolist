import { useEffect, useState } from 'react'
import { userApi, UserDTO } from './api/UserApi'
import './UserView.css'

export const UserView = () => {
    const [user, setUser] = useState<UserDTO>()
    const [error, setError] = useState<string>()
    const [isLoading, setIsLoading] = useState(true)

    const [name, setName] = useState('')

    useEffect(() => {
        setName(user?.name ?? '')
    }, [user?.name])

    useEffect(() => {
        setIsLoading(true)
        userApi
            .getUser()
            .then((user) => {
                setUser(user)
                setName(user?.name ?? '')
                setError(undefined)
            })
            .catch((error) => {
                setError(error.message)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    if (error) {
        return <div>Error: {error}</div>
    }

    if (isLoading) {
        return <div>Loading</div>
    }

    const handleUpdate = async (id: string, name: string) => {
        setIsLoading(true)
        userApi
            .update(id, name)
            .then((user) => {
                setUser(user)
                setError(undefined)
            })
            .catch((error) => {
                setError(error.message)
            })
            .finally(() => {
                setIsLoading(false)
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
