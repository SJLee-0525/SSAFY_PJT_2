import IconClock from "@assets/icons/IconClock";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";

import VideoInfoRow from "./VideoInfoRow";

interface VideoInfoRowsProps {
  duration: string;
  likeCount: number;
  viewCount: number;
}

const VideoInfoRows = ({ duration, likeCount, viewCount }: VideoInfoRowsProps) => {
  return (
    <div className="w-2/3 flex justify-between items-center gap-4 text-sm">
      <VideoInfoRow IconName={IconClock} InfoData={duration} />
      <VideoInfoRow IconName={IconLike} InfoData={likeCount.toString()} />
      <VideoInfoRow IconName={IconView} InfoData={viewCount.toString()} />
    </div>
  );
};

export default VideoInfoRows;
