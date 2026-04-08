import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Theme Factory - 专业主题设计工具",
  description: "精心设计的专业主题系统，一键切换网站主题",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          /* Critical CSS to prevent FOUC */
          .login-page {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #08090a;
            color: #f7f8f8;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-page .login-container {
            width: 100%;
            max-width: 400px;
            padding: 20px;
          }
          .login-page .login-card {
            background: #0f1011;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 40px;
          }
          .login-page .login-header {
            text-align: center;
            margin-bottom: 32px;
          }
          .login-page .login-header h1 {
            font-size: 24px;
            font-weight: 590;
            margin-bottom: 8px;
          }
          .login-page .login-header p {
            font-size: 15px;
            color: #8a8f98;
          }
          .login-page .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .login-page .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .login-page .form-group label {
            font-size: 14px;
            font-weight: 510;
            color: #d0d6e0;
          }
          .login-page .form-group input {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            padding: 12px 14px;
            font-size: 16px;
            color: #f7f8f8;
          }
          .login-page .btn-primary {
            background: #5e6ad2;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px 20px;
            font-size: 15px;
            font-weight: 510;
            cursor: pointer;
          }
          .login-page .login-footer {
            margin-top: 24px;
            text-align: center;
          }
          .login-page .login-footer a {
            color: #7170ff;
            text-decoration: none;
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
