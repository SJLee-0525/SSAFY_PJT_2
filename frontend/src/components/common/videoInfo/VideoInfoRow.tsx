import React, { useEffect, useState } from "react";

interface VideoInfoRowProps {
  IconName: React.ElementType;
  InfoData: string;
}

const VideoInfoRow = ({ IconName, InfoData }: VideoInfoRowProps) => {
  const [renderInfoData, setRenderInfoData] = useState(InfoData);

  useEffect(() => {
    //1만 이상 값 렌더링용 데이터
    if (Number(InfoData) >= 10000) {
      setRenderInfoData(`${(Number(InfoData) / 10000).toFixed(0)}만`);
    }
  }, [InfoData]);

  return (
    <div className="flex gap-1.5 justify-center items-center text-sm text-title">
      <IconName width={15} height={15} strokeColor="#202020" strokeWidth={2.5} />
      <p className="font-preMedium text-sm">{renderInfoData}</p>
    </div>
  );
};

export default VideoInfoRow;
