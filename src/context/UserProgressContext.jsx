import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { achievementsList } from '../data/achievements';

const UserProgressContext = createContext();

export const useUserProgress = () => useContext(UserProgressContext);

export const UserProgressProvider = ({ children }) => {
  const [userName, setUserName] = useLocalStorage('userName', '');
  const [stats, setStats] = useLocalStorage('stats', { quizzesPlayed: 0, totalCorrect: 0, totalIncorrect: 0 });
  const [highScores, setHighScores] = useLocalStorage('highScores', {});
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('unlockedAchievements', {});
  const [wrongAnswers, setWrongAnswers] = useLocalStorage('wrongAnswers', {});
  
  const [settings, setSettings] = useLocalStorage('settings', { 
    themeFamily: 'ocean',
    themeMode: 'dark',
    accentColor: null,
    fontSize: 'medium',
  });

  const updateStats = (isCorrect, isFirstQuestion) => {
    setStats(prev => ({
      ...prev,
      quizzesPlayed: isFirstQuestion ? prev.quizzesPlayed + 1 : prev.quizzesPlayed,
      totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
      totalIncorrect: !isCorrect ? prev.totalIncorrect + 1 : prev.totalIncorrect,
    }));
  };

  const unlockAchievement = (achievementId) => {
    if (achievementsList[achievementId] && !unlockedAchievements[achievementId]) {
      setUnlockedAchievements(prev => ({ ...prev, [achievementId]: true }));
      console.log(`Pencapaian Terbuka: ${achievementsList[achievementId].name}`);
    }
  };

  const addWrongAnswer = (categoryId, question) => {
    setWrongAnswers(prev => {
      const categoryWrongs = prev[categoryId] || [];
      if (!categoryWrongs.some(q => q.question === question.question)) {
        return { ...prev, [categoryId]: [...categoryWrongs, question] };
      }
      return prev;
    });
  };

  const value = {
    userName, setUserName,
    stats, updateStats,
    highScores, setHighScores,
    unlockedAchievements, unlockAchievement,
    wrongAnswers, addWrongAnswer,
    settings, setSettings,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};