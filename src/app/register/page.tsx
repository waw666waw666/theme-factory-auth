"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #08090a;
          color: #f7f8f8;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
          padding: 20px;
        }

        .login-card {
          background: #0f1011;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 40px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo {
          display: inline-block;
          margin-bottom: 16px;
        }

        .login-header h1 {
          font-size: 24px;
          font-weight: 590;
          letter-spacing: -0.24px;
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 15px;
          color: #8a8f98;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 510;
          color: #d0d6e0;
        }

        .form-group input {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 12px 14px;
          font-size: 16px;
          color: #f7f8f8;
          transition: all 0.15s ease;
        }

        .form-group input::placeholder {
          color: #62666d;
        }

        .form-group input:focus {
          outline: none;
          border-color: #5e6ad2;
          box-shadow: 0 0 0 3px rgba(94, 106, 210, 0.2);
        }

        .btn-primary {
          background: #5e6ad2;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 20px;
          font-size: 15px;
          font-weight: 510;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #828fff;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 12px 14px;
          border-radius: 6px;
          font-size: 14px;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .login-footer p {
          font-size: 14px;
          color: #8a8f98;
        }

        .login-footer a {
          color: #7170ff;
          text-decoration: none;
          font-weight: 510;
        }

        .login-footer a:hover {
          color: #828fff;
        }
      `}</style>
    </div>
  );
}
