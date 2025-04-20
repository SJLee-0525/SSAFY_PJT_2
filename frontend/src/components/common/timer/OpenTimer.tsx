import React, { useState } from "react";

import IconClose from "@assets/icons/IconClose";

interface TimerProps {
  onClose: () => void;
  onAddTimer: (seconds: number) => void;
}

const OpenTimer = ({ onClose, onAddTimer }: TimerProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startY, setStartY] = useState(0);

  // 시간 변경
  function changeValue(type: "hours" | "minutes" | "seconds", step: number) {
    if (type === "hours") {
      setHours((prev) => (prev + step + 100) % 100); // 0~99 제한
    } else if (type === "minutes") {
      setMinutes((prev) => (prev + step + 60) % 60); // 0~59 순환
    } else if (type === "seconds") {
      setSeconds((prev) => (prev + step + 60) % 60); // 0~59 순환
    }
  }

  // 배경 터치 이벤트 중단
  function handleModalBackgroundTouch(e: React.TouchEvent<HTMLDivElement>) {
    // 배경 클릭 시에만 전파 중단 (시간 선택기 제외)
    if (e.target === e.currentTarget) {
      e.stopPropagation();
    }
  }

  // 터치 시작
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    event.stopPropagation();
    setStartY(event.touches[0].clientY);
  }

  // 터치 이동
  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>, type: "hours" | "minutes" | "seconds") {
    event.stopPropagation();

    const deltaY = startY - event.touches[0].clientY;

    if (Math.abs(deltaY) > 10) {
      const step = deltaY > 0 ? 1 : -1;
      changeValue(type, step);
      setStartY(event.touches[0].clientY); // 새로운 기준점 업데이트
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onTouchStart={handleModalBackgroundTouch}
      onTouchMove={handleModalBackgroundTouch}
      onTouchEnd={handleModalBackgroundTouch}
    >
      <div
        className="portrait:w-[70vw] landscape:w-[50vw] h-fit pb-6 flex flex-col gap-2 justify-between bg-subContent/90 backdrop-blur-lg
        text-black rounded-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center font-preSemiBold">
          <IconClose width={50} height={50} strokeColor="black" strokeWidth={1} onClick={onClose} />
        </div>

        {/* 시간, 분, 초 */}
        <div className="flex justify-center items-center gap-1.5 text-xl text-longContent font-preLight">
          <div
            className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "hours")}
          >
            <span>{String((hours + 98) % 100).padStart(2, "0")}</span>
            <span>{String((hours + 99) % 100).padStart(2, "0")}</span>
            <span className="text-5xl text-black my-0.5">{String(hours).padStart(2, "0")}</span>
            <span>{String((hours + 1) % 100).padStart(2, "0")}</span>
            <span>{String((hours + 2) % 100).padStart(2, "0")}</span>
          </div>
          <span className="text-5xl text-black">:</span>
          <div
            className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "minutes")}
          >
            <span>{String((minutes + 58) % 60).padStart(2, "0")}</span>
            <span>{String((minutes + 59) % 60).padStart(2, "0")}</span>
            <span className="text-5xl text-black my-0.5">{String(minutes).padStart(2, "0")}</span>
            <span>{String((minutes + 1) % 60).padStart(2, "0")}</span>
            <span>{String((minutes + 2) % 60).padStart(2, "0")}</span>
          </div>
          <span className="text-5xl text-black">:</span>
          <div
            className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "seconds")}
          >
            <span>{String((seconds + 58) % 60).padStart(2, "0")}</span>
            <span>{String((seconds + 59) % 60).padStart(2, "0")}</span>
            <span className="text-5xl text-black my-0.5">{String(seconds).padStart(2, "0")}</span>
            <span>{String((seconds + 1) % 60).padStart(2, "0")}</span>
            <span>{String((seconds + 2) % 60).padStart(2, "0")}</span>
          </div>
        </div>

        {/* 설정 버튼 */}
        <button
          onClick={() => onAddTimer(hours * 3600 + minutes * 60 + seconds)}
          className={`block mx-6 mt-3 px-6 py-2 rounded-3xl font-preBold text-white bg-primaryLight`}
        >
          타이머 추가
        </button>
      </div>
    </div>
  );
};

export default OpenTimer;
