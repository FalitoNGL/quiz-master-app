// src/data/quizData.js

import { FiShield, FiCode } from 'react-icons/fi';

// 1. Definisikan kategori yang tersedia
export const quizCategories = [
  {
    id: 'keamanan-informasi',
    name: 'Keamanan Informasi',
    description: 'Uji pengetahuan dasar Anda tentang keamanan siber.',
    icon: FiShield,
  },
  {
    id: 'javascript-dasar',
    name: 'Dasar JavaScript',
    description: 'Seberapa baik Anda memahami fundamental JavaScript?',
    icon: FiCode,
  },
  // Anda bisa menambahkan kategori lain di sini
];

// 2. Buat objek yang berisi semua soal, dipisahkan oleh ID kategori
const allQuizzes = {
  'keamanan-informasi': [
    {
      question: "Dalam Perpres No. 71 Tahun 2019, apa yang dimaksud dengan transaksi elektronik?",
      options: ["Transaksi di pasar tradisional", "Transaksi uang tunai", "Setiap tindakan hukum yang dilakukan dengan menggunakan sistem elektronik", "Transaksi jual beli secara langsung"],
      correct: 2,
      explanation: "Perpres No. 71 Tahun 2019 mengatur penyelenggaraan sistem dan transaksi elektronik.",
      reference: "Referensi: Pertemuan 2 FKI RKS A, slide 41"
    },
    {
      question: "Malware yang menyamar sebagai program yang sah disebut...",
      options: ["Spyware", "Worm", "Virus", "Trojan horse"],
      correct: 3,
      explanation: "Trojan horse adalah malware yang menyamar sebagai perangkat lunak sah.",
      reference: "Referensi: Pertemuan 4 FKI_Manajemen Risiko, slide 28"
    },
    // ... Tambahkan soal Keamanan Informasi lainnya di sini
  ],
  'javascript-dasar': [
    {
      question: "Manakah cara yang benar untuk mendeklarasikan sebuah variabel yang nilainya tidak akan berubah?",
      options: ["let", "var", "const", "variable"],
      correct: 2,
      explanation: "'const' digunakan untuk mendeklarasikan variabel konstanta yang nilainya tidak dapat diubah setelah diinisialisasi.",
      reference: "MDN Web Docs: const"
    },
    {
      question: "Tipe data apa yang akan dikembalikan oleh operator 'typeof' untuk sebuah array?",
      options: ["array", "object", "array-object", "list"],
      correct: 1,
      explanation: "Di JavaScript, array secara teknis adalah sebuah tipe dari objek, sehingga 'typeof []' akan mengembalikan 'object'.",
      reference: "MDN Web Docs: typeof"
    },
    // ... Tambahkan soal JavaScript lainnya di sini
  ]
};

// --- Fungsi Helper ---
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 3. Ubah fungsi getShuffledQuestions agar menerima ID kategori
export const getShuffledQuestions = (categoryId) => {
  const quizData = allQuizzes[categoryId];
  if (!quizData) return [];

  const questions = quizData.map(q => {
    const originalOptions = [...q.options];
    const correctText = originalOptions[q.correct];

    const shuffledOptions = shuffleArray(originalOptions);
    const correctIndex = shuffledOptions.findIndex(opt => opt === correctText);

    return { ...q, options: shuffledOptions, correct: correctIndex };
  });

  return shuffleArray(questions);
};