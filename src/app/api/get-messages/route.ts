import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/user";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
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

    const userId = new mongoose.Type.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort : {_id: '$_id', messages: {$push: "$messages"}}}
        ])

        if (!user || user.length === 0 ){
           return Response.json(
            {
                success : false,
                message: "User not found"
            },
            { status : 400}
        ) 
        }
        else {
            return Response.json(
            {
                success : true,
                messages: user[0].messages
            },
            { status : 200}
        )
        }
    } catch (error) {
        console.log(" An excepted error occured : ", error)
        return Response.json(
            
            {
                success : false,
                message: "Not Authenticated"
            },
            { status : 500}
        )
    }

}