import { IconProps } from "@/types/iconProps";

const IconHeart = ({ width, height, strokeColor = "#292D32", strokeWidth = 1.5 }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.775 26.3458C15.35 26.4958 14.65 26.4958 14.225 26.3458C10.6 25.1083 2.5 19.9458 2.5 11.1958C2.5 7.33325 5.6125 4.20825 9.45 4.20825C11.725 4.20825 13.7375 5.30825 15 7.00825C16.2625 5.30825 18.2875 4.20825 20.55 4.20825C24.3875 4.20825 27.5 7.33325 27.5 11.1958C27.5 19.9458 19.4 25.1083 15.775 26.3458Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconHeart;
