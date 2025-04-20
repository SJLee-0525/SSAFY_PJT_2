import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import InlineTimer from "./InlineTimer";
import OpenTimer from "./OpenTimer";

interface TimerInfo {
  step: string;
  timer: number;
  currentTimer?: number; // 현재 진행 중인 타이머 값
  isRunning?: boolean; // 타이머 실행 상태
}

interface TimerCarouselProps {
  timers: TimerInfo[];
  onAddTimer: (timerInfo: { step: string; timer: number }) => void;
  onRemoveTimer: (step: string) => void;
  onTimerUpdate: (step: string, data: { currentTimer: number; isRunning: boolean }) => void;
  initialPosition?: { xPercent: number; yPercent: number };
}

const TimerCarousel = ({
  timers,
  onAddTimer,
  onRemoveTimer,
  onTimerUpdate,
  initialPosition = { xPercent: 0.15, yPercent: 0.915 },
}: TimerCarouselProps) => {
  // 상대적 위치 사용 (0~1 사이의 값으로 표현)
  const [relativePosition, setRelativePosition] = useState(initialPosition);
  const [absolutePosition, setAbsolutePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [timerSettingOpen, setTimerSettingOpen] = useState(false);

  // 사용자 정의 타이머 카운터 ref 추가
  const customTimerCount = useRef(1);

  const offset = useRef({ x: 0, y: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 초기 위치 설정 및 타이머 카운터 설정
  useEffect(() => {
    updateAbsolutePosition();

    // 화면 크기 변경 이벤트 처리
    function handleResize() {
      updateAbsolutePosition();
    }

    window.addEventListener("resize", handleResize);

    // 기존 직접 설정 타이머 중 가장 높은 번호 찾기
    let maxNumber = 0;
    timers.forEach((timer) => {
      const match = timer.step.match(/직접 설정 (\d+)/);
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    // 최대 번호 + 1로 카운터 설정
    customTimerCount.current = maxNumber + 1;

    return () => window.removeEventListener("resize", handleResize);
  }, [relativePosition, timers]);

  // 상대적 위치를 절대적 위치로 변환하는 함수
  function updateAbsolutePosition() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const element = carouselRef.current;
    const elementWidth = element?.offsetWidth || 50;
    const elementHeight = element?.offsetHeight || 50;

    const maxX = width - elementWidth;
    const maxY = height - elementHeight;

    // 상대적 위치를 절대적 픽셀 위치로 변환
    setAbsolutePosition({
      x: Math.max(0, Math.min(relativePosition.xPercent * width, maxX)),
      y: Math.max(0, Math.min(relativePosition.yPercent * height, maxY)),
    });
  }

  // 드래그 시작 - 캐러셀 헤더 또는 외부 영역에서만 작동
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>): void {
    // contentRef가 존재하고, 해당 영역 내에서 터치가 발생한 경우 드래그하지 않음
    if (contentRef.current && contentRef.current.contains(event.target as Node)) {
      return;
    }

    setIsDragging(true);
    const touch = event.touches[0];

    offset.current = {
      x: touch.clientX - absolutePosition.x,
      y: touch.clientY - absolutePosition.y,
    };
  }

  // 드래그 중
  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    if (!isDragging) return;

    const touch = event.touches[0];
    const width = window.innerWidth;
    const height = window.innerHeight;

    const element = carouselRef.current;
    const elementWidth = element?.offsetWidth || 50;
    const elementHeight = element?.offsetHeight || 50;

    const newX = Math.max(0, Math.min(touch.clientX - offset.current.x, width - elementWidth));
    const newY = Math.max(0, Math.min(touch.clientY - offset.current.y, height - elementHeight));

    // 절대 위치 업데이트
    setAbsolutePosition({ x: newX, y: newY });

    // 상대 위치도 함께 업데이트 (화면 크기 변경 시 사용)
    setRelativePosition({
      xPercent: newX / width,
      yPercent: newY / height,
    });
  }

  // 터치 종료
  function handleTouchEnd() {
    setIsDragging(false);
  }

  // 컨텐츠 영역 터치 처리 (이벤트 전파 중단)
  function handleContentTouch(e: React.TouchEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  // 새 타이머 설정 및 추가 처리
  function handleAddNewTimer(seconds: number) {
    if (seconds > 0) {
      // 고유한 타이머 이름 생성 (번호 증가)
      const timerName = `직접 설정 ${customTimerCount.current}`;

      // 타이머 추가
      onAddTimer({
        step: timerName,
        timer: seconds,
      });

      // 카운터 증가
      customTimerCount.current += 1;
    }

    // 설정 모달 닫기
    setTimerSettingOpen(false);
  }

  return (
    <>
      {createPortal(
        <div
          ref={carouselRef}
          className="fixed z-50 bg-subContent/80 rounded-xl shadow-lg overflow-hidden border border-gray-200 portrait:w-[58vw] landscape:w-[30vw]"
          style={{
            left: `${absolutePosition.x}px`,
            top: `${absolutePosition.y}px`,
            touchAction: "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 드래그 핸들 영역 (헤더) */}
          <div className="p-2 cursor-move bg-gray-100 border-b border-gray-200">
            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>

          {/* 타이머 리스트 영역 - 터치 이벤트 전파 중단 */}
          <div
            ref={contentRef}
            className="portrait:h-[20vh] landscape:h-[38vh] overflow-y-auto"
            onTouchStart={handleContentTouch}
            onTouchMove={handleContentTouch}
            style={{ touchAction: "auto" }}
          >
            {timers.length === 0 ? (
              <div className="py-6 text-center text-gray-500 text-sm">등록된 타이머가 없습니다</div>
            ) : (
              <div className="p-3 space-y-4">
                {timers.map((timer, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <InlineTimer
                      defaultTimer={timer.timer}
                      timerStep={timer.step}
                      currentTimer={timer.currentTimer}
                      isRunning={timer.isRunning}
                      onTimerUpdate={(data) => onTimerUpdate(timer.step, data)}
                      onRemoveTimer={onRemoveTimer}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center items-center mb-2">
              <button
                className="px-2 py-1 bg-primary text-white leading-5 text-center text-xs font-preSemiBold rounded-full"
                onClick={() => {
                  setTimerSettingOpen(true);
                }}
              >
                타이머 추가
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("timer") as HTMLElement
      )}

      {/* 전체화면 중앙에 위치한 OpenTimer */}
      {timerSettingOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 overflow-hidden">
          <OpenTimer onClose={() => setTimerSettingOpen(false)} onAddTimer={handleAddNewTimer} />
        </div>
      )}
    </>
  );
};

export default TimerCarousel;
