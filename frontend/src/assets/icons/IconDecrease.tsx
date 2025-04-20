import { IconProps } from "@/types/iconProps";

const IconDecrease = ({ width, height, strokeColor, strokeWidth = 3 }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 15H25"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconDecrease;
