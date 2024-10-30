import { User } from "../@types/user";
import { api } from "./api";

interface IUsersResponse {
  data?: User[];
}

export async function getUsers() {
  try {
    const response: IUsersResponse = await api.get(`/admin/users`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
