import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { verifyEmailCode } from "@/app/api/email-code/route";

export async function POST(request: Request) {
  try {
    const { name, email, password, emailCode } = await request.json();

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 验证邮箱验证码
    if (!emailCode) {
      return NextResponse.json(
        { error: "请输入邮箱验证码" },
        { status: 400 }
      );
    }

    const isEmailCodeValid = verifyEmailCode(email, emailCode);
    if (!isEmailCodeValid) {
      return NextResponse.json(
        { error: "邮箱验证码错误或已过期" },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要 6 个字符" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入新用户
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "注册失败，请重试" },
        { status: 500 }
      );
    }

    // 生成 token
    const token = Buffer.from(`${newUser.email}:${Date.now()}`).toString(
      "base64"
    );

    const response = NextResponse.json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
