import { IconProps } from "@/types/iconProps";

const ArrowLeft = ({ width, height, strokeColor, onClick }: IconProps) => {
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
        d="M18.75 24.9L10.6 16.75C9.63755 15.7875 9.63755 14.2125 10.6 13.25L18.75 5.09998"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowLeft;
