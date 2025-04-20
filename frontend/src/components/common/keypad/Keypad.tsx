import { useEffect, useRef } from "react";

import { KeypadProps } from "@/types/commonProps";

import KeypadElem from "@components/common/keypad/components/KeypadElem";

const KeyPad = ({ value, onChange, onClose }: KeypadProps) => {
  const keypadRef = useRef<HTMLDivElement | null>(null);

  // 키패드 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (keypadRef.current && !keypadRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    // 언마운트 시 이벤트 리스너 제거
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="absolute top-full right-0 z-10 w-fit p-3.5 bg-white rounded-xl shadow-lg font-preMedium"
      ref={keypadRef}
    >
      <KeypadElem value={value} onChange={onChange} />
    </div>
  );
};

export default KeyPad;
