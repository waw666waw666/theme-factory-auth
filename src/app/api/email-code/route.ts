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

// 发送验证码邮件
async function sendEmail(to: string, code: string): Promise<boolean> {
  // 这里需要配置你的邮箱 SMTP
  // 示例使用 QQ 邮箱，你需要替换为真实的邮箱配置
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.qq.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "your-email@qq.com",
      pass: process.env.SMTP_PASS || "your-auth-code",
    },
  });

  try {
    await transporter.sendMail({
      from: `"Theme Factory" <${process.env.SMTP_USER || "your-email@qq.com"}>`,
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
          <p>验证码有效期为 10 分钟，请勿泄露给他人。</p>
          <p style="color: #999; font-size: 12px;">如非本人操作，请忽略此邮件。</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

// 发送邮箱验证码
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    // 检查是否频繁发送（60秒内只能发送一次）
    const existing = emailCodeStore.get(email);
    if (existing && existing.expireAt - Date.now() > 9 * 60 * 1000) {
      return NextResponse.json(
        { error: "发送太频繁，请稍后再试" },
        { status: 429 }
      );
    }

    // 生成验证码
    const code = generateCode();

    // 存储验证码（10分钟有效期）
    emailCodeStore.set(email, {
      code,
      expireAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });

    // 发送邮件（如果配置了SMTP）
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const sent = await sendEmail(email, code);
      if (!sent) {
        return NextResponse.json(
          { error: "邮件发送失败，请检查邮箱配置" },
          { status: 500 }
        );
      }
    } else {
      // 开发环境：直接返回验证码（仅用于测试）
      console.log(`[DEV] Email code for ${email}: ${code}`);
      return NextResponse.json({
        success: true,
        message: "开发模式：验证码已打印到控制台",
        devCode: code, // 仅开发环境返回
      });
    }

    return NextResponse.json({
      success: true,
      message: "验证码已发送到您的邮箱",
    });
  } catch (error) {
    console.error("Email code error:", error);
    return NextResponse.json(
      { error: "验证码发送失败" },
      { status: 500 }
    );
  }
}

// 验证邮箱验证码
export function verifyEmailCode(email: string, code: string): boolean {
  const stored = emailCodeStore.get(email);
  if (!stored) return false;

  // 检查是否过期
  if (stored.expireAt < Date.now()) {
    emailCodeStore.delete(email);
    return false;
  }

  // 增加尝试次数
  stored.attempts++;
  if (stored.attempts > 5) {
    emailCodeStore.delete(email);
    return false;
  }

  // 验证代码
  const isValid = stored.code === code;

  // 验证成功后删除
  if (isValid) {
    emailCodeStore.delete(email);
  }

  return isValid;
}
