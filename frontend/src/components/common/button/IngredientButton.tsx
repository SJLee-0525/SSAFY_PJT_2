import { FilterButtonProps } from "@/types/commonProps.ts";

import IconClose from "@assets/icons/IconClose";

const IngredientButton = ({ isSelected, content, onAction, className }: FilterButtonProps) => {
  return (
    <div
      className={`flex justify-between items-center font-preMedium text-sm rounded-full w-fit ps-2.5 pe-1.5 py-0.5 gap-0.5 border ${isSelected ? "border-primary text-primary" : "border-error text-error"} ${className}`}
    >
      <p className="w-fit h-fit whitespace-nowrap">{content}</p>
      <IconClose width={16} height={16} strokeColor={isSelected ? "#0381fe" : "#d44848"} onClick={onAction} />
    </div>
  );
};

export default IngredientButton;
