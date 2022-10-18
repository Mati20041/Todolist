import axios from "axios";

const todo_url = "";
// const todo_url = "http://localhost:3000";

export interface TodoDTO {
  id: number;
  description: string;
}

class TodoApi {
  getAll() {
    return axios.get<TodoDTO[]>(`${todo_url}/todo`).then(({ data }) => data);
  }

  getById(id: number) {
    return axios
      .get<TodoDTO>(`${todo_url}/todo/${id}`)
      .then(({ data }) => data);
  }

  create(description: string) {
    return axios.post(`${todo_url}/todo/`, { description });
  }

  update(id: number, description: string) {
    return axios.patch(`${todo_url}/todo/${id}`, { description });
  }

  delete(id: number) {
    return axios.delete(`${todo_url}/todo/${id}`);
  }
}

export const todoApi = new TodoApi();
