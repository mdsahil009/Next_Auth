import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/Models/user";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect() 

    try{
        const {username, email, password } =await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username are already exist"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() + 9000000).toString()


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                } ,{status : 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }

        }else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() +1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()

        }

        const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.sucess) {
            return Response.json({
                success: false,
                message: emailResponse.message
            } ,{status : 500})
        }

        return Response.json({
            success: true,
            message: "User registered Successfully"
        } ,{status : 200})
   
        
    } catch (error){
        console.error('Error registering user ', error)
        return Response.json(
            {
                success: false,
                message: "error registering user "
            },
            {
                status: 500
            }
        )
    }
}