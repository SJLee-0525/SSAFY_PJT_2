import { IconProps } from "@/types/iconProps";

const IconView = ({ width, height, strokeColor, strokeWidth = 1.5 }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 45 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M29.2125 23.3333C29.2125 27.0458 26.2125 30.0458 22.5 30.0458C18.7875 30.0458 15.7875 27.0458 15.7875 23.3333C15.7875 19.6208 18.7875 16.6208 22.5 16.6208C26.2125 16.6208 29.2125 19.6208 29.2125 23.3333Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 38.8395C29.1188 38.8395 35.2875 34.9395 39.5813 28.1895C41.2688 25.5458 41.2688 21.102 39.5813 18.4583C35.2875 11.7083 29.1188 7.80826 22.5 7.80826C15.8813 7.80826 9.71251 11.7083 5.41876 18.4583C3.73126 21.102 3.73126 25.5458 5.41876 28.1895C9.71251 34.9395 15.8813 38.8395 22.5 38.8395Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconView;
