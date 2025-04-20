import "pages/home/Home.css";

import { useState } from "react";

import useIngredientsStore from "@stores/ingredientsStore";
import useModalStore from "@stores/modalStore";

import Button from "@components/common/button/Button";

import TakeoutIngredientModal from "@pages/takeoutIngredient/TakeoutIngredientModal";

import IconTrash from "@assets/icons/IconTrash";
import noImg from "@assets/images/noIngredient/noIngredient.jpg";

const HomeSelectedIngredients = () => {
  const { selectedIngredients, setRemoveSelectedIngredients } = useIngredientsStore();
  const { openModal } = useModalStore();

  const [pinchIngredientId, setPinchIngredientId] = useState<number | null>(null);

  function removeIngredient(ingredientInfoId: number) {
    setPinchIngredientId(ingredientInfoId);
    setTimeout(() => {
      setRemoveSelectedIngredients(ingredientInfoId);
      setPinchIngredientId(null);
    }, 300);
  }

  return (
    <div className="flex justify-between items-center w-full h-full px-2 bg-white rounded-xl">
      <div className="grid grid-flow-col auto-cols-max w-4/5 h-fit gap-2 overflow-x-auto">
        {selectedIngredients &&
          Object.values(selectedIngredients).map((ingredient) => (
            <div key={ingredient.ingredientInfoId} className="w-12 aspect-[1/1]">
              <div
                className={`relative w-full aspect-[1/1] rounded-3xl ${
                  pinchIngredientId === ingredient.ingredientInfoId ? "pinch-in" : ""
                }`}
              >
                <img
                  src={ingredient.imageUrl ? ingredient.imageUrl : noImg}
                  alt={ingredient.imageUrl}
                  onError={(event) => (event.currentTarget.src = noImg)}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <span
                  className="absolute flex justify-center items-center right-0 top-0 bg-error p-1 rounded-3xl cursor-pointer"
                  onClick={() => removeIngredient(ingredient.ingredientInfoId)}
                >
                  <IconTrash width={12} height={12} strokeColor="white" className="cursor-pointer" />
                </span>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center items-center w-1/5 h-full">
        <Button
          type="button"
          design="confirm"
          content="출고"
          className="w-12 aspect-[1/1]"
          onAction={() => openModal(<TakeoutIngredientModal />)}
        />
      </div>
    </div>
  );
};

export default HomeSelectedIngredients;
