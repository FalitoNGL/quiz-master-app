// src/components/Results.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { AuroraCard } from './ui/AuroraCard';
import { Button } from './ui/Button';
import { playSound } from '../utils/audioManager';

const ResultsContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2rem;
  text-transform: capitalize;
`;

const ScoreDisplay = styled(motion.div)`
  font-size: 5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.accent};
  margin-bottom: 1rem;
  line-height: 1;
`;

const FinalScore = styled.p`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  span {
    font-weight: bold;
    color: ${({ theme }) => theme.text};
  }
`;

const HighScoreText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2.5rem;
`;

const NewHighScore = styled(motion.p)`
  color: ${({ theme }) => theme.accent};
  font-weight: bold;
  margin-bottom: 2.5rem;
  font-size: 1.2rem;
`;

const Results = ({ score, totalQuestions, onRestart, highScore, gameMode, isPracticeMode }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  useAnimatedCounter(score, setAnimatedScore);

  useEffect(() => {
    playSound('finish');
  }, []);

  const isNewHighScore = !isPracticeMode && score > 0 && score >= highScore;

  return (
    <AuroraCard
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <ResultsContent>
        <Title>🎉 {isPracticeMode ? 'Latihan Selesai!' : 'Kuis Selesai!'} 🎉</Title>
        <Message>Mode: {gameMode.replace('_', ' ')}</Message>
        
        <ScoreDisplay>{animatedScore}</ScoreDisplay>
        
        <FinalScore>Anda menjawab {score / 10} dari <span>{totalQuestions}</span> soal dengan benar.</FinalScore>
        
        {!isPracticeMode && (
          isNewHighScore ? (
            <NewHighScore
              initial={{ scale: 0.5, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              🏆 Rekor Baru! 🏆
            </NewHighScore>
          ) : (
            <HighScoreText>Skor Tertinggi: {highScore}</HighScoreText>
          )
        )}

        <Button onClick={onRestart}>Kembali ke Menu</Button>
      </ResultsContent>
    </AuroraCard>
  );
};

export default Results;