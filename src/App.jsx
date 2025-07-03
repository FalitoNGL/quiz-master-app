// src/App.jsx

import { useState, useCallback } from 'react'; // Import useCallback
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { UserProgressProvider, useUserProgress } from './context/UserProgressContext';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

import MenuPage from './pages/MenuPage';
import QuizPage from './pages/QuizPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import ParticleBackground from './components/ui/ParticleBackground';

export const themes = {
  ocean: {
    name: 'Samudra',
    light: { bg: '#f0f9ff', cardBg: 'rgba(255, 255, 255, 0.7)', text: '#082f49', textSecondary: '#475569', accent: '#0ea5e9', buttonText: '#ffffff', glow: 'rgba(14, 165, 233, 0.3)', borderRadius: '24px', },
    dark: { bg: '#0a192f', cardBg: 'rgba(17, 34, 64, 0.75)', text: '#ccd6f6', textSecondary: '#8892b0', accent: '#64ffda', buttonText: '#0a192f', glow: 'rgba(100, 255, 218, 0.3)', borderRadius: '24px', }
  },
  sunset: {
    name: 'Matahari Terbenam',
    light: { bg: '#fff7ed', cardBg: 'rgba(255, 255, 255, 0.7)', text: '#431407', textSecondary: '#7c2d12', accent: '#f97316', buttonText: '#ffffff', glow: 'rgba(249, 115, 22, 0.3)', borderRadius: '24px', },
    dark: { bg: '#231a43', cardBg: 'rgba(49, 38, 89, 0.75)', text: '#e0cde7', textSecondary: '#9e8fb0', accent: '#ff8a71', buttonText: '#ffffff', glow: 'rgba(255, 138, 113, 0.3)', borderRadius: '24px', }
  }
};

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${({ theme }) => {
      if (theme.fontSize === 'large') return '18px';
      if (theme.fontSize === 'small') return '14px';
      return '16px';
    }};
  }
  body {
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.4s ease, color 0.4s ease;
  }
  * { box-sizing: border-box; }
`;

const ThemedApp = () => {
  const { settings } = useUserProgress();
  const themeFamily = themes[settings.themeFamily] || themes.ocean;
  const activeThemeMode = themeFamily[settings.themeMode] || themeFamily.dark;
  const finalTheme = { 
    ...activeThemeMode, 
    fontSize: settings.fontSize,
    accent: settings.accentColor || activeThemeMode.accent
  };

  return (
    <ThemeProvider theme={finalTheme}>
      <GlobalStyle />
      <ParticleBackground />
      <AppRouter />
    </ThemeProvider>
  );
}

const AppRouter = () => {
  const [currentPage, setCurrentPage] = useState('menu');
  const [quizConfig, setQuizConfig] = useState(null);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleStartQuiz = useCallback((categoryId, mode) => {
    setQuizConfig({ categoryId, mode });
    setCurrentPage('quiz');
  }, []);

  const handleQuizEnd = useCallback(() => {
    setCurrentPage('menu');
  }, []);
  
  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 1.02 },
  };

  let pageComponent;
  switch (currentPage) {
    case 'quiz':
      pageComponent = <QuizPage key="quiz" config={quizConfig} onQuizEnd={handleQuizEnd} />;
      break;
    case 'stats':
      pageComponent = <StatsPage key="stats" onBack={handleQuizEnd} />;
      break;
    case 'achievements':
      pageComponent = <AchievementsPage key="achievements" onBack={handleQuizEnd} />;
      break;
    case 'settings':
      pageComponent = <SettingsPage key="settings" onBack={handleQuizEnd} />;
      break;
    case 'menu':
    default:
      pageComponent = <MenuPage key="menu" onNavigate={handleNavigate} onStartQuiz={handleStartQuiz} />;
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {pageComponent}
      </AnimatePresence>
    </LayoutGroup>
  );
};

function App() {
  return (
    <UserProgressProvider>
      <ThemedApp />
    </UserProgressProvider>
  );
}

export default App;