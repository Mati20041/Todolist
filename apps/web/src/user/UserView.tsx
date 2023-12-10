import {useEffect, useState} from "react";
import {userApi} from "./api/UserApi";
import './UserView.css';
import {useQuery} from "@tanstack/react-query";

export const UserView = () => {
    const {data: user, error, isFetching: isLoading, refetch} = useQuery(['user'], userApi.getUser.bind(userApi));

    const [name, setName] = useState("");

    useEffect(() => {
        setName(user?.name ?? "");
    }, [user?.name]);

    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (isLoading) {
        return <div>Loading</div>;
    }

    const handleUpdate = async (id: string, name: string) => {
        userApi.update(id, name).then(() => refetch());
    }

    return <form onSubmit={e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("username") as string;
        const id = formData.get("id") as string;
        void handleUpdate(id, name);
    }}>

        <input type="hidden" name="id" id="id" value={user?.id}/>
        <span>
            <label htmlFor="username">Username: </label>
            <input
                type="text"
                name="username"
                id="username"
                value={name}
                onChange={e => setName(e.currentTarget.value)}/>
        </span>
        <button type="submit">Submit</button>
    </form>
}