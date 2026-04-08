"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [qqNumber, setQqNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [emailCodeCountdown, setEmailCodeCountdown] = useState(0);
  const [error, setError] = useState("");

  // 完整的邮箱地址
  const email = qqNumber ? `${qqNumber}@qq.com` : "";

  // 邮箱验证码倒计时
  useEffect(() => {
    if (emailCodeCountdown > 0) {
      const timer = setTimeout(() => {
        setEmailCodeCountdown(emailCodeCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCodeCountdown]);

  // 发送邮箱验证码
  const sendEmailCode = async () => {
    if (!qqNumber) {
      setError("请先输入QQ号");
      return;
    }

    // 验证QQ号格式
    if (!/^\d{5,11}$/.test(qqNumber)) {
      setError("请输入正确的QQ号（5-11位数字）");
      return;
    }

    setIsSendingEmailCode(true);
    setError("");

    try {
      const res = await fetch("/api/email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "发送失败");
        setIsSendingEmailCode(false);
        return;
      }

      // 开发模式：显示验证码
      if (data.devCode) {
        console.log("邮箱验证码:", data.devCode);
        setError(`开发模式：验证码已打印到控制台 - ${data.devCode}`);
      }

      setEmailCodeCountdown(60); // 60秒倒计时
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 验证QQ号
    if (!qqNumber || !/^\d{5,11}$/.test(qqNumber)) {
      setError("请输入正确的QQ号");
      setIsLoading(false);
      return;
    }

    // 验证密码
    if (password !== confirmPassword) {
      setError("两次密码输入不一致");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要 6 个字符");
      setIsLoading(false);
      return;
    }

    // 验证邮箱验证码
    if (!emailCode) {
      setError("请输入邮箱验证码");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          emailCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch {
      setError("网络错误，请重试");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="20" fill="#5e6ad2"/>
                <path d="M30 70V30L50 50L70 30V70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>创建账户</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">昵称</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="您的昵称"
                required
                autoComplete="name"
              />
            </div>

            {/* QQ号输入 */}
            <div className="form-group">
              <label htmlFor="qqNumber">QQ号</label>
              <div className="qq-input-row">
                <input
                  id="qqNumber"
                  type="text"
                  value={qqNumber}
                  onChange={(e) => setQqNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  maxLength={11}
                  autoComplete="off"
                />
                <span className="qq-suffix">@qq.com</span>
              </div>
            </div>

            {/* 邮箱验证码 */}
            <div className="form-group">
              <label htmlFor="emailCode">邮箱验证码</label>
              <div className="captcha-row">
                <input
                  id="emailCode"
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6位数字"
                  required
                  maxLength={6}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={sendEmailCode}
                  disabled={isSendingEmailCode || emailCodeCountdown > 0}
                >
                  {emailCodeCountdown > 0
                    ? `${emailCodeCountdown}秒`
                    : "获取验证码"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位字符"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">确认密码</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                "注册"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>已有账户? <a href="/login">立即登录</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
