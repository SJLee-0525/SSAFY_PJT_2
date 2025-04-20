import React from "react";

import IconPause from "@assets/icons/IconPause";
import IconPlay from "@assets/icons/IconPlay";
import IconStop from "@assets/icons/IconStop";
import IconTrash from "@assets/icons/IconTrash";

interface InlineTimerProps {
  defaultTimer: number;
  timerStep: string;
  currentTimer?: number; // 현재 진행 중인 타이머 값
  isRunning?: boolean; // 타이머 실행 상태
  onTimerUpdate?: (timerData: { currentTimer: number; isRunning: boolean }) => void; // 타이머 상태 업데이트 콜백
  onRemoveTimer: (step: string) => void; // 타이머 삭제 콜백
}

const InlineTimer = ({
  defaultTimer,
  timerStep,
  currentTimer,
  isRunning,
  onTimerUpdate,
  onRemoveTimer,
}: InlineTimerProps) => {
  // 현재 타이머 값
  const displayTimer = currentTimer ?? defaultTimer;

  // 타이머 작동
  function handleRunTimer(e: React.MouseEvent) {
    e.stopPropagation();

    // 상태 변경을 상위 컴포넌트에 알림
    if (onTimerUpdate) {
      onTimerUpdate({
        currentTimer: displayTimer,
        isRunning: !isRunning,
      });
    }
  }

  // 타이머 초기화 함수
  function handleResetTimer() {
    // 상태 변경을 상위 컴포넌트에 알림
    if (onTimerUpdate) {
      onTimerUpdate({
        currentTimer: defaultTimer,
        isRunning: false,
      });
    }
  }

  return (
    <>
      <div className="w-full flex flex-col gap-3 items-center justify-between font-preSemiBold">
        <div className="flex w-full justify-between items-center">
          <span className="text-sm line-clamp-1">{timerStep}</span>

          <button onClick={handleRunTimer}>
            {isRunning ? <IconPause width={15} height={15} /> : <IconPlay width={15} height={15} />}
          </button>
          <button onClick={handleResetTimer}>
            <IconStop width={13} height={13} />
          </button>
          <button onClick={() => onRemoveTimer(timerStep)}>
            <IconTrash width={15} height={15} strokeWidth={3} />
          </button>
        </div>

        <div className="flex w-full items-center justify-center rounded-lg shadow-sm border border-gray-200">
          <div
            className={`flex justify-center items-center gap-0.5 text-xl font-preLight ${
              isRunning && displayTimer <= 5 ? "text-error" : "text-black"
            }`}
          >
            <div className="flex items-center justify-center w-7 text-xl">
              {String(Math.floor(displayTimer / 3600)).padStart(2, "0")}
            </div>
            :
            <div className="flex items-center justify-center w-7 text-xl">
              {String(Math.floor(displayTimer / 60) % 60).padStart(2, "0")}
            </div>
            :
            <div className="flex items-center justify-center w-7 text-xl">
              {String(displayTimer % 60).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InlineTimer;
