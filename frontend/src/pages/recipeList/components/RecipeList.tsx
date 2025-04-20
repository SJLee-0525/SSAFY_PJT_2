import { useState } from "react";

import MenuList from "@pages/recipeList/components/RecipeMenuList";
// import Carousel from "@pages/recipeList/components/RecipeCarousel";
import Carousel from "@/pages/recipeList/components/RecipeCarouselLive";

import recipeStore from "@stores/recipeStore";

const RecipeList = ({ DISHES }: { DISHES: string[] }) => {
  const { recipeList } = recipeStore();
  const VIDEOS = recipeList.videos;

  const [selectedDish, setSelectedDish] = useState<keyof typeof VIDEOS | string>(DISHES.length > 0 ? DISHES[0] : "");

  return (
    <section className="h-full flex flex-col">
      <MenuList dishes={DISHES} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
      {
        //메뉴 리스트는 있는데 selectedDish가 없을 때
        DISHES.length > 0 && !selectedDish && (
          <div className="text-xl font-preBold flex items-center justify-center h-full">
            원하는 레시피를 선택해주세요
          </div>
        )
      }
      {VIDEOS[selectedDish] && VIDEOS[selectedDish].length > 0 && (
        <Carousel selectedDish={selectedDish} videos={VIDEOS[selectedDish]} />
      )}
    </section>
  );
};

export default RecipeList;
