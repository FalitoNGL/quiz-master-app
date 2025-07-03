import { useState } from 'react';
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
    light: {
      bg: '#f0f9ff', cardBg: 'rgba(255, 255, 255, 0.7)', text: '#082f49',
      textSecondary: '#475569', accent: '#0ea5e9', buttonText: '#ffffff',
      glow: 'rgba(14, 165, 233, 0.3)', borderRadius: '24px',
    },
    dark: {
      bg: '#0a192f', cardBg: 'rgba(17, 34, 64, 0.75)', text: '#ccd6f6',
      textSecondary: '#8892b0', accent: '#64ffda', buttonText: '#0a192f',
      glow: 'rgba(100, 255, 218, 0.3)', borderRadius: '24px',
    }
  },
  sunset: {
    name: 'Matahari Terbenam',
    light: {
      bg: '#fff7ed', cardBg: 'rgba(255, 255, 255, 0.7)', text: '#431407',
      textSecondary: '#7c2d12', accent: '#f97316', buttonText: '#ffffff',
      glow: 'rgba(249, 115, 22, 0.3)', borderRadius: '24px',
    },
    dark: {
      bg: '#231a43', cardBg: 'rgba(49, 38, 89, 0.75)', text: '#e0cde7',
      textSecondary: '#9e8fb0', accent: '#ff8a71', buttonText: '#ffffff',
      glow: 'rgba(255, 138, 113, 0.3)', borderRadius: '24px',
    }
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

  const startQuiz = (categoryId, mode) => {
    setQuizConfig({ categoryId, mode });
    setCurrentPage('quiz');
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 1.02 },
  };

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          {
            {
              'menu': <MenuPage onNavigate={setCurrentPage} onStartQuiz={startQuiz} />,
              'quiz': <QuizPage config={quizConfig} onQuizEnd={() => setCurrentPage('menu')} />,
              'stats': <StatsPage onBack={() => setCurrentPage('menu')} />,
              'achievements': <AchievementsPage onBack={() => setCurrentPage('menu')} />,
              'settings': <SettingsPage onBack={() => setCurrentPage('menu')} />
            }[currentPage]
          }
        </motion.div>
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