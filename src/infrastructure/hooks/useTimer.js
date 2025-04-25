import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialMinutes, isActive) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [progress, setProgress] = useState(1);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    setTimeLeft(initialMinutes * 60);
    setProgress(1);
  }, [initialMinutes]);

  useEffect(() => {
    let intervalId;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(newTime / (initialMinutes * 60));
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, timeLeft, initialMinutes]);

  return {
    timeLeft,
    progress,
    formattedTime: formatTime(timeLeft),
  };
};
