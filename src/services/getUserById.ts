import { User } from "../@types/user";
import { api } from "./api";

interface IUserResponse {
  data: User;
}

export async function getUserById(id: string) {
    try {
        const response: IUserResponse = await api.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.log("error: ", error);
    }
}
