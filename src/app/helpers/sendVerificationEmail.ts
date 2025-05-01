import { resend } from "@/app/lib/resend";

import VerificationEmail from "../../../emails/VerificationEmail";

import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: '',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {sucess: true, message: 'Verification email send successfully'}
    }catch (emailError) {
        console.error("Error while sending email", emailError)
        return {sucess: false, message: 'failed to send verification email'}
    }
}
