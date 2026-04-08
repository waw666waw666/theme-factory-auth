"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [emailCodeCountdown, setEmailCodeCountdown] = useState(0);
  const [error, setError] = useState("");

  // 获取图形验证码
  const fetchCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha");
      const data = await res.json();
      if (data.success) {
        setCaptchaSvg(data.svg);
        setCaptchaId(data.captchaId);
        setCaptchaCode("");
      }
    } catch (error) {
      console.error("获取验证码失败:", error);
    }
  };

  // 初始加载验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

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
    if (!email) {
      setError("请先输入邮箱地址");
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

    // 验证图形验证码
    if (!captchaCode) {
      setError("请输入图形验证码");
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
          captchaId,
          captchaCode,
          emailCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "注册失败");
        // 刷新验证码
        fetchCaptcha();
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
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="20" fill="#5e6ad2"/>
                <path d="M30 70V30L50 50L70 30V70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>创建账户</h1>
            <p>加入 Theme Factory</p>
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

            <div className="form-group">
              <label htmlFor="email">邮箱地址</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>

            {/* 邮箱验证码 */}
            <div className="form-group">
              <label htmlFor="emailCode">邮箱验证码</label>
              <div className="captcha-row">
                <input
                  id="emailCode"
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="6位数字验证码"
                  required
                  maxLength={6}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={sendEmailCode}
                  disabled={isSendingEmailCode || emailCodeCountdown > 0}
                  style={{ marginLeft: "10px", whiteSpace: "nowrap" }}
                >
                  {emailCodeCountdown > 0
                    ? `${emailCodeCountdown}秒后重试`
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
                placeholder="至少 6 个字符"
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

            {/* 图形验证码 */}
            <div className="form-group">
              <label htmlFor="captcha">图形验证码</label>
              <div className="captcha-row">
                <input
                  id="captcha"
                  type="text"
                  value={captchaCode}
                  onChange={(e) => setCaptchaCode(e.target.value)}
                  placeholder="输入验证码"
                  required
                  maxLength={4}
                  style={{ flex: 1 }}
                />
                {captchaSvg && (
                  <div
                    className="captcha-image"
                    onClick={fetchCaptcha}
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      background: "#fff",
                      borderRadius: "6px",
                      padding: "2px",
                    }}
                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                    title="点击刷新验证码"
                  />
                )}
              </div>
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
