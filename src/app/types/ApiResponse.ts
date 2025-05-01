import { Message } from "../Models/user";

export interface ApiResponse{
    sucess: boolean;
    message: string;
    isAceptingMessages?: boolean;
    messages?: Array<Message>
}