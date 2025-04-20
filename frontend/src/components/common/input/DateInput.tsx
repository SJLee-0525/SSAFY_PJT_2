import { DateInputProps } from "@/types/commonProps.ts";

// 부모 요소에서 접근 방법: onChange={(event) => setEffect(event.target.value)}

const DateInput = ({ label, name, type, value, min, max, disabled, onChange }: DateInputProps) => {
  return (
    <div className="flex flex-col w-full items-start justify-between gap-2">
      {label && <label className={`font-preMedium text-[#333] font-semibold text-xs`}>{label}</label>}
      <input
        name={name}
        type={type}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={onChange}
        className={`w-full px-3 py-1 g-2 h-12 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400`}
      />
    </div>
  );
};

export default DateInput;
