import { IconProps } from "@/types/iconProps";

const IconClock = ({ width, height, strokeColor, strokeWidth = 1.5 }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 45 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M41.25 23.3333C41.25 33.6833 32.85 42.0833 22.5 42.0833C12.15 42.0833 3.75 33.6833 3.75 23.3333C3.75 12.9833 12.15 4.58325 22.5 4.58325C32.85 4.58325 41.25 12.9833 41.25 23.3333Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.4563 29.2958L23.6438 25.827C22.6313 25.227 21.8063 23.7833 21.8063 22.602V14.9145"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconClock;
