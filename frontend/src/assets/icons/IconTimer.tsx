import { IconProps } from "@/types/iconProps";

const IconTimer = ({
  width,
  height,
  strokeColor,
  isRunning,
  percentage,
}: IconProps & { isRunning: boolean; percentage: number }) => {
  const radius = 8; // 원 반지름
  const center = 12; // 중심 좌표
  const angle = (360 * (100 - percentage)) / 100; // 백분율의 반대 값에 따른 각도 (남은 시간)

  // 부채꼴(채워지는 부분) 계산 - 반시계 방향으로 시작점 조정
  const startAngle = -90; // 시작점 (12시)
  const endAngle = startAngle - angle; // 반시계 방향으로 각도 계산

  const startX = center + radius * Math.cos((Math.PI * startAngle) / 180);
  const startY = center + radius * Math.sin((Math.PI * startAngle) / 180);

  const endX = center + radius * Math.cos((Math.PI * endAngle) / 180);
  const endY = center + radius * Math.sin((Math.PI * endAngle) / 180);

  const largeArcFlag = percentage < 50 ? 1 : 0; // 50% 미만이면 큰 호를 그림 (남은 부분이 더 큼)

  // 남은 시간을 나타내는 부채꼴 경로
  const pathData = `M ${center},${center} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},0 ${endX},${endY} Z`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <circle cx={center} cy={center} r={9.5} stroke={strokeColor} strokeWidth="1.5" fill="none" />

      {/* 남은 시간 표시 */}
      {!isRunning && (
        <path d="M12 5V12" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {isRunning &&
        (percentage === 0 ? (
          <circle cx={center} cy={center} r={radius} fill={strokeColor} />
        ) : (
          <path d={pathData} fill={strokeColor} />
        ))}

      <path d="M9 2H15" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
};

export default IconTimer;
