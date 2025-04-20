import React from "react";
import { ToggleProps } from "@/types/commonProps";

const Toggle = ({ isToggle, onToggle }: ToggleProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(!isToggle);
  };

  return (
    <label
      htmlFor="check"
      className={`relative cursor-pointer w-12 h-7 rounded-full ${isToggle ? "bg-primary" : "bg-subContent"}`}
      onClick={handleToggle}
    >
      <input type="checkbox" id="check" className="sr-only peer" checked={isToggle} readOnly />
      <span className="w-5 h-5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 left-1 peer-checked:left-6 transition-all duration-500"></span>
    </label>
  );
};

export default Toggle;
