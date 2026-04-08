import { NextResponse } from "next/server";

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

// 生成随机验证码
function generateCaptchaCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 排除易混淆字符
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// 生成SVG验证码（不依赖外部字体）
function generateSvgCaptcha(code: string): string {
  const width = 120;
  const height = 40;
  const fontSize = 28;
  
  // 生成随机背景色
  const bgColors = ["#f0f0f0", "#e8f4f8", "#f8f0e8", "#f0e8f8", "#e8f8f0"];
  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
  
  // 生成干扰线
  let noiseLines = "";
  for (let i = 0; i < 3; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    noiseLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1"/>`;
  }
  
  // 生成干扰点
  let noiseDots = "";
  for (let i = 0; i < 20; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const r = Math.random() * 2;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    noiseDots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
  }
  
  // 生成文字（带随机旋转和颜色）
  let textElements = "";
  const charWidth = width / code.length;
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const x = charWidth * i + charWidth / 2;
    const y = height / 2 + fontSize / 3;
    const rotation = (Math.random() - 0.5) * 30; // -15到15度旋转
    const color = `hsl(${Math.random() * 360}, 70%, 40%)`;
    textElements += `<text x="${x}" y="${y}" font-size="${fontSize}" fill="${color}" text-anchor="middle" transform="rotate(${rotation}, ${x}, ${y})" style="font-family: Arial, sans-serif; font-weight: bold;">${char}</text>`;
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    ${noiseLines}
    ${noiseDots}
    ${textElements}
  </svg>`;
}

export async function GET() {
  try {
    // 生成验证码
    const code = generateCaptchaCode();
    
    // 生成唯一ID
    const captchaId = Math.random().toString(36).substring(2, 15);

    // 存储验证码（10分钟有效期）
    captchaStore.set(captchaId, {
      code: code.toLowerCase(),
      expireAt: Date.now() + 10 * 60 * 1000,
    });
    
    // 生成SVG
    const svg = generateSvgCaptcha(code);

    console.log(`[Captcha] Generated: ${code}, ID: ${captchaId}`);

    return NextResponse.json({
      success: true,
      captchaId,
      svg,
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
  console.log(`[Captcha] Verifying ID: ${captchaId}, Code: ${code}`);
  console.log(`[Captcha] Store size: ${captchaStore.size}`);
  
  const stored = captchaStore.get(captchaId);
  if (!stored) {
    console.log(`[Captcha] Not found in store`);
    return false;
  }

  // 检查是否过期
  if (stored.expireAt < Date.now()) {
    console.log(`[Captcha] Expired`);
    captchaStore.delete(captchaId);
    return false;
  }

  // 验证代码（不区分大小写）
  const isValid = stored.code === code.toLowerCase();
  console.log(`[Captcha] Stored: ${stored.code}, Input: ${code.toLowerCase()}, Valid: ${isValid}`);

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
