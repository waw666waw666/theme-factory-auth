"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// 定义20个主题的色彩配置
export const themes = {
  // 原有10个主题
  "ocean-depths": {
    name: "Ocean Depths",
    primary: "#1a2332",
    secondary: "#2d8b8b",
    accent: "#a8dadc",
    background: "#f1faee",
    textPrimary: "#1a2332",
    textSecondary: "#5a6a7a",
    textLight: "#f1faee",
  },
  "sunset-boulevard": {
    name: "Sunset Boulevard",
    primary: "#e76f51",
    secondary: "#f4a261",
    accent: "#e9c46a",
    background: "#264653",
    textPrimary: "#264653",
    textSecondary: "#5a6a7a",
    textLight: "#ffffff",
  },
  "forest-canopy": {
    name: "Forest Canopy",
    primary: "#2d4a2b",
    secondary: "#7d8471",
    accent: "#a4ac86",
    background: "#faf9f6",
    textPrimary: "#2d4a2b",
    textSecondary: "#5a6a7a",
    textLight: "#faf9f6",
  },
  "modern-minimalist": {
    name: "Modern Minimalist",
    primary: "#36454f",
    secondary: "#708090",
    accent: "#d3d3d3",
    background: "#ffffff",
    textPrimary: "#36454f",
    textSecondary: "#708090",
    textLight: "#ffffff",
  },
  "golden-hour": {
    name: "Golden Hour",
    primary: "#f4a900",
    secondary: "#c1666b",
    accent: "#d4b896",
    background: "#4a403a",
    textPrimary: "#4a403a",
    textSecondary: "#7a6a5a",
    textLight: "#ffffff",
  },
  "arctic-frost": {
    name: "Arctic Frost",
    primary: "#4a6fa5",
    secondary: "#d4e4f7",
    accent: "#c0c0c0",
    background: "#fafafa",
    textPrimary: "#4a6fa5",
    textSecondary: "#6a8ab5",
    textLight: "#fafafa",
  },
  "desert-rose": {
    name: "Desert Rose",
    primary: "#5d2e46",
    secondary: "#d4a5a5",
    accent: "#b87d6d",
    background: "#e8d5c4",
    textPrimary: "#5d2e46",
    textSecondary: "#8a5a6a",
    textLight: "#ffffff",
  },
  "tech-innovation": {
    name: "Tech Innovation",
    primary: "#0066ff",
    secondary: "#00ffff",
    accent: "#1e1e1e",
    background: "#ffffff",
    textPrimary: "#1e1e1e",
    textSecondary: "#5a5a5a",
    textLight: "#ffffff",
  },
  "botanical-garden": {
    name: "Botanical Garden",
    primary: "#4a7c59",
    secondary: "#f9a620",
    accent: "#b7472a",
    background: "#f5f3ed",
    textPrimary: "#4a7c59",
    textSecondary: "#6a9c79",
    textLight: "#ffffff",
  },
  "midnight-galaxy": {
    name: "Midnight Galaxy",
    primary: "#2b1e3e",
    secondary: "#4a4e8f",
    accent: "#a490c2",
    background: "#e6e6fa",
    textPrimary: "#2b1e3e",
    textSecondary: "#5a4e6e",
    textLight: "#e6e6fa",
  },
  // 新增10个主题 - 2024最受欢迎风格 + 人民币配色
  "rmb-blessing": {
    name: "人民币红",
    primary: "#c41e3a",
    secondary: "#8b0000",
    accent: "#ffd700",
    background: "#fff8dc",
    textPrimary: "#8b0000",
    textSecondary: "#a0522d",
    textLight: "#fff8dc",
  },
  "neumorphism-soft": {
    name: "新拟态柔光",
    primary: "#e0e5ec",
    secondary: "#a3b1c6",
    accent: "#4d5b7c",
    background: "#f0f3f8",
    textPrimary: "#4d5b7c",
    textSecondary: "#7a8ba3",
    textLight: "#ffffff",
  },
  "glassmorphism": {
    name: "玻璃拟态",
    primary: "rgba(255,255,255,0.2)",
    secondary: "rgba(255,255,255,0.1)",
    accent: "#ff6b9d",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.8)",
    textLight: "#ffffff",
  },
  "cyberpunk-neon": {
    name: "赛博朋克霓虹",
    primary: "#0a0a0a",
    secondary: "#ff00ff",
    accent: "#00ffff",
    background: "#1a0a1a",
    textPrimary: "#00ffff",
    textSecondary: "#ff00ff",
    textLight: "#ffffff",
  },
  "claymorphism": {
    name: "粘土拟态",
    primary: "#ff8c69",
    secondary: "#ffb347",
    accent: "#ff6b6b",
    background: "#fff5ee",
    textPrimary: "#5a4a3a",
    textSecondary: "#8b7355",
    textLight: "#ffffff",
  },
  "bento-grid": {
    name: "便当盒风格",
    primary: "#2c3e50",
    secondary: "#3498db",
    accent: "#e74c3c",
    background: "#ecf0f1",
    textPrimary: "#2c3e50",
    textSecondary: "#7f8c8d",
    textLight: "#ffffff",
  },
  "monochrome-elegant": {
    name: "单色优雅",
    primary: "#1a1a1a",
    secondary: "#4a4a4a",
    accent: "#9a9a9a",
    background: "#fafafa",
    textPrimary: "#1a1a1a",
    textSecondary: "#6a6a6a",
    textLight: "#ffffff",
  },
  "aurora-borealis": {
    name: "极光幻彩",
    primary: "#2d1b69",
    secondary: "#00d9ff",
    accent: "#39ff14",
    background: "#0a0a1a",
    textPrimary: "#00d9ff",
    textSecondary: "#39ff14",
    textLight: "#ffffff",
  },
  "warm-terracotta": {
    name: "温暖陶土",
    primary: "#c65d3b",
    secondary: "#e07b53",
    accent: "#f4a261",
    background: "#faf0e6",
    textPrimary: "#8b4513",
    textSecondary: "#a0522d",
    textLight: "#ffffff",
  },
  "dark-academia": {
    name: "暗黑学院",
    primary: "#3d2914",
    secondary: "#8b6914",
    accent: "#d4af37",
    background: "#1a1410",
    textPrimary: "#d4af37",
    textSecondary: "#8b6914",
    textLight: "#f5f5dc",
  },
};

export type ThemeKey = keyof typeof themes;

interface ThemeContextType {
  currentTheme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  themeColors: typeof themes["ocean-depths"];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("ocean-depths");
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 加载主题
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as ThemeKey;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // 应用主题到 CSS 变量
  useEffect(() => {
    if (!mounted) return;

    const theme = themes[currentTheme];
    const root = document.documentElement;

    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--text-primary", theme.textPrimary);
    root.style.setProperty("--text-secondary", theme.textSecondary);
    root.style.setProperty("--text-light", theme.textLight);

    // 保存到 localStorage
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme, mounted]);

  const setTheme = (theme: ThemeKey) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeColors: themes[currentTheme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
