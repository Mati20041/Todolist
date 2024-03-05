import axios from "axios";

const todo_url = "";
// const todo_url = "http://localhost:3000";

export interface UserDTO {
  id: number;
  name: string;
  age: number;
}

class UserApi {
  getUser() {
    return axios.get<UserDTO>(`${todo_url}/user`).then(({ data }) => data);
  }
  update(id: string, name: string) {
    return axios.put<UserDTO>(`${todo_url}/user`, { id, name }).then(({ data }) => data);
  }
}

export const userApi = new UserApi();
