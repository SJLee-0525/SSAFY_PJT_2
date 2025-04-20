import "./RecipeTitle.css";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Video } from "@/types/recipeListTypes";

import { getYoutubeThumbnailUrl } from "@utils/getYoutubeThumbnailUrl";

import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Button from "@components/common/button/Button";

import IconHeart from "@assets/icons/IconHeart";
import IconHeartFill from "@assets/icons/IconHeartFill";
import IconPremium from "@assets/icons/IconPremium";

import useUserStore from "@stores/userStore";
import useRecipeStore from "@stores/recipeStore";

import { patchRecipeApi } from "@apis/recipeApi";

interface RecipeCardProps {
  video: Video;
}

const RecipeCard = ({ video }: RecipeCardProps) => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { updateRecipeFavorite } = useRecipeStore();

  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState<boolean>(video.favorite);
  const [duration, setDuration] = useState<number>(15);

  const thumbnailUrl = getYoutubeThumbnailUrl(video.url);

  const textRef = useRef<HTMLDivElement>(null);

  //제목 이동 속도 일관되게 하기 위한 useEffect
  useEffect(() => {
    if (video.title.length > 30 && textRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const totalDistance = textWidth; // 한 타이틀만 기준으로
      const speed = 150; // px/sec (속도 고정)
      const calculatedDuration = (totalDistance * 2) / speed; // 2배 길이만큼 움직임
      setDuration(calculatedDuration);
    }
  }, [video.title]);

  async function handleLike() {
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    try {
      const response = await patchRecipeApi(userId, video.recipeId, 0, newLiked);
      // API 응답의 favorite 값으로 store 업데이트
      updateRecipeFavorite(video.recipeId, response.favorite);

      //즐겨찾기 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["favoriteRecipe", userId] });
    } catch (error) {
      // 실패시 상태 되돌리기
      setIsLiked(!newLiked);
      console.error("Failed to update favorite status:", error);
    }
  }

  return (
    <div className={`flex justify-center`}>
      <div className="w-[80%] h-[60vh] min-h-[450px] p-3 flex flex-col justify-between bg-white rounded-2xl">
        <ReactPlayer
          url={video.url}
          width="100%"
          height="45%"
          playing={true}
          controls={true}
          light={thumbnailUrl}
          style={{ backgroundColor: "black" }}
        />

        <div className="flex w-full justify-between items-center">
          <div className="w-full flex flex-col items-start">
            {video.hasCaption ? (
              <div className="h-5 flex items-center gap-1">
                <IconPremium width={20} height={20} />
                <p className="text-xs font-preSemiBold text-center text-longContent">고품질 레시피</p>
              </div>
            ) : (
              <div className="h-5"></div>
            )}

            <div className="flex w-full justify-between items-center px-1">
              {video.title.length > 30 ? (
                <div className="max-w-[85%] font-preSemiBold text-base marquee-loop-wrapper">
                  <div
                    className="marquee-loop-content"
                    ref={textRef}
                    style={{ animation: `marquee-loop ${duration}s linear infinite` }}
                  >
                    <span>{video.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>{video.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </div>
                </div>
              ) : (
                <p className="max-w-[85%] font-preSemiBold text-base">{video.title}</p>
              )}

              <button className="text-sm" onClick={handleLike}>
                {isLiked ? (
                  <IconHeartFill width={25} height={25} strokeColor="black" />
                ) : (
                  <IconHeart width={25} height={25} strokeColor="black" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
        <VideoInfos duration={video.duration} viewCount={video.viewCount} likeCount={video.likeCount} />
        <div className="w-full flex justify-end items-center gap-2">
          <Button
            type="button"
            design="confirm"
            content="요리하기"
            className="w-24 h-8"
            onAction={() => navigate(`/detailRecipe/${video.recipeId}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
