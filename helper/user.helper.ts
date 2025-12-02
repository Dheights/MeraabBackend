import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

export function generateOtp(): string {
    // 6-digit numeric
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // Brevo uses STARTTLS on port 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export async function sendOtpEmail(email: string, otp: string) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <title>Your One-Time Password (OTP)</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin:0; padding:0; background-color:#f5f7fb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f7fb; padding:24px 0;">
                <tr>
                    <td align="center">
                    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(15,23,42,0.08);">
                        
                        <!-- Header -->
                        <tr>
                        <td style="padding:20px 28px; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#ffffff;">
                            <h1 style="margin:0; font-size:20px; font-weight:600;">Meraab</h1>
                            <p style="margin:4px 0 0; font-size:13px; opacity:0.9;">
                            Your secure one-time password
                            </p>
                        </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                        <td style="padding:24px 28px 8px; color:#111827;">
                            <p style="margin:0 0 12px; font-size:14px;">Hi there,</p>
                            <p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
                            Use the following one-time password (OTP) to complete your sign up on <strong>Meraab</strong>.
                            For your security, this code is valid for the next <strong>10 minutes</strong>.
                            </p>

                            <!-- OTP Box -->
                            <table cellspacing="0" cellpadding="0" width="100%" style="margin:16px 0 20px;">
                            <tr>
                                <td align="center" style="padding:16px 12px; border-radius:10px; background-color:#f3f4ff; border:1px solid #e0e7ff;">
                                <span style="display:inline-block; font-size:24px; letter-spacing:6px; font-weight:700; color:#1d4ed8; font-family:'SF Mono',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">
                                    ${otp}
                                </span>
                                </td>
                            </tr>
                            </table>

                            <p style="margin:0 0 10px; font-size:13px; line-height:1.6; color:#4b5563;">
                            If you didn’t request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
                            </p>

                            <p style="margin:18px 0 0; font-size:13px; color:#6b7280;">
                            Thanks,<br />
                            <span style="font-weight:500; color:#111827;">The Meraab Team</span>
                            </p>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td style="padding:16px 24px 20px; background-color:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
                            <p style="margin:0 0 4px; font-size:11px; color:#9ca3af;">
                            This is an automated message, please do not reply.
                            </p>
                            <p style="margin:0; font-size:11px; color:#9ca3af;">
                            If you have any questions, contact us at 
                            <a href="mailto:support@meraab.app" style="color:#2563eb; text-decoration:none;">support@meraab.app</a>.
                            </p>
                        </td>
                        </tr>

                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>
        `
    });
}
