"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme, themes, ThemeKey } from "../components/ThemeProvider";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentTheme, setTheme, themeColors } = useTheme();
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleApplyTheme = (themeKey: ThemeKey) => {
    setTheme(themeKey);
  };

  const handleCopyPrompt = (theme: { key: string; name: string; desc: string; colors: string[]; tags: string[] }) => {
    const prompt = `主题名称：${theme.name}
主题描述：${theme.desc}
配色方案：
- 主色：${theme.colors[0]}
- 次要色：${theme.colors[1]}
- 强调色：${theme.colors[2]}
- 背景色：${theme.colors[3]}
适用场景：${theme.tags.join('、')}

CSS变量配置：
:root {
  --primary: ${theme.colors[0]};
  --secondary: ${theme.colors[1]};
  --accent: ${theme.colors[2]};
  --background: ${theme.colors[3]};
}`;

    navigator.clipboard.writeText(prompt).then(() => {
      setToast({ show: true, message: `已复制「${theme.name}」的主题提示词！`, type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }).catch(() => {
      setToast({ show: true, message: '复制失败，请手动复制', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="20" fill="var(--primary)"/>
            <path d="M30 70V30L50 50L70 30V70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Theme Factory</span>
        </div>
        <div className="nav-actions">
          <div className="current-theme-indicator">
            <span className="theme-dot" style={{background: themes[currentTheme].primary}}></span>
            <span className="theme-name">{themes[currentTheme].name || currentTheme}</span>
          </div>
          <button
            className="btn-logout"
            onClick={handleLogout}
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)'
            }}
          >
            退出登录
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>20款精心设计的专业主题</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">打造令人惊艳的</span>
            <span className="title-line highlight">视觉体验</span>
          </h1>
          <p className="hero-description">
            Theme Factory 提供10款精心设计的专业主题，每一款都包含完整的色彩系统、字体搭配和应用场景指南。
            无论是企业演示、创意提案还是技术展示，都能找到完美的视觉方案。
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">20</span>
              <span className="stat-label">专业主题</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">80+</span>
              <span className="stat-label">配色方案</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">创意可能</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="theme-cards-preview">
            <div className="preview-card card-1" data-theme="ocean-depths">
              <div className="card-color-strip" style={{background: "linear-gradient(90deg, #1a2332, #2d8b8b, #a8dadc, #f1faee)"}}></div>
              <span className="card-name">Ocean Depths</span>
            </div>
            <div className="preview-card card-2" data-theme="sunset-boulevard">
              <div className="card-color-strip" style={{background: "linear-gradient(90deg, #e76f51, #f4a261, #e9c46a, #264653)"}}></div>
              <span className="card-name">Sunset Boulevard</span>
            </div>
            <div className="preview-card card-3" data-theme="tech-innovation">
              <div className="card-color-strip" style={{background: "linear-gradient(90deg, #0066ff, #00ffff, #1e1e1e, #ffffff)"}}></div>
              <span className="card-name">Tech Innovation</span>
            </div>
            <div className="preview-card card-4" data-theme="midnight-galaxy">
              <div className="card-color-strip" style={{background: "linear-gradient(90deg, #2b1e3e, #4a4e8f, #a490c2, #e6e6fa)"}}></div>
              <span className="card-name">Midnight Galaxy</span>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="showcase">
        <div className="section-header">
          <span className="section-tag">主题库</span>
          <h2 className="section-title">精选主题展示</h2>
          <p className="section-desc">每一款主题都经过精心设计，包含完整的色彩系统和字体搭配</p>
        </div>

        <div className="themes-grid">
          {[
            // 原有10个主题
            { key: "ocean-depths", name: "Ocean Depths", desc: "专业沉稳的海洋主题，适合企业演示和财务报告", colors: ["#1a2332", "#2d8b8b", "#a8dadc", "#f1faee"], tags: ["企业", "金融", "咨询"] },
            { key: "sunset-boulevard", name: "Sunset Boulevard", desc: "温暖活力的日落主题，适合创意提案和营销活动", colors: ["#e76f51", "#f4a261", "#e9c46a", "#264653"], tags: ["创意", "营销", "活动"] },
            { key: "forest-canopy", name: "Forest Canopy", desc: "自然清新的森林主题，适合环保和可持续发展内容", colors: ["#2d4a2b", "#7d8471", "#a4ac86", "#faf9f6"], tags: ["环保", "可持续", "健康"] },
            { key: "modern-minimalist", name: "Modern Minimalist", desc: "简洁现代的极简主题，适合技术展示和设计作品", colors: ["#36454f", "#708090", "#d3d3d3", "#ffffff"], tags: ["极简", "技术", "设计"] },
            { key: "golden-hour", name: "Golden Hour", desc: "温暖丰富的秋日主题，适合餐饮和生活方式品牌", colors: ["#f4a900", "#c1666b", "#d4b896", "#4a403a"], tags: ["餐饮", "生活方式", "秋季"] },
            { key: "arctic-frost", name: "Arctic Frost", desc: "清爽专业的冰雪主题，适合医疗和科技解决方案", colors: ["#d4e4f7", "#4a6fa5", "#c0c0c0", "#fafafa"], tags: ["医疗", "科技", "专业"] },
            { key: "desert-rose", name: "Desert Rose", desc: "优雅柔和的玫瑰主题，适合时尚和美妆品牌", colors: ["#d4a5a5", "#b87d6d", "#e8d5c4", "#5d2e46"], tags: ["时尚", "美妆", "优雅"] },
            { key: "tech-innovation", name: "Tech Innovation", desc: "大胆现代的科技主题，适合创新展示和AI/ML演示", colors: ["#0066ff", "#00ffff", "#1e1e1e", "#ffffff"], tags: ["科技", "AI/ML", "创新"] },
            { key: "botanical-garden", name: "Botanical Garden", desc: "清新有机的花园主题，适合食品和自然产品", colors: ["#4a7c59", "#f9a620", "#b7472a", "#f5f3ed"], tags: ["食品", "自然", "有机"] },
            { key: "midnight-galaxy", name: "Midnight Galaxy", desc: "神秘深邃的银河主题，适合娱乐和创意机构", colors: ["#2b1e3e", "#4a4e8f", "#a490c2", "#e6e6fa"], tags: ["娱乐", "游戏", "创意"] },
            // 新增10个主题 - 2024最受欢迎风格 + 人民币配色
            { key: "rmb-blessing", name: "人民币红", desc: "喜庆吉祥的人民币配色，适合春节活动和庆典设计", colors: ["#c41e3a", "#8b0000", "#ffd700", "#fff8dc"], tags: ["春节", "庆典", "中国风"] },
            { key: "neumorphism-soft", name: "新拟态柔光", desc: "2024流行的柔和阴影风格，适合现代UI和移动应用", colors: ["#e0e5ec", "#a3b1c6", "#4d5b7c", "#f0f3f8"], tags: ["UI设计", "移动端", "现代"] },
            { key: "glassmorphism", name: "玻璃拟态", desc: "透明毛玻璃效果，2024年最热门的视觉风格", colors: ["#667eea", "#764ba2", "#ff6b9d", "#f0f0f0"], tags: ["玻璃效果", "渐变", "热门"] },
            { key: "cyberpunk-neon", name: "赛博朋克霓虹", desc: "霓虹灯效果的科幻风格，适合游戏和科技展示", colors: ["#0a0a0a", "#ff00ff", "#00ffff", "#1a0a1a"], tags: ["科幻", "游戏", "霓虹"] },
            { key: "claymorphism", name: "粘土拟态", desc: "圆润可爱的3D粘土风格，适合儿童产品和创意应用", colors: ["#ff8c69", "#ffb347", "#ff6b6b", "#fff5ee"], tags: ["3D", "可爱", "创意"] },
            { key: "bento-grid", name: "便当盒风格", desc: "模块化网格布局，2024年最流行的界面组织方式", colors: ["#2c3e50", "#3498db", "#e74c3c", "#ecf0f1"], tags: ["网格", "模块化", "流行"] },
            { key: "monochrome-elegant", name: "单色优雅", desc: "高级灰度配色，适合奢侈品和高端品牌", colors: ["#1a1a1a", "#4a4a4a", "#9a9a9a", "#fafafa"], tags: ["高端", "奢侈", "简约"] },
            { key: "aurora-borealis", name: "极光幻彩", desc: "神秘梦幻的极光色彩，适合艺术类和个人作品集", colors: ["#2d1b69", "#00d9ff", "#39ff14", "#0a0a1a"], tags: ["艺术", "梦幻", "个性"] },
            { key: "warm-terracotta", name: "温暖陶土", desc: "自然温暖的陶土色调，适合家居和生活方式品牌", colors: ["#c65d3b", "#e07b53", "#f4a261", "#faf0e6"], tags: ["家居", "自然", "温暖"] },
            { key: "dark-academia", name: "暗黑学院", desc: "复古学院风格，适合教育和文化类网站", colors: ["#3d2914", "#8b6914", "#d4af37", "#1a1410"], tags: ["复古", "教育", "文化"] },
          ].map((theme, index) => (
            <div key={theme.key} className="theme-card">
              <div className="theme-preview">
                <div className="color-dots">
                  {theme.colors.map((color, i) => (
                    <span key={i} className="dot" style={{background: color}}></span>
                  ))}
                </div>
                <div className="preview-content" style={{background: `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 100%)`}}>
                  <span className="preview-text">{theme.name}</span>
                </div>
              </div>
              <div className="theme-info">
                <h3 className="theme-name">{theme.name}</h3>
                <p className="theme-desc">{theme.desc}</p>
                <div className="theme-tags">
                  {theme.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="btn-group">
                  <button
                    className="btn-apply"
                    onClick={() => handleApplyTheme(theme.key as ThemeKey)}
                    style={{
                      background: currentTheme === theme.key ? 'var(--secondary)' : 'var(--primary)'
                    }}
                  >
                    {currentTheme === theme.key ? '当前主题' : '应用主题'}
                  </button>
                  <button
                    className="btn-copy"
                    onClick={() => handleCopyPrompt(theme)}
                    title="复制主题提示词"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>复制提示词</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Toast 弹窗 */}
      {toast.show && (
        <div 
          className={`toast ${toast.type}`}
          style={{
            background: toast.type === 'success' ? themeColors.primary : '#dc2626',
            color: themeColors.textLight
          }}
        >
          <div className="toast-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {toast.type === 'success' ? (
                <>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </>
              )}
            </svg>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --primary: #1a2332;
          --secondary: #2d8b8b;
          --accent: #a8dadc;
          --background: #f1faee;
          --text-primary: #1a2332;
          --text-secondary: #5a6a7a;
          --text-light: #f1faee;
          --success: #4a7c59;
          --warning: #f9a620;
          --error: #b7472a;
          --info: #4a6fa5;
          --font-header: 'Space Grotesk', sans-serif;
          --font-body: 'Inter', sans-serif;
          --spacing-xs: 0.25rem;
          --spacing-sm: 0.5rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;
          --spacing-2xl: 3rem;
          --spacing-3xl: 4rem;
          --radius-sm: 4px;
          --radius-md: 8px;
          --radius-lg: 12px;
          --radius-xl: 16px;
          --radius-full: 9999px;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          --transition-fast: 150ms ease;
          --transition-base: 250ms ease;
          --transition-slow: 350ms ease;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: var(--font-body);
          background-color: #fafafa;
          color: var(--text-primary);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-xl);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-family: var(--font-header);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .current-theme-indicator {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-xs) var(--spacing-md);
          background: rgba(0,0,0,0.05);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .theme-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .btn-logout {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: transparent;
          border: 1.5px solid var(--primary);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--primary);
        }

        .btn-logout:hover {
          background: var(--primary);
          color: var(--text-light);
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: calc(80px + var(--spacing-3xl)) var(--spacing-xl) var(--spacing-3xl);
          overflow: hidden;
          background: linear-gradient(135deg, #fafafa 0%, #f0f4f8 100%);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: var(--accent);
          top: -200px;
          right: -100px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: var(--secondary);
          bottom: -100px;
          left: -100px;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: var(--primary);
          top: 50%;
          left: 30%;
          opacity: 0.1;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -50px) scale(1.1); }
          50% { transform: translate(0, 50px) scale(0.9); }
          75% { transform: translate(-50px, -25px) scale(1.05); }
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-xs) var(--spacing-md);
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--secondary);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-title {
          font-family: var(--font-header);
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: var(--spacing-lg);
          color: var(--primary);
        }

        .title-line {
          display: block;
        }

        .title-line.highlight {
          background: linear-gradient(135deg, var(--secondary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 500px;
        }

        .hero-stats {
          display: flex;
          gap: var(--spacing-2xl);
          margin-bottom: var(--spacing-xl);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: var(--font-header);
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }

        .theme-cards-preview {
          position: relative;
          width: 400px;
          height: 400px;
        }

        .preview-card {
          position: absolute;
          width: 280px;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          transition: var(--transition-slow);
          cursor: pointer;
        }

        .preview-card:hover {
          transform: translateY(-10px) scale(1.02);
          z-index: 10;
        }

        .card-color-strip {
          height: 80px;
        }

        .card-name {
          display: block;
          padding: var(--spacing-md);
          font-family: var(--font-header);
          font-weight: 600;
          color: var(--primary);
        }

        .card-1 { top: 0; left: 0; transform: rotate(-5deg); z-index: 4; }
        .card-2 { top: 40px; left: 60px; transform: rotate(3deg); z-index: 3; }
        .card-3 { top: 80px; left: 20px; transform: rotate(-2deg); z-index: 2; }
        .card-4 { top: 120px; left: 80px; transform: rotate(5deg); z-index: 1; }

        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-3xl);
        }

        .section-tag {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-md);
          background: rgba(45, 139, 139, 0.1);
          color: var(--secondary);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: var(--radius-full);
          margin-bottom: var(--spacing-md);
        }

        .section-title {
          font-family: var(--font-header);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: var(--spacing-md);
        }

        .section-desc {
          color: var(--text-secondary);
          max-width: 500px;
          margin: 0 auto;
        }

        .showcase {
          padding: var(--spacing-3xl) var(--spacing-xl);
          background: white;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-xl);
          max-width: 1400px;
          margin: 0 auto;
        }

        .theme-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: var(--transition-base);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .theme-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .theme-preview {
          position: relative;
        }

        .color-dots {
          position: absolute;
          top: var(--spacing-md);
          left: var(--spacing-md);
          display: flex;
          gap: var(--spacing-xs);
          z-index: 2;
        }

        .dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .dot:hover {
          transform: scale(1.2);
        }

        .preview-content {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-text {
          font-family: var(--font-header);
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .theme-info {
          padding: var(--spacing-lg);
        }

        .theme-name {
          font-family: var(--font-header);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: var(--spacing-xs);
        }

        .theme-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
        }

        .theme-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .tag {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: rgba(0,0,0,0.05);
          color: var(--text-secondary);
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
        }

        .btn-group {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
        }

        .btn-apply {
          flex: 1;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-base);
          white-space: nowrap;
        }

        .btn-apply:hover {
          background: var(--secondary);
        }

        .btn-copy {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-base);
          white-space: nowrap;
        }

        .btn-copy:hover {
          background: rgba(0,0,0,0.05);
          color: var(--primary);
          border-color: var(--primary);
        }

        .btn-copy svg {
          flex-shrink: 0;
        }

        .toast {
          position: fixed;
          bottom: var(--spacing-xl);
          left: 50%;
          transform: translateX(-50%);
          padding: var(--spacing-md) var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          z-index: 9999;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .toast svg {
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .hero {
            flex-direction: column;
            text-align: center;
            padding-top: calc(100px + var(--spacing-2xl));
          }
          .hero-content { max-width: 100%; }
          .hero-description { max-width: 100%; }
          .hero-stats { justify-content: center; }
          .hero-visual { margin-top: var(--spacing-2xl); }
          .theme-cards-preview { transform: scale(0.8); }
        }

        @media (max-width: 768px) {
          .navbar { padding: var(--spacing-sm) var(--spacing-md); }
          .hero-title { font-size: 2.5rem; }
          .section-title { font-size: 1.75rem; }
          .themes-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
