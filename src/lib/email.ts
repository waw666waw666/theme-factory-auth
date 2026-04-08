import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.qq.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: '验证码 - Theme Factory',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Theme Factory 验证码</h2>
        <p>您的验证码是：</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #333;">
          ${code}
        </div>
        <p style="color: #666; margin-top: 20px;">验证码有效期为 5 分钟，请勿泄露给他人。</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
