import { NextRequest, NextResponse } from "next/server";

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
async function sendEmail(to: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查环境变量
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    console.log("[Email] SMTP Config check:", { 
      hasHost: !!smtpHost, 
      hasPort: !!smtpPort, 
      hasUser: !!smtpUser,
      hasPass: !!smtpPass
    });
    
    if (!smtpUser || !smtpPass) {
      return { success: false, error: "SMTP未配置" };
    }
    
    // 动态导入nodemailer
    let nodemailer;
    try {
      nodemailer = await import("nodemailer");
    } catch (e) {
      return { success: false, error: "邮件模块加载失败" };
    }
    
    const transporter = nodemailer.createTransport({
      host: smtpHost || "smtp.qq.com",
      port: parseInt(smtpPort || "465"),
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // 添加超时设置
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Theme Factory" <${smtpUser}>`,
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
    return { success: true };
  } catch (error: any) {
    console.error("[Email] Send error:", error?.message || error);
    return { success: false, error: error?.message || "发送失败" };
  }
}

// 发送邮箱验证码
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    console.log("[Email] Request received for:", email);

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
    console.log("[Email] Generated code:", code, "for:", email);

    // 存储验证码（10分钟有效期）
    emailCodeStore.set(email, {
      code,
      expireAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
    });

    // 尝试发送邮件
    const result = await sendEmail(email, code);
    
    if (!result.success) {
      console.error("[Email] Failed to send:", result.error);
      // 即使发送失败，也返回成功（开发模式），但包含错误信息
      return NextResponse.json({
        success: true,
        message: `验证码已生成（邮件发送失败: ${result.error}）`,
        devCode: code, // 开发模式返回验证码
        warning: result.error,
      });
    }

    console.log("[Email] Sent successfully to:", email);

    return NextResponse.json({
      success: true,
      message: "验证码已发送到您的邮箱",
    });
  } catch (error: any) {
    console.error("[Email] API error:", error?.message || error);
    return NextResponse.json(
      { error: `验证码发送失败: ${error?.message || "未知错误"}` },
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
