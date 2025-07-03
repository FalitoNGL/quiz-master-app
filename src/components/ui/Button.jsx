// src/components/ui/Button.jsx

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  /* ================== PERBAIKAN UTAMA DI SINI ================== */
  /* Menggunakan gradien yang lebih sederhana dan universal */
  background: ${({ theme }) => theme.accent};
  background-image: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.25),
    rgba(0, 0, 0, 0.25)
  );
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 7px 25px ${({ theme }) => `color-mix(in srgb, ${theme.accent} 50%, transparent)`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
    background: ${({ theme }) => theme.textSecondary};
    background-image: none; /* Hapus gradien saat disabled */
  }
`;