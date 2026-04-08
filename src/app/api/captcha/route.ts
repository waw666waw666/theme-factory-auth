import { NextResponse } from "next/server";
import svgCaptcha from "svg-captcha";

// 存储验证码（生产环境应使用 Redis）
const captchaStore = new Map<string, { code: string; expireAt: number }>();

// 清理过期验证码
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of captchaStore.entries()) {
    if (value.expireAt < now) {
      captchaStore.delete(key);
    }
  }
}, 60000); // 每分钟清理一次

export async function GET() {
  try {
    // 生成验证码
    const captcha = svgCaptcha.create({
      size: 4, // 4位验证码
      noise: 2, // 干扰线数量
      color: true, // 彩色
      background: "#f0f0f0", // 背景色
      width: 120,
      height: 40,
      fontSize: 40,
    });

    // 生成唯一ID
    const captchaId = Math.random().toString(36).substring(2, 15);

    // 存储验证码（5分钟有效期）
    captchaStore.set(captchaId, {
      code: captcha.text.toLowerCase(),
      expireAt: Date.now() + 5 * 60 * 1000,
    });

    return NextResponse.json({
      success: true,
      captchaId,
      svg: captcha.data,
    });
  } catch (error) {
    console.error("Captcha generation error:", error);
    return NextResponse.json(
      { error: "验证码生成失败" },
      { status: 500 }
    );
  }
}

// 验证验证码
export function verifyCaptcha(captchaId: string, code: string): boolean {
  const stored = captchaStore.get(captchaId);
  if (!stored) return false;

  // 检查是否过期
  if (stored.expireAt < Date.now()) {
    captchaStore.delete(captchaId);
    return false;
  }

  // 验证代码
  const isValid = stored.code === code.toLowerCase();

  // 验证成功后删除（一次性使用）
  if (isValid) {
    captchaStore.delete(captchaId);
  }

  return isValid;
}

// 删除验证码
export function deleteCaptcha(captchaId: string): void {
  captchaStore.delete(captchaId);
}
