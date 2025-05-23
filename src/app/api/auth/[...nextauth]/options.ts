import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/app/lib/dbConnect"
import UserModel from "@/app/Models/user"

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error("User does not exist ")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please Verify your email before login")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user
                    }else {
                        throw new Error("Invalid Password")
                    }             
                } catch (err:any) {
                    throw new Error(err.message)
                }
              }
        })
    ],
    callbacks: {
        async jwt({ token, user } : any) {
            if(user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }

            return token
        },
        async session({ session, token } : any) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn :  '/signin'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}