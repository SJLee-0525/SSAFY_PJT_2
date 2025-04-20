import { IconProps } from "@/types/iconProps";

const IconFilter = ({ width, height, strokeColor, onClick }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      onClick={onClick}
    >
      <path
        d="M13.41 20.79L12.0001 21.7C10.6901 22.51 8.87006 21.6 8.87006 19.98V14.63C8.87006 13.92 8.47006 13.01 8.06006 12.51L4.22003 8.47C3.71003 7.96 3.31006 7.06001 3.31006 6.45001V4.13C3.31006 2.92 4.22008 2.01001 5.33008 2.01001H18.67C19.78 2.01001 20.6901 2.92 20.6901 4.03V6.25C20.6901 7.06 20.1801 8.07001 19.6801 8.57001"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0802 11.8899L13.5401 15.4299C13.4001 15.5699 13.2701 15.8299 13.2401 16.0199L13.0501 17.3699C12.9801 17.8599 13.3202 18.1999 13.8102 18.1299L15.1601 17.9399C15.3501 17.9099 15.6202 17.7799 15.7502 17.6399L19.2901 14.0999C19.9001 13.4899 20.1901 12.7799 19.2901 11.8799C18.4001 10.9899 17.6902 11.2799 17.0802 11.8899Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5801 12.3899C16.8801 13.4699 17.72 14.3099 18.8 14.6099"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconFilter;
