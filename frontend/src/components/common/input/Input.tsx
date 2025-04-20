import { InputProps } from "@/types/commonProps.ts";

// 부모 요소에서 접근 방법: onChange={(event) => setEffect(event.target.value)}

const Input = ({ label, name, type, placeHolder, value, disabled, onChange, labelTextSize }: InputProps) => {
  return (
    <div className="flex flex-col w-full items-start justify-between gap-2">
      {label && <label className={`font-preMedium text-[#333] ${labelTextSize} font-semibold text-xs`}>{label}</label>}
      <input
        name={name}
        type={type}
        placeholder={placeHolder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full px-3 py-1 g-2 h-12 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400`}
      />
    </div>
  );
};

export default Input;
