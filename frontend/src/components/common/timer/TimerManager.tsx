import { useEffect, useState } from "react";
import useTimerManager from "@hooks/useTimerManager";

import IconTimer from "@assets/icons/IconTimer";
import IconClose from "@assets/icons/IconClose";

// import TimerCarousel from "@components/common/timer/TimerCarousel";
import TimerCarousel from "@components/common/timer/TimerCarouselLive";

interface TimerManagerProps {
  recipeTimers?: { step: string; timer: number }[];
  position?: { xPercent: number; yPercent: number };
}

const TimerManager = ({ recipeTimers = [], position = { xPercent: 0.15, yPercent: 0.915 } }: TimerManagerProps) => {
  const [timerListOpen, setTimerListOpen] = useState(false);
  const { timers, handleTimerUpdate, addTimer, removeTimer, updateRecipeTimers, hasRunningTimers } = useTimerManager();

  // 레시피 타이머가 변경되면 타이머 목록 업데이트
  useEffect(() => {
    if (recipeTimers && recipeTimers.length > 0) {
      updateRecipeTimers(recipeTimers);
    }
  }, [recipeTimers]);

  return (
    <>
      {/* 타이머 아이콘 */}
      <div className="relative">
        <div
          className="flex justify-center items-center bg-subContent/50 rounded-full w-10 h-10 cursor-pointer"
          onClick={() => setTimerListOpen(!timerListOpen)}
        >
          {timerListOpen ? (
            <IconClose width={40} height={40} strokeColor="black" strokeWidth={1} />
          ) : (
            <>
              <IconTimer width={22} height={22} strokeColor="black" isRunning={hasRunningTimers} percentage={50} />
              {timers.length > 0 && <div className="absolute top-0 right-1 bg-red-500 rounded-full w-3 h-3"></div>}
            </>
          )}
        </div>
      </div>

      {/* TimerCarousel 컴포넌트 */}
      {timerListOpen && (
        <TimerCarousel
          timers={timers}
          onAddTimer={addTimer}
          onRemoveTimer={removeTimer}
          onTimerUpdate={handleTimerUpdate}
          initialPosition={position}
        />
      )}
    </>
  );
};

export default TimerManager;
