import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// 存储邮箱验证码
const emailCodeStore = new Map<
  string,
  { code: string; expireAt: number; attempts: number }
>();

// 清理过期验证码
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of emailCodeStore.entries()) {
    if (value.expireAt < now) {
      emailCodeStore.delete(key);
    }
  }
}, 60000);

// 生成6位数字验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.qq.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 发送验证码邮件
async function sendEmail(to: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: "SMTP未配置" };
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Theme Factory" <${process.env.SMTP_USER}>`,
      to,
      subject: "Theme Factory - 邮箱验证码",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #5e6ad2;">Theme Factory</h2>
          <p>您好！</p>
          <p>您的邮箱验证码是：</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>验证码有效期为 10 分钟。</p>
          <p style="color: #999; font-size: 12px;">如非本人操作，请忽略此邮件。</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("[Email] 发送失败:", error?.message);
    return { success: false, error: error?.message || "发送失败" };
  }
}

// 发送邮箱验证码
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // 检查频率限制
    const existing = emailCodeStore.get(email);
    if (existing && existing.expireAt - Date.now() > 9 * 60 * 1000) {
      return NextResponse.json({ error: "发送太频繁，请稍后再试" }, { status: 429 });
    }

    // 生成验证码
    const code = generateCode();

    // 存储验证码
    emailCodeStore.set(email, {
      code,
      expireAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });

    // 发送邮件
    const result = await sendEmail(email, code);

    if (!result.success) {
      return NextResponse.json({ error: `邮件发送失败: ${result.error}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "验证码已发送到您的邮箱",
    });
  } catch (error: any) {
    console.error("[Email] API error:", error?.message);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 验证邮箱验证码
export function verifyEmailCode(email: string, code: string): boolean {
  const stored = emailCodeStore.get(email);
  if (!stored) return false;

  if (stored.expireAt < Date.now()) {
    emailCodeStore.delete(email);
    return false;
  }

  stored.attempts++;
  if (stored.attempts > 5) {
    emailCodeStore.delete(email);
    return false;
  }

  const isValid = stored.code === code;
  if (isValid) {
    emailCodeStore.delete(email);
  }

  return isValid;
}
