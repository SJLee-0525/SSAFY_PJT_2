import Button from "@components/common/button/Button.tsx";

import { KeypadElemProps } from "@/types/commonProps";

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "DEL", "0", "C"];

const KeypadElem = ({ value, onChange }: KeypadElemProps) => {
  function handleInput(val: string) {
    if (Number(value + val) > 999) {
      // alert("최대 999까지 입력 가능합니다.");
      return;
    }

    onChange(value + val);
  }

  function handleDelete() {
    if (!value) return;
    onChange(value.slice(0, -1));
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="flex flex-col items-center justify-center w-fit h-fit bg-white">
      <div className="grid grid-cols-3 gap-1.5">
        {NUMBER_KEYS.map((key) => (
          <Button
            type="button"
            design={key === "DEL" || key === "C" ? "cancel" : "confirm"}
            key={key}
            onAction={() => {
              if (key === "DEL") handleDelete();
              else if (key === "C") handleClear();
              else handleInput(key);
            }}
            content={key}
            className="w-10 h-10"
          />
        ))}
      </div>
    </div>
  );
};

export default KeypadElem;
