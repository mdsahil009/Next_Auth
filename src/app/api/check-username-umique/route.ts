import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/user";
import {z} from "zod";

import {usernameValidation} from "@/app/schema/signUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)

        console.log(result) // todo remove
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', '): 'Invalid query parameter', 
            }, {status: 400})
        }
        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken ',
            }, {status: 400})
        } 
        return Response.json({
            success: true,
            message: 'Username is available ',
        }, {status: 400})

    } catch (error) {
        console.error ("Error checking username ", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username" 
            },
            { status: 500},
        )
    }
}