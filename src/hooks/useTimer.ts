import { useEffect, useRef, useState } from 'react';

interface UseTimerProps {
  initialTime: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  isCompleted: boolean;
  start: () => void;
  stop: () => void;
  reset: (newTime?: number) => void;
  restart: (newTime?: number) => void;
  formatTime: (seconds?: number) => string;
}

export const useTimer = ({
  initialTime,
  onComplete,
  autoStart = true,
}: UseTimerProps): UseTimerReturn => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds?: number): string => {
    const timeToFormat = seconds !== undefined ? seconds : time;
    const mins = Math.floor(timeToFormat / 60);
    const secs = timeToFormat % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Start the timer
  const start = () => {
    if (!isRunning && time > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  };

  // Stop the timer
  const stop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset the timer
  const reset = (newTime?: number) => {
    const resetTime = newTime !== undefined ? newTime : initialTime;
    setTime(resetTime);
    setIsRunning(false);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Restart the timer
  const restart = (newTime?: number) => {
    const restartTime = newTime !== undefined ? newTime : initialTime;
    setTime(restartTime);
    setIsRunning(true);
    setIsCompleted(false);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 1;

          if (newTime <= 0) {
            setIsRunning(false);
            setIsCompleted(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            // Call onComplete callback if provided
            if (onComplete) {
              onComplete();
            }
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, time, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    time,
    isRunning,
    isCompleted,
    start,
    stop,
    reset,
    restart,
    formatTime,
  };
};
