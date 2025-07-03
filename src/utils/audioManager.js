// src/utils/audioManager.js

const sounds = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  click: '/sounds/click.mp3',
  finish: '/sounds/finish.mp3'
};

const audioCache = {};

/**
 * Memuat semua suara ke dalam cache agar siap dimainkan.
 * Sebaiknya panggil fungsi ini sekali saat aplikasi pertama kali dimuat.
 */
export const preloadSounds = () => {
  for (const key in sounds) {
    if (Object.hasOwnProperty.call(sounds, key)) {
      const audio = new Audio(sounds[key]);
      audio.load();
      audioCache[key] = audio;
    }
  }
  console.log('Audio preloaded:', Object.keys(audioCache));
};

/**
 * Memainkan suara dari cache.
 * @param {('correct'|'incorrect'|'click'|'finish')} soundName - Nama suara yang ingin dimainkan.
 */
export const playSound = (soundName) => {
  if (audioCache[soundName]) {
    // Mengatur ulang waktu ke awal agar bisa dimainkan berulang kali dengan cepat
    audioCache[soundName].currentTime = 0;
    audioCache[soundName].play().catch(error => {
      // Menangani error jika user belum berinteraksi dengan halaman
      console.warn(`Could not play sound '${soundName}':`, error);
    });
  } else {
    console.warn(`Sound '${soundName}' not found in cache.`);
  }
};