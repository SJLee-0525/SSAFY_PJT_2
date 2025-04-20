import { IconProps } from "@/types/iconProps";

const IconCloseCircle = ({ width, height, strokeColor }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.33 22.0801C17.83 22.0801 22.33 17.5801 22.33 12.0801C22.33 6.58008 17.83 2.08008 12.33 2.08008C6.82999 2.08008 2.32999 6.58008 2.32999 12.0801C2.32999 17.5801 6.82999 22.0801 12.33 22.0801Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.49998 14.91L15.16 9.25"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.16 14.91L9.49998 9.25"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconCloseCircle;
