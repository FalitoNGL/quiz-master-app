// src/components/QuestionCard.jsx

import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { AuroraCard } from './ui/AuroraCard';
import { Button } from './ui/Button';
import { FiCheckCircle, FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const QuestionHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const QuestionText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
`;

const OptionsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  text-align: left;
  border: 2px solid;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: ${({ theme }) => theme.text};
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  border-color: ${({ state, theme }) => {
    if (state === 'correct') return '#22c55e';
    if (state === 'incorrect') return '#ef4444';
    if (state === 'selected') return theme.accent;
    return 'rgba(255, 255, 255, 0.2)';
  }};

  box-shadow: ${({ state }) => (state === 'correct' ? `0 0 15px #22c55e` : 'none')};

  &:hover {
    border-color: ${({ theme, disabled }) => !disabled && theme.accent};
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: ${({ state }) => (state === 'correct' || state === 'incorrect' ? 1 : 0.7)};
  }
`;

const OptionLabel = styled.span`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.3s;
`;

const OptionFeedbackIcon = styled(motion.div)`
  margin-left: auto;
  font-size: 1.5rem;
`;

const ExplanationBox = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 4px solid ${({ theme }) => theme.accent};
  p { margin: 0; }
  p.explanation { font-size: 1rem; line-height: 1.6; }
  p.reference { font-size: 0.8rem; font-style: italic; opacity: 0.7; margin-top: 0.75rem; }
`;

const FocusButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  opacity: 0.7;
  transition: all 0.2s;
  &:hover { 
    opacity: 1;
    color: ${({ theme }) => theme.accent};
  }
`;

const QuestionCard = ({ 
  questionData, 
  onSelectOption, 
  selectedOption, 
  isAnswered,
  onNext, 
  gameMode, 
  isFocusMode, 
  toggleFocusMode, 
  timer, 
  progressBar 
}) => {
    // Pengaman untuk mencegah error jika data soal belum siap
    if (!questionData) {
      return null; 
    }

    const handleOptionClick = (index) => {
        if (!isAnswered) {
          onSelectOption(index);
        }
    };

    const getOptionState = (index) => {
        if (!isAnswered) {
            return selectedOption === index ? 'selected' : 'default';
        }
        if (index === questionData.correct) {
            return 'correct';
        }
        if (selectedOption === index) {
            return 'incorrect';
        }
        return 'default';
    };

    const optionsContainerVariants = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } }
    };

    const optionItemVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
      incorrect: { x: [-3, 3, -3, 3, 0], transition: { duration: 0.4 } }
    };

    const showActionButton = gameMode === 'klasik';

    return (
        <AuroraCard>
            <FocusButton onClick={toggleFocusMode}>
                {isFocusMode ? <FiEyeOff /> : <FiEye />}
            </FocusButton>
            
            <motion.div animate={{opacity: isFocusMode ? 0 : 1, y: isFocusMode ? -20 : 0, height: isFocusMode ? 0 : 'auto', transition: {duration: 0.3}}}>
                {timer}
                <div style={{height: '1.5rem'}}/>
                {progressBar}
            </motion.div>

            <QuestionHeader>
              <QuestionText>{questionData.question}</QuestionText>
            </QuestionHeader>

            <OptionsContainer variants={optionsContainerVariants} initial="hidden" animate="visible">
                {questionData.options.map((option, index) => {
                  const state = getOptionState(index);
                  return (
                    <OptionButton 
                      key={`${questionData.question}-${index}`} 
                      onClick={() => handleOptionClick(index)} 
                      state={state} 
                      disabled={isAnswered} 
                      variants={optionItemVariants} 
                      animate={state === 'incorrect' ? 'incorrect' : 'visible'} 
                      whileHover={{ scale: isAnswered ? 1 : 1.02 }} 
                      whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    >
                        <OptionLabel>{String.fromCharCode(65 + index)}</OptionLabel>
                        <span>{option}</span>
                        {isAnswered && (
                            <OptionFeedbackIcon>
                                {state === 'correct' && <FiCheckCircle style={{ color: '#22c55e' }} />}
                                {state === 'incorrect' && <FiXCircle style={{ color: '#ef4444' }} />}
                            </OptionFeedbackIcon>
                        )}
                    </OptionButton>
                  )
                })}
            </OptionsContainer>

            <AnimatePresence>
                {isAnswered && (
                    <ExplanationBox initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0}} transition={{delay: 0.2}}>
                        <p className="explanation">{questionData.explanation}</p>
                        <p className="reference">{questionData.reference}</p>
                    </ExplanationBox>
                )}
            </AnimatePresence>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                {showActionButton && isAnswered && (
                    <Button onClick={onNext} initial={{opacity: 0}} animate={{opacity: 1}}>Selanjutnya</Button>
                )}
            </div>
        </AuroraCard>
    );
};

export default QuestionCard;