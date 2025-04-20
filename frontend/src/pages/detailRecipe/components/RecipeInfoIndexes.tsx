import { RecipeInfoKeys } from "@/types/recipeListTypes";
import RecipeInfoIndex from "@pages/detailRecipe/components/RecipeInfoIndex";

interface RecipeInfoIndexesProps {
  selectedIndex: RecipeInfoKeys;
  setSelectedIndex: (index: RecipeInfoKeys) => void;
  isAutoScroll: boolean;
  setIsAutoScroll: (isAutoScroll: boolean) => void;
}

const RecipeInfoIndexes = ({
  selectedIndex,
  setSelectedIndex,
  isAutoScroll,
  setIsAutoScroll,
}: RecipeInfoIndexesProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-[75%]">
        <RecipeInfoIndex
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          text="영상 정보"
          type="video_infos"
        />
        <RecipeInfoIndex
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          text="레시피 단계"
          type="cooking_sequence"
        />
        <RecipeInfoIndex
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          text="재료 정보"
          type="ingredients"
        />
        <RecipeInfoIndex
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          text="요리 꿀팁"
          type="cooking_tips"
        />
      </div>

      <div className="flex w-[25%] justify-end items-center gap-1 landscape:flex-col landscape:items-end">
        <p className="text-xs font-preSemiBold text-longContent text-end break-keep"> 자동 스크롤 </p>
        <button
          className={`text-xs ${isAutoScroll ? "font-preBold text-primary" : "font-preMedium text-content2"}`}
          onClick={() => setIsAutoScroll(!isAutoScroll)}
        >
          {/* 자동 스크롤 */}
          {isAutoScroll ? " ON" : " OFF"}
        </button>
      </div>
    </div>
  );
};

export default RecipeInfoIndexes;
