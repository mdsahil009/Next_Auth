import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/user";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request : Request) {
    await dbConnect() 
    
    const session  = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success : false,
                message: "Not Authenticated"
            },
            { status : 401}
        )
    }

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try { 
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, {isAcceptingMessage: acceptMessages},
            {new: true}
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success : false,
                    message: "failed to update user status to accept messages"
                },
                { status : 500}
                )  
            }else {
               return Response.json(
                    {
                        success : true,
                        message: "Message acceptance status updated successfully",
                        updatedUser
                    },
                    { status : 200}
                ) 
            }
            
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success : false,
                message: "failed to update user status to accept messages"
            },
            { status : 500}
        )
    }
    
}


export async function GET(request : Request){
    await dbConnect() 
    
    const session  = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success : false,
                message: "Not Authenticated"
            },
            { status : 401}
        )
    }

    const userId = user._id;

    const foundUser = await UserModel.findById(userId)

    try {
        if (!foundUser) {
             return Response.json(
                {
                    success : false,
                    message: "User not found "
                },
                { status : 404}
            )
        } else {
            return Response.json(
                {
                    success : true,
                    isAcceptingMessages: foundUser.isAcceptingMessage
                },
                { status : 200}
            )
        }
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success : false,
                message: "Error while getting Message acceptence status "
            },
            { status : 500}
        )   
    }

}