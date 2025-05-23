import { IconProps } from "@/types/iconProps";

const IconStarBlank = ({ width, height, strokeWidth = 1.5 }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28.6042 7.3125L32.2709 14.6458C32.7709 15.6667 34.1042 16.6458 35.2292 16.8333L41.8751 17.9375C46.1251 18.6458 47.1251 21.7292 44.0626 24.7708L38.8959 29.9375C38.0209 30.8125 37.5417 32.5 37.8126 33.7083L39.2917 40.1042C40.4584 45.1667 37.7709 47.125 33.2917 44.4792L27.0626 40.7917C25.9376 40.125 24.0834 40.125 22.9376 40.7917L16.7084 44.4792C12.2501 47.125 9.54172 45.1458 10.7084 40.1042L12.1876 33.7083C12.4584 32.5 11.9792 30.8125 11.1042 29.9375L5.93755 24.7708C2.89589 21.7292 3.87506 18.6458 8.12505 17.9375L14.7709 16.8333C15.8751 16.6458 17.2084 15.6667 17.7084 14.6458L21.3751 7.3125C23.3751 3.33333 26.6251 3.33333 28.6042 7.3125Z"
        stroke="#e7e7e7"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#e7e7e7"
      />
    </svg>
  );
};

export default IconStarBlank;
