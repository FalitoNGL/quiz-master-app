// src/pages/MenuPage.jsx

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUserProgress } from '../context/UserProgressContext';
import { quizCategories } from '../data/quizData';
import { FiBarChart2, FiAward, FiSettings, FiBookOpen } from 'react-icons/fi';
import { AuroraCard } from '../components/ui/AuroraCard';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/ui/PageLayout';
import { playSound } from '../utils/audioManager';

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 0.25rem;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const NavButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => `color-mix(in srgb, ${theme.accent} 50%, transparent)`};

  &:hover {
    background: ${({ theme }) => theme.accent};
    border-color: ${({ theme }) => theme.accent};
  }
`;

const CategoryGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const CategoryCardContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const IconWrapper = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.accent};
`;

const CategoryName = styled.h3`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
`;

const CategoryDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
  margin-top: 0.5rem;
  flex-grow: 1;
  min-height: 50px;
`;

const ModeSelector = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const MenuPage = ({ onNavigate, onStartQuiz }) => {
  const { userName, wrongAnswers } = useUserProgress();
  const clickSound = () => { if(navigator.vibrate) navigator.vibrate(50); playSound('click'); };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1 },
  };

  const hasWrongAnswers = wrongAnswers && Object.values(wrongAnswers).some(arr => Array.isArray(arr) && arr.length > 0);

  return (
    <PageContainer>
      <Header>
        <h2>Halo, {userName || 'Pengguna'}!</h2>
        <p>Selamat datang kembali di Quiz Master.</p>
      </Header>
      
      <NavContainer>
        <NavButton onClick={() => { clickSound(); onNavigate('stats'); }}><FiBarChart2/> Statistik</NavButton>
        <NavButton onClick={() => { clickSound(); onNavigate('achievements'); }}><FiAward/> Pencapaian</NavButton>
        <NavButton onClick={() => { clickSound(); onNavigate('settings'); }}><FiSettings/> Pengaturan</NavButton>
      </NavContainer>

      <CategoryGrid variants={containerVariants} initial="hidden" animate="visible">
        {quizCategories.map((category) => {
          const Icon = category.icon;
          return (
            <AuroraCard 
              key={category.id} 
              variants={itemVariants} 
              whileHover={{ y: -5, scale: 1.02 }}
              layoutId={`quiz-card-${category.id}`}
            >
              <CategoryCardContent>
                  <IconWrapper><Icon /></IconWrapper>
                  <CategoryName>{category.name}</CategoryName>
                  <CategoryDescription>{category.description}</CategoryDescription>
                  <ModeSelector>
                    <Button onClick={() => { clickSound(); onStartQuiz(category.id, 'klasik') }}>Klasik</Button>
                    <Button onClick={() => { clickSound(); onStartQuiz(category.id, 'time_attack') }}>Time Attack</Button>
                  </ModeSelector>
              </CategoryCardContent>
            </AuroraCard>
          );
        })}

        {hasWrongAnswers && (
          <AuroraCard variants={itemVariants} whileHover={{y: -5, scale: 1.02}}>
            <CategoryCardContent>
              <IconWrapper style={{color: '#eab308'}}><FiBookOpen/></IconWrapper>
              <CategoryName>Latihan Personal</CategoryName>
              <CategoryDescription>Uji kembali soal-soal yang pernah Anda jawab salah.</CategoryDescription>
              <ModeSelector style={{gridTemplateColumns: '1fr'}}>
                <Button 
                  style={{background: 'linear-gradient(145deg, #eab308, #a16207)'}} 
                  onClick={() => { clickSound(); onStartQuiz('wrong_answers', 'klasik') }}
                >
                  Mulai Latihan
                </Button>
              </ModeSelector>
            </CategoryCardContent>
          </AuroraCard>
        )}
      </CategoryGrid>
    </PageContainer>
  );
};

export default MenuPage;