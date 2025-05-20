import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/user";
import { Message } from "@/app/Models/user";

export async function POST(request: Request) {
    await dbConnect() 

    const {username , content } =  await request.json()

    try {
        const user = await UserModel.findOne({username})
        if (!user) {
             return Response.json(
            {
                success : false,
                message: "User not found"
            },
            { status : 404}
        )
        }
        // is User Accepting meassages 

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: "User is not accepting messages"
                },
                {status : 403}
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true, 
                message: "Message sent successfully "
            },
            {status : 401}
        )

    } catch (error) {
        console.log("Error adding messages : ", error )
        return Response.json(
            {
                success : false,
                message: "Internal Server Error "
            },
            { status : 5000}
        )
    }
}