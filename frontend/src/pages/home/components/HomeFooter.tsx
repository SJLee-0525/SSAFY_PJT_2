import { Link } from "react-router-dom";

import useIngredientsStore from "@stores/ingredientsStore";

import Button from "@components/common/button/Button.tsx";
import HomeSelectedIngredients from "@pages/home/components/HomeSelectedIngredients.tsx";

const HomeFooter = ({ isFilterOpen }: { isFilterOpen: boolean }) => {
  const { selectedIngredients } = useIngredientsStore();

  return (
    <div className="relative flex items-center justify-center w-full h-24 px-4">
      {/* 필터가 열려있을 때 터치 방지 */}
      {isFilterOpen && <div className="absolute inset-0 w-full h-full bg-transparent pointer-events-auto z-20" />}

      {selectedIngredients && Object.keys(selectedIngredients).length === 0 ? (
        <Link className="flex items-center justify-center w-full h-full" to="/recipeList/AI">
          <Button type="button" design="confirm" content="AI에게 레시피 추천받기" className="w-full h-10" />
        </Link>
      ) : (
        <HomeSelectedIngredients />
      )}
    </div>
  );
};

export default HomeFooter;
