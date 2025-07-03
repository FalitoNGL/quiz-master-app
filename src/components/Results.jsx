// src/components/Results.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { AuroraCard } from './ui/AuroraCard';
import { Button } from './ui/Button';

// Styled Components
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
`;

const ScoreDisplay = styled.div`
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

const NewHighScore = styled.p`
  color: ${({ theme }) => theme.accent};
  font-weight: bold;
  animation: pulse 1.5s infinite;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const Results = ({ score, totalQuestions, onRestart, highScore, gameMode }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Menggunakan hook untuk animasi angka
  useAnimatedCounter(score, setAnimatedScore);

  // Efek untuk memainkan suara saat komponen muncul
  useEffect(() => {
    const finishSound = new Audio('/sounds/finish.mp3');
    finishSound.play();
  }, []);

  const isNewHighScore = score > 0 && score >= highScore;

  return (
    <AuroraCard
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <ResultsContent>
        <Title>🎉 Kuis Selesai! 🎉</Title>
        <Message>Mode: {gameMode === 'klasik' ? 'Klasik' : (gameMode === 'time_attack' ? 'Time Attack' : 'Latihan Personal')}</Message>
        
        <ScoreDisplay>{animatedScore}</ScoreDisplay>
        
        <FinalScore>Anda menjawab {score / 10} dari <span>{totalQuestions}</span> soal dengan benar.</FinalScore>
        
        {isNewHighScore ? (
          <NewHighScore>🏆 Rekor Baru! 🏆</NewHighScore>
        ) : (
          <HighScoreText>Skor Tertinggi: {highScore}</HighScoreText>
        )}

        <Button onClick={onRestart}>Kembali ke Menu</Button>
      </ResultsContent>
    </AuroraCard>
  );
};

export default Results;