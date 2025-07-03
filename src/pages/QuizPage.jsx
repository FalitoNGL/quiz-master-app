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
  /* z-index tidak lagi diatur di sini, tapi pada elemen yang relevan */
  width: 100%;
  max-width: 48rem;
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

  const sessionAnswersRef = useRef(sessionAnswers);
  useEffect(() => { sessionAnswersRef.current = sessionAnswers; }, [sessionAnswers]);

  const finishQuiz = useCallback(() => {
    if (isFinishedRef.current) return;
    setIsTimerRunning(false);

    const finalAnswers = sessionAnswersRef.current;
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

  const advanceToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prevIndex => {
      const isLastQuestion = prevIndex >= questions.length - 1;
      if (isLastQuestion) {
        finishQuiz();
        return prevIndex;
      }
      return prevIndex + 1;
    });
  }, [questions.length, finishQuiz]);

  useEffect(() => {
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
  }, [config, wrongAnswers, onQuizEnd]);

  const handleSelectOption = (optionIndex) => {
    if (sessionAnswers[currentQuestionIndex] !== undefined) return;

    const question = questions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correct;
    if (navigator.vibrate) navigator.vibrate(50);
    new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3').play();
    
    const isFirstQuestion = currentQuestionIndex === 0;
    if (config.categoryId !== 'wrong_answers') updateStats(isCorrect, isFirstQuestion);
    if (!isCorrect && config.categoryId !== 'wrong_answers') addWrongAnswer(config.categoryId, question);
    
    setSessionAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers, [currentQuestionIndex]: optionIndex };
      if (config.mode === 'time_attack') {
        setTimeout(() => {
          advanceToNextQuestion();
        }, 1200);
      }
      return newAnswers;
    });
  };

  if (questions.length === 0) return null;
  
  if (isFinished) {
    return <Results
      score={finalScore}
      totalQuestions={questions.length}
      onRestart={onQuizEnd}
      highScore={highScores[`${config.categoryId}-${config.mode}`] || 0}
      gameMode={config.mode}
      isPracticeMode={config.categoryId === 'wrong_answers'}
    />;
  }
  
  const isCurrentQuestionAnswered = sessionAnswers[currentQuestionIndex] !== undefined;

  return (
    // ================== PERBAIKAN UTAMA DI SINI ==================
    // QuizWrapper sekarang menjadi elemen terluar, bukan Fragment <>
    <QuizWrapper layoutId={`quiz-card-${config.categoryId}`}>
      <AnimatePresence>
        {isFocusMode && <FocusOverlay onClick={() => setIsFocusMode(false)} />}
      </AnimatePresence>
      
      {/* Seluruh isi kuis sekarang ada di dalam QuestionCard */}
      {/* zIndex diatur di sini untuk mengangkat kartu di atas overlay */}
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
            timer={<Timer isRunning={isTimerRunning} mode={config.mode} duration={120} onTimeUp={finishQuiz} config={config} />}
            progressBar={<ProgressBar current={currentQuestionIndex + 1} total={questions.length} />}
        />
      </div>
    </QuizWrapper>
  );
};

export default QuizPage;