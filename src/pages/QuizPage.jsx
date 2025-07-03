// src/pages/QuizPage.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getShuffledQuestions } from '../data/quizData';
import { useUserProgress } from '../context/UserProgressContext';
import { achievementsList } from '../data/achievements';

import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import Results from '../components/Results';
import Timer from '../components/Timer';
import { FocusOverlay } from '../components/ui/FocusOverlay';

const QuizWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 48rem;
  /* ================== PERBAIKAN LAYOUT DI SINI ================== */
  margin: 0 auto; /* Tambahkan ini agar kartu kembali ke tengah */
`;

const QuizPage = ({ config, onQuizEnd }) => {
  const { updateStats, setHighScores, highScores, unlockAchievement, addWrongAnswer, wrongAnswers } = useUserProgress();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const isFinishedRef = useRef(isFinished);
  useEffect(() => { isFinishedRef.current = isFinished; }, [isFinished]);

  // ================== LOGIKA INTI DITULIS ULANG TOTAL ==================

  const finishQuiz = useCallback((finalAnswers) => {
    if (isFinishedRef.current) return;
    setIsTimerRunning(false);

    let calculatedScore = 0;
    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) calculatedScore += 10;
    });
    setFinalScore(calculatedScore);
    
    if (config.categoryId !== 'wrong_answers') {
        const scoreKey = `${config.categoryId}-${config.mode}`;
        const currentHighScore = highScores[scoreKey] || 0;
        if (calculatedScore > currentHighScore) setHighScores(prev => ({ ...prev, [scoreKey]: calculatedScore }));
        unlockAchievement('FIRST_QUIZ');
        if (calculatedScore > 0 && calculatedScore / 10 === questions.length) unlockAchievement('PERFECT_SCORE');
        if (config.mode === 'time_attack' && calculatedScore > 0) unlockAchievement('TIME_ATTACK_WIN');
        if (config.categoryId === 'keamanan-informasi' && calculatedScore >= 80) unlockAchievement('MASTER_SECURITY');
        if (config.categoryId === 'javascript-dasar' && calculatedScore >= 80) unlockAchievement('JS_WIZARD');
    }
    setIsFinished(true);
  }, [questions, config, highScores, setHighScores, unlockAchievement]);


  useEffect(() => {
    // Setup kuis hanya berjalan saat config berubah
    let quizQuestions = [];
    if (config.categoryId === 'wrong_answers') {
      quizQuestions = wrongAnswers ? Object.values(wrongAnswers).flat() : [];
    } else {
      quizQuestions = getShuffledQuestions(config.categoryId);
    }
    if (quizQuestions.length === 0) {
      if (config.categoryId === 'wrong_answers') alert("Selamat! Anda tidak memiliki jawaban salah untuk dilatih.");
      else alert("Tidak ada soal untuk kategori ini!");
      onQuizEnd();
      return;
    }
    setQuestions(quizQuestions);
    setSessionAnswers({});
    setCurrentQuestionIndex(0);
    setFinalScore(0);
    setIsFinished(false);
    setIsTimerRunning(true);
  }, [config, onQuizEnd]); // Hapus wrongAnswers agar tidak reset di tengah jalan

  const advanceToNextQuestion = () => {
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;
    if (isLastQuestion) {
      // Gunakan functional update untuk memastikan kita punya state jawaban terakhir
      setSessionAnswers(latestAnswers => {
        finishQuiz(latestAnswers);
        return latestAnswers;
      });
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleSelectOption = (optionIndex) => {
    if (sessionAnswers[currentQuestionIndex] !== undefined) return;

    const question = questions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correct;
    if (navigator.vibrate) navigator.vibrate(50);
    new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3').play();
    
    const isFirstQuestion = currentQuestionIndex === 0;
    if (config.categoryId !== 'wrong_answers') updateStats(isCorrect, isFirstQuestion);
    if (!isCorrect && config.categoryId !== 'wrong_answers') addWrongAnswer(config.categoryId, question);
    
    // Langsung update state, ini akan memicu re-render untuk feedback
    setSessionAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestionIndex]: optionIndex
    }));
  };
  
  // useEffect ini sekarang HANYA mengawasi jawaban & mode time attack
  useEffect(() => {
    const isCurrentQuestionAnswered = sessionAnswers[currentQuestionIndex] !== undefined;

    if (isCurrentQuestionAnswered && config.mode === 'time_attack') {
      const timer = setTimeout(() => {
        advanceToNextQuestion();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [sessionAnswers, advanceToNextQuestion, config.mode, currentQuestionIndex]);


  if (questions.length === 0) return null;
  
  if (isFinished) {
    return <Results score={finalScore} totalQuestions={questions.length} onRestart={onQuizEnd} highScore={highScores[`${config.categoryId}-${config.mode}`] || 0} gameMode={config.mode} isPracticeMode={config.categoryId === 'wrong_answers'} />;
  }
  
  const isCurrentQuestionAnswered = sessionAnswers[currentQuestionIndex] !== undefined;

  return (
    <QuizWrapper layoutId={`quiz-card-${config.categoryId}`}>
      <AnimatePresence>
        {isFocusMode && <FocusOverlay onClick={() => setIsFocusMode(false)} />}
      </AnimatePresence>
      <div style={{ position: 'relative', zIndex: isFocusMode ? 50 : 1 }}>
        <QuestionCard
            key={currentQuestionIndex}
            questionData={questions[currentQuestionIndex]}
            onSelectOption={handleSelectOption}
            selectedOption={sessionAnswers[currentQuestionIndex]}
            isAnswered={isCurrentQuestionAnswered}
            onNext={advanceToNextQuestion}
            gameMode={config.mode}
            isFocusMode={isFocusMode}
            toggleFocusMode={() => setIsFocusMode(p => !p)}
            timer={<Timer isRunning={isTimerRunning} mode={config.mode} duration={120} onTimeUp={() => finishQuiz(sessionAnswers)} config={config} />}
            progressBar={<ProgressBar current={currentQuestionIndex + 1} total={questions.length} />}
        />
      </div>
    </QuizWrapper>
  );
};

export default QuizPage;