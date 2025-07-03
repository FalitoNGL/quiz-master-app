// src/components/ui/PageLayout.jsx

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from './Button'; // Import Button baru kita

export const PageContainer = styled(motion.div)`
  width: 100%;
  max-width: 56rem; /* Sedikit lebih lebar untuk halaman menu */
  margin: 2rem auto;
  padding: 1rem;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.text};
  }
`;

// Buat BackButton baru berdasarkan Button utama agar konsisten
const StyledBackButton = styled(Button)`
  width: 45px;
  height: 45px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => `color-mix(in srgb, ${theme.accent} 50%, transparent)`};

  &:hover {
    background: ${({ theme }) => theme.accent};
  }
`;

export const PageBackButton = ({ onClick }) => {
  return (
    <StyledBackButton as={motion.button} whileTap={{scale: 0.9}} onClick={onClick}>
      <FiArrowLeft />
    </StyledBackButton>
  );
};