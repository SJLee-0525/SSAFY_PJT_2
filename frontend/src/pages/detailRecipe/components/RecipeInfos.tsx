import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

import VideoInfos from "@components/common/videoInfo/VideoInfos";

import RecipeInfoIndexes from "@pages/detailRecipe/components/RecipeInfoIndexes";
import RecipeTexts from "@pages/detailRecipe/components/RecipeTexts";

import { recipeIngredientsInfo, RecipeInfoKeys } from "@/types/recipeListTypes";

import recipeStore from "@stores/recipeStore";

import { getRecipeTextApi } from "@apis/recipeApi";

interface RecipeInfosProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  playerRef: React.RefObject<ReactPlayer>;
}

const RecipeInfos = ({ currentTime, setCurrentTime, playerRef }: RecipeInfosProps) => {
  const { recipeId } = useParams();
  const [selectedIndex, setSelectedIndex] = useState<RecipeInfoKeys>("video_infos");

  // recipeStore 구독
  const { detailRecipe, hasFetchedDetailRecipe, setDetailRecipe } = recipeStore();

  // 로컬 상태로 텍스트 레시피 데이터를 관리하여 변경 감지
  const [textRecipeData, setTextRecipeData] = useState(detailRecipe.textRecipe);

  //자동 스크롤
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  //로딩 메시지
  const LoadingMessage: Record<RecipeInfoKeys, string> = {
    video_infos: "비디오 정보를 로딩 중입니다...",
    cooking_sequence: "레시피를 추출 중입니다...",
    ingredients: "재료를 파악 중입니다...",
    cooking_tips: "요리 꿀팁을 생성 중입니다...",
  };

  async function getRecipeText() {
    try {
      const response = await getRecipeTextApi(Number(recipeId));

      setDetailRecipe(response);

      return response;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  //detailrecipe가 추출된 상태에서, textRecipe가 없으면 텍스트 추출
  useEffect(() => {
    if (!hasFetchedDetailRecipe) return; // 응답 오기 전이면 무시

    const detailRecipeCheck =
      detailRecipe.recipeId !== 0 &&
      detailRecipe.textRecipe &&
      detailRecipe.textRecipe?.title &&
      detailRecipe.textRecipe?.cooking_sequence &&
      detailRecipe.textRecipe?.ingredients &&
      detailRecipe.textRecipe?.cooking_tips;

    if (!detailRecipeCheck || detailRecipeCheck === null) {
      getRecipeText();
    }
  }, [hasFetchedDetailRecipe, detailRecipe]);

  // store의 textRecipe가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setTextRecipeData(detailRecipe.textRecipe);
  }, [detailRecipe.textRecipe]);

  //탭 내용 스타일 클래스
  function getItemClassName(isRecipeExtracted: boolean) {
    return `px-4 py-2 landscape:text-xs font-preSemiBold break-keep ${
      isRecipeExtracted
        ? "text-sm rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
        : "text-base"
    } `;
  }

  // 탭 컨텐츠 렌더링 함수
  function renderTabContent() {
    // 데이터가 없는 경우 로딩 메시지 표시
    if (!textRecipeData) {
      return <p className="text-base font-preSemiBold">{LoadingMessage[selectedIndex] || "로딩 중..."}</p>;
    }

    switch (selectedIndex) {
      case "video_infos":
        return (
          <VideoInfos
            duration={detailRecipe.duration}
            likeCount={detailRecipe.likeCount}
            viewCount={detailRecipe.viewCount}
          />
        );

      case "cooking_sequence":
        return textRecipeData.cooking_sequence ? (
          <RecipeTexts
            recipe={textRecipeData.cooking_sequence}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            playerRef={playerRef}
            isAutoScroll={isAutoScroll}
          />
        ) : (
          <p className="text-base font-preSemiBold">{LoadingMessage.cooking_sequence}</p>
        );

      case "ingredients":
        return textRecipeData.ingredients ? (
          <>
            {textRecipeData.ingredients.map((item: recipeIngredientsInfo) => (
              <div
                key={item.name + item.quantity}
                className={getItemClassName(item.name !== "텍스트 추출이 불가능한" || item.quantity !== "영상입니다.")}
              >
                {item.name} {item.quantity}
              </div>
            ))}
          </>
        ) : (
          <p className="text-base font-preSemiBold">{LoadingMessage.ingredients}</p>
        );

      case "cooking_tips":
        return textRecipeData.cooking_tips ? (
          <>
            {textRecipeData.cooking_tips.map((tip: string, index: number) => (
              <div
                key={index}
                className={getItemClassName(tip !== "자막이 너무 짧아 레시피 요약에 충분하지 않습니다.")}
              >
                {tip}
              </div>
            ))}
          </>
        ) : (
          <p className="text-base font-preSemiBold">{LoadingMessage.cooking_tips}</p>
        );

      default:
        return null;
    }
  }
  return (
    <>
      <section className="w-full landscape:h-3/4 portrait:h-[30%] flex flex-col items-center justify-start">
        <RecipeInfoIndexes
          selectedIndex={selectedIndex}
          setSelectedIndex={(index: RecipeInfoKeys) => setSelectedIndex(index)}
          isAutoScroll={isAutoScroll}
          setIsAutoScroll={setIsAutoScroll}
        />
        <div className="w-full landscape:h-fit portrait:h-fit overflow-y-auto p-4 bg-white rounded-b-xl rounded-tr-xl shadow-md">
          <div className="flex flex-wrap h-fit justify-center items-center gap-2 ">{renderTabContent()}</div>
        </div>
      </section>
    </>
  );
};

export default RecipeInfos;
