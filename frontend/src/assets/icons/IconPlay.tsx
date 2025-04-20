import { IconProps } from "@/types/iconProps";

const IconPlay = ({ width, height, onClick }: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M0.76001 3.22006V12.7901C0.76001 14.7501 2.89001 15.9801 4.59001 15.0001L8.74001 12.6101L12.89 10.2101C14.59 9.23006 14.59 6.78006 12.89 5.80006L8.74001 3.40006L4.59001 1.01006C2.89001 0.0300586 0.76001 1.25006 0.76001 3.22006Z"
        fill="#292D32"
      />
    </svg>
  );
};

export default IconPlay;
