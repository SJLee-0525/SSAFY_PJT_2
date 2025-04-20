import { SelectedIngredients } from "@/types/ingredientsTypes";

import noImg from "@assets/images/noIngredient/noIngredient.jpg";

interface HomeIngredientProps {
  ingredient: SelectedIngredients;
}

const TakeoutIngredient = ({ ingredient }: HomeIngredientProps) => {
  return (
    <div className="flex flex-col w-1/5 h-fit p-1 justify-center items-center ">
      {/* 아이콘 부분 */}
      <div className="relative w-full aspect-[1/1] rounded-3xl">
        <img
          src={ingredient.imageUrl ? ingredient.imageUrl : noImg}
          alt={ingredient.imageUrl}
          onError={(event) => (event.currentTarget.src = noImg)}
          className="w-full aspect-[1/1] object-cover rounded-3xl"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent rounded-b-3xl" />
        <p
          className="absolute bottom-0.5 w-full font-preMedium text-xs text-center text-white"
          style={{
            textShadow: "0.5px 0 black, 0 0.5px black, -0.5px 0 black, 0 -0.5px black",
          }}
        >
          {ingredient.name}
        </p>
      </div>

      {/* 개수 출력 */}
      <div className="flex w-full justify-center items-center p-1">
        <span className="font-preSemiBold text-center">{ingredient.selectedCount}개</span>
      </div>
    </div>
  );
};

export default TakeoutIngredient;
