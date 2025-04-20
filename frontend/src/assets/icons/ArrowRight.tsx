import { IconProps } from "@/types/iconProps";

const ArrowRight = ({ width, height, strokeColor, onClick }: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M11.1377 24.9L19.2877 16.75C20.2502 15.7875 20.2502 14.2125 19.2877 13.25L11.1377 5.09998"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowRight;
