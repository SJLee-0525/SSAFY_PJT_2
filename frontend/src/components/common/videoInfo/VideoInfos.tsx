import IconClock from "@assets/icons/IconClock";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";
import VideoInfo from "@components/common/videoInfo/VideoInfo";

interface VideoInfosProps {
  duration: string;
  likeCount: number;
  viewCount: number;
}

const VideoInfos = ({ duration, likeCount, viewCount }: VideoInfosProps) => {
  return (
    <div className="w-full flex justify-around items-center">
      <VideoInfo IconName={IconClock} InfoData={duration} InfoType="TIME" />
      <VideoInfo IconName={IconLike} InfoData={likeCount.toString()} InfoType="LIKE" />
      <VideoInfo IconName={IconView} InfoData={viewCount.toString()} InfoType="VIEW" />
    </div>
  );
};

export default VideoInfos;
