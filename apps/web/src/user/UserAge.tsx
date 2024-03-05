import {useUser} from "./useUser";

export const UserAge = () => {
    const {data} = useUser(user => user.age);

    console.log('user age rendering');

    return <div>
        <label>User Age: {data ?? 'N/A'}</label>
    </div>
}