import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import InlineTimer from "./InlineTimer";
import OpenTimer from "./OpenTimerLive";
import Hammer from "hammerjs";

interface TimerInfo {
  step: string;
  timer: number;
  currentTimer?: number;
  isRunning?: boolean;
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
  const [relativePosition, setRelativePosition] = useState(initialPosition);
  const [absolutePosition, setAbsolutePosition] = useState({ x: 0, y: 0 });
  const [timerSettingOpen, setTimerSettingOpen] = useState(false);

  const customTimerCount = useRef(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateAbsolutePosition();

    const handleResize = () => {
      updateAbsolutePosition();
    };

    window.addEventListener("resize", handleResize);

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

    customTimerCount.current = maxNumber + 1;

    return () => window.removeEventListener("resize", handleResize);
  }, [relativePosition, timers]);

  function updateAbsolutePosition() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const element = carouselRef.current;
    const elementWidth = element?.offsetWidth || 50;
    const elementHeight = element?.offsetHeight || 50;

    const maxX = width - elementWidth;
    const maxY = height - elementHeight;

    setAbsolutePosition({
      x: Math.max(0, Math.min(relativePosition.xPercent * width, maxX)),
      y: Math.max(0, Math.min(relativePosition.yPercent * height, maxY)),
    });
  }

  useEffect(() => {
    if (!carouselRef.current) return;
  
    const hammer = new Hammer(carouselRef.current);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
  
    let startPosition = { x: 0, y: 0 };
  
    hammer.on("panstart", () => {
      const rect = carouselRef.current!.getBoundingClientRect();
      startPosition = { x: rect.left, y: rect.top };
      carouselRef.current!.style.transition = "none";
    });
  
    hammer.on("panmove", (e) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const elementWidth = carouselRef.current?.offsetWidth || 50;
      const elementHeight = carouselRef.current?.offsetHeight || 50;
  
      const newX = Math.min(Math.max(startPosition.x + e.deltaX, 0), width - elementWidth);
      const newY = Math.min(Math.max(startPosition.y + e.deltaY, 0), height - elementHeight);
  
      carouselRef.current!.style.left = `${newX}px`;
      carouselRef.current!.style.top = `${newY}px`;
    });
  
    hammer.on("panend", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const rect = carouselRef.current!.getBoundingClientRect();
  
      setAbsolutePosition({ x: rect.left, y: rect.top });
      setRelativePosition({ xPercent: rect.left / width, yPercent: rect.top / height });
  
      carouselRef.current!.style.transition = "";
    });
  
    return () => hammer.destroy();
  }, []);
  

  function handleContentTouch(e: React.TouchEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  function handleAddNewTimer(seconds: number) {
    if (seconds > 0) {
      const timerName = `직접 설정 ${customTimerCount.current}`;
      onAddTimer({ step: timerName, timer: seconds });
      customTimerCount.current += 1;
    }
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
        >
          <div className="p-2 cursor-move bg-gray-100 border-b border-gray-200">
            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>

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
              <button className="px-2 py-1 bg-primary text-white text-xs rounded-full" onClick={() => setTimerSettingOpen(true)}>
                타이머 추가
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("timer") as HTMLElement
      )}

      {timerSettingOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 overflow-hidden">
          <OpenTimer onClose={() => setTimerSettingOpen(false)} onAddTimer={handleAddNewTimer} />
        </div>
      )}
    </>
  );
};

export default TimerCarousel;
