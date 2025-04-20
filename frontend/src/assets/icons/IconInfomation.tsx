import { IconProps } from "@/types/iconProps";

const IconInfomation = ({ width, height, strokeColor }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.33 22.0801C17.83 22.0801 22.33 17.5801 22.33 12.0801C22.33 6.58008 17.83 2.08008 12.33 2.08008C6.83002 2.08008 2.33002 6.58008 2.33002 12.0801C2.33002 17.5801 6.83002 22.0801 12.33 22.0801Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.33 8.08008V13.0801"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.3245 16.0801H12.3335"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconInfomation;
