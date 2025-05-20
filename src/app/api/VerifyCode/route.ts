import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/user";
import { any } from "zod";
import {z} from "zod"

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username : any , code} = await request.json()

        const decodedUsername = decodeURIComponent{username : {}}

        const user = await UserModel.findOne({username: decodedUsername})


        if (!user){
            return Response.json(
            {
            success: false,
            message: "User not found"
            },
            {status: 500}
        )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            
            return Response.json(
            {
            success: true,
            message: "Account verified Successfully"
            },
            {status: 200}
            )
        }else if (!isCodeNotExpired) {
            return Response.json(
            {
            success: false,
            message: "Verification code has expired"
            },
            {status: 400}
            )
        }else {
            return Response.json(
            {
            success: false,
            message: "Incorrect verification code"
            },
            {status: 500}
        )
        }

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {
            success: false,
            message: "Error verifying user"
            },
            {status: 500}
        )
    }
}