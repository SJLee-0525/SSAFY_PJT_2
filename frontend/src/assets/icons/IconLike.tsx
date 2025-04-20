import { IconProps } from "@/types/iconProps";

const IconLike = ({ width, height, strokeColor, strokeWidth = 1.5 }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 45 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.025 35.2395L19.8375 39.7395C20.5875 40.4895 22.275 40.8645 23.4 40.8645H30.525C32.775 40.8645 35.2125 39.177 35.775 36.927L40.275 23.2395C41.2125 20.6145 39.525 18.3645 36.7125 18.3645H29.2125C28.0875 18.3645 27.15 17.427 27.3375 16.1145L28.275 10.1145C28.65 8.427 27.525 6.552 25.8375 5.9895C24.3375 5.427 22.4625 6.177 21.7125 7.302L14.025 18.7395"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
      <path
        d="M4.46252 35.2395V16.8645C4.46252 14.2395 5.58752 13.302 8.21252 13.302H10.0875C12.7125 13.302 13.8375 14.2395 13.8375 16.8645V35.2395C13.8375 37.8645 12.7125 38.802 10.0875 38.802H8.21252C5.58752 38.802 4.46252 37.8645 4.46252 35.2395Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconLike;
