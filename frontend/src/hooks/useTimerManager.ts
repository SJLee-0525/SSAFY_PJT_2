import { useState, useRef, useEffect } from "react";

import alertSound from "@assets/sounds/alertSound.mp3";

export interface TimerInfo {
  step: string;
  timer: number;
  currentTimer?: number;
  isRunning?: boolean;
}

const useTimerManager = (initialTimers: TimerInfo[] = []) => {
  const [timers, setTimers] = useState<TimerInfo[]>(initialTimers);
  const timerIntervals = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // 타이머 카운트다운 시작
  function startTimerCountdown(step: string) {
    // 이미 실행 중인 타이머가 있으면 정리
    if (timerIntervals.current[step]) {
      clearInterval(timerIntervals.current[step]);
    }

    // 새 인터벌 설정
    timerIntervals.current[step] = setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.step === step && timer.isRunning) {
            const currentValue = timer.currentTimer ?? timer.timer;
            const newValue = currentValue > 0 ? currentValue - 1 : 0;

            // 타이머가 0에 도달하면 정지
            if (newValue === 0) {
              clearInterval(timerIntervals.current[step]);
              delete timerIntervals.current[step];

              // 알림음 재생
              const audio = new Audio(alertSound);
              audio.play().catch((error) => {
                console.error("Audio play error:", error);
              });

              return { ...timer, currentTimer: newValue, isRunning: false };
            }

            return { ...timer, currentTimer: newValue };
          }
          return timer;
        })
      );
    }, 1000);
  }

  // 타이머 정지
  function stopTimerCountdown(step: string) {
    if (timerIntervals.current[step]) {
      clearInterval(timerIntervals.current[step]);
      delete timerIntervals.current[step];
    }
  }

  // 타이머 상태 업데이트 핸들러
  function handleTimerUpdate(step: string, data: { currentTimer: number; isRunning: boolean }) {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.step === step) {
          // 타이머 상태 변경
          if (data.isRunning && !timer.isRunning) {
            // 타이머 시작
            startTimerCountdown(step);
          } else if (!data.isRunning && timer.isRunning) {
            // 타이머 정지
            stopTimerCountdown(step);
          }

          return {
            ...timer,
            currentTimer: data.currentTimer,
            isRunning: data.isRunning,
          };
        }
        return timer;
      })
    );
  }

  // 새 타이머 추가
  function addTimer(newTimer: { step: string; timer: number }) {
    setTimers((prev) => [
      ...prev,
      {
        ...newTimer,
        currentTimer: newTimer.timer,
        isRunning: false,
      },
    ]);
  }

  function removeTimer(step: string) {
    setTimers((prev) => prev.filter((timer) => timer.step !== step));
  }

  // 레시피 타이머 업데이트
  function updateRecipeTimers(recipeTimers: { step: string; timer: number }[]) {
    if (!recipeTimers || recipeTimers.length === 0) return;

    const newTimers = recipeTimers.map((item) => ({
      step: item.step,
      timer: item.timer,
      currentTimer: item.timer,
      isRunning: false,
    }));

    // 이전 타이머 상태와 병합
    setTimers((prev) => {
      // 기존 타이머의 상태 유지
      const existingTimers = prev.filter((oldTimer) => newTimers.some((newTimer) => newTimer.step === oldTimer.step));

      // 새 타이머 추가
      const addedTimers = newTimers.filter(
        (newTimer) => !existingTimers.some((oldTimer) => oldTimer.step === newTimer.step)
      );

      return [...existingTimers, ...addedTimers];
    });
  }

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      Object.keys(timerIntervals.current).forEach((key) => {
        clearInterval(timerIntervals.current[key]);
      });
      timerIntervals.current = {};
    };
  }, []);

  return {
    timers,
    handleTimerUpdate,
    addTimer,
    removeTimer,
    updateRecipeTimers,
    hasRunningTimers: timers.some((timer) => timer.isRunning),
  };
};

export default useTimerManager;
