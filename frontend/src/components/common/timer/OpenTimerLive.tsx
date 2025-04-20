import React, { useState, useEffect, useRef } from "react";
import IconClose from "@assets/icons/IconClose";
import Hammer from "hammerjs";

interface TimerProps {
  onClose: () => void;
  onAddTimer: (seconds: number) => void;
}

const OpenTimer = ({ onClose, onAddTimer }: TimerProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const timerRefs = {
    hours: useRef<HTMLDivElement>(null),
    minutes: useRef<HTMLDivElement>(null),
    seconds: useRef<HTMLDivElement>(null),
  };

  function changeValue(type: "hours" | "minutes" | "seconds", step: number) {
    if (type === "hours") setHours((prev) => (prev + step + 100) % 100);
    else if (type === "minutes") setMinutes((prev) => (prev + step + 60) % 60);
    else setSeconds((prev) => (prev + step + 60) % 60);
  }

  useEffect(() => {
    const types: ("hours" | "minutes" | "seconds")[] = ["hours", "minutes", "seconds"];
    const hammers = types.map((type) => {
      const hammer = new Hammer(timerRefs[type].current!);
      hammer.get("pan").set({ direction: Hammer.DIRECTION_VERTICAL });

      let lastY = 0;

      hammer.on("panstart", (e) => {
        lastY = e.deltaY;
      });

      hammer.on("panmove", (e) => {
        const deltaY = e.deltaY - lastY;
        if (Math.abs(deltaY) > 10) {
          const step = deltaY < 0 ? 1 : -1;
          changeValue(type, step);
          lastY = e.deltaY;
        }
      });

      return hammer;
    });

    return () => {
      hammers.forEach((hammer) => hammer.destroy());
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="portrait:w-[70vw] landscape:w-[50vw] h-fit pb-6 flex flex-col gap-2 justify-between bg-subContent/90 backdrop-blur-lg text-black rounded-2xl shadow-lg relative">
        <div className="flex justify-end items-center font-preSemiBold">
          <IconClose width={50} height={50} strokeColor="black" strokeWidth={1} onClick={onClose} />
        </div>

        <div className="flex justify-center items-center gap-1.5 text-xl text-longContent font-preLight">
          {(["hours", "minutes", "seconds"] as const).map((type, idx) => (
            <React.Fragment key={type}>
              {idx !== 0 && <span className="text-5xl text-black">:</span>}
              <div
                ref={timerRefs[type]}
                className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg touch-none"
              >
                <span>{String((eval(type) + (type === "hours" ? 98 : 58)) % (type === "hours" ? 100 : 60)).padStart(2, "0")}</span>
                <span>{String((eval(type) + (type === "hours" ? 99 : 59)) % (type === "hours" ? 100 : 60)).padStart(2, "0")}</span>
                <span className="text-5xl text-black my-0.5">{String(eval(type)).padStart(2, "0")}</span>
                <span>{String((eval(type) + 1) % (type === "hours" ? 100 : 60)).padStart(2, "0")}</span>
                <span>{String((eval(type) + 2) % (type === "hours" ? 100 : 60)).padStart(2, "0")}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onAddTimer(hours * 3600 + minutes * 60 + seconds)}
          className="block mx-6 mt-3 px-6 py-2 rounded-3xl font-preBold text-white bg-primaryLight"
        >
          타이머 추가
        </button>
      </div>
    </div>
  );
};

export default OpenTimer;
