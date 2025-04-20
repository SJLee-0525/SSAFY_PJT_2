import React, { useEffect, useState } from "react";

interface VideoInfoProps {
  IconName: React.ElementType;
  InfoData: string;
  InfoType: string;
}

const VideoInfo = ({ IconName, InfoData, InfoType }: VideoInfoProps) => {
  const [renderInfoData, setRenderInfoData] = useState(InfoData);

  useEffect(() => {
    //1만 이상 값 렌더링용 데이터
    if (Number(InfoData) >= 10000) {
      setRenderInfoData(`${(Number(InfoData) / 10000).toFixed(0)}만`);
    }
  }, [InfoData]);

  return (
    <div className="flex flex-col my-2 gap-1 justify-center items-center text-sm">
      <IconName width={25} height={25} strokeColor="black" strokeWidth={2.5} />
      <p className="text-xs font-preMedium">{InfoType}</p>
      <p className="text-sm font-preBold mt-1">{renderInfoData}</p>
    </div>
  );
};

export default VideoInfo;
