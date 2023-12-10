import {useEffect, useState} from "react";
import {userApi} from "./api/UserApi";
import './UserView.css';
import {useIsMutating, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export const UserView = () => {
    const queryClient = useQueryClient();
    const {data: user, error, isFetching: isLoading} = useQuery(['user'], userApi.getUser.bind(userApi));
    const {mutate: updateUser, isLoading: isMutating, error: mutationError} = useMutation(['user'], (args: {
        id: string,
        name: string
    }) => userApi.update(args.id, args.name), {
        onSuccess: (data) => {
            void queryClient.setQueryData(['user'], data);
        }
    });
    const isMutatingGlobal = useIsMutating(['user']) > 0;

    const [name, setName] = useState("");

    useEffect(() => {
        setName(user?.name ?? "");
    }, [user?.name]);

    if (error || mutationError) {
        return <div>Error: {JSON.stringify(error || mutationError)}</div>;
    }

    if (isLoading || isMutating) {
        return <div>Loading</div>;
    }

    return <form onSubmit={e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("username") as string;
        const id = formData.get("id") as string;
        void updateUser({id, name});
    }}>
        {<span style={{opacity: isMutatingGlobal? 1: 0}}>Mutating somewhere else</span>}
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