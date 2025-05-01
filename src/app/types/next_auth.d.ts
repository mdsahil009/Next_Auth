import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next_auth' {
    interface User{
        _id? : string;
        isVerified? : boolean;
        isAcceptingMessage? : boolean;
        username? : string
    }
    interface Session{
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: string;
            username? : string;
        } & DefaultSession['user']
    }
}