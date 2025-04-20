import { FilterButtonProps } from "@/types/commonProps.ts";

const FilterButton = ({ isSelected, content, count, onAction, className }: FilterButtonProps) => {
  return (
    <button
      type="button"
      className={`flex justify-between items-center font-preMedium text-sm rounded-full px-2 py-0.5 gap-2 ${
        isSelected ? "border border-primary text-primary" : "border border-content text-content"
      } ${className}`}
      onClick={onAction}
    >
      <span>{content}</span>
      {count && <span>{count}</span>}
    </button>
  );
};

export default FilterButton;
