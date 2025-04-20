import { ButtonProps } from "@/types/commonProps.ts";

const Button = ({ type, design, content, onAction, className }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onAction}
      className={`text-center font-preMedium text-sm rounded-full ${design === "confirm" ? "bg-primary text-white hover:bg-primaryDark" : "bg-subContent text-white hover:bg-content2"} ${className}`}
    >
      <span>{content}</span>
    </button>
  );
};

export default Button;
