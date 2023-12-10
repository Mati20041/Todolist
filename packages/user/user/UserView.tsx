import {useEffect, useState} from "react";
import './UserView.css';
import {useUpdateUser, useUser, useUserMutating} from "./useUser";

export const UserView = () => {
    const {user,error ,isLoading} = useUser();
    const {updateUser, mutationError, isMutating} = useUpdateUser();
    const isMutatingGlobal = useUserMutating();

    const [name, setName] = useState("");

    useEffect(() => {
        setName(user?.name ?? "");
    }, [user?.name]);

    if (error || mutationError) {
        return <div>Error: {JSON.stringify(error || mutationError)}</div>;
    }

    if (isLoading) {
        return <div>Loading</div>;
    }

    return <form onSubmit={e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("username") as string;
        const id = formData.get("id") as string;
        void updateUser({id, name});
    }}>
        {<span style={{opacity: isMutatingGlobal && !isMutating? 1: 0}}>Mutating somewhere else</span>}
        {<span style={{opacity: isMutating? 1: 0}}>Mutating here</span>}
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