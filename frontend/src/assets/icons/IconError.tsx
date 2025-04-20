import { IconProps } from "@/types/iconProps";

const IconError = ({ width, height }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M75 137.5C109.375 137.5 137.5 109.375 137.5 75C137.5 40.625 109.375 12.5 75 12.5C40.625 12.5 12.5 40.625 12.5 75C12.5 109.375 40.625 137.5 75 137.5Z"
        fill="#EDF4FE"
      />
      <path d="M75 50V81.25" stroke="#0072DE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74.9658 100H75.022" stroke="#0072DE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default IconError;
