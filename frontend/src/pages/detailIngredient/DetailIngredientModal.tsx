import { useState, useEffect } from "react";

import { IngredientNutrition } from "@/types/ingredientsTypes";
import { INGREDIENT_WITH_NUTRITIONS } from "@/data/NUTRITIONS";

import useModalStore from "@stores/modalStore";
import { useGetIngredientNutrition } from "@hooks/useIngredientsHooks";

import DetailIngredientImage from "@pages/detailIngredient/components/DetailIngredientImage.tsx";
import DetailIngredientItem from "@pages/detailIngredient/components/DetailIngredientItem.tsx";

import Button from "@components/common/button/Button";

import noImg from "@assets/images/noIngredient/noIngredient.jpg";

const DetailIngredientModal = ({ ingredientId }: { ingredientId: number }) => {
  const { isClosing, closeModal } = useModalStore();

  const [ingredient, setIngredient] = useState<IngredientNutrition>(INGREDIENT_WITH_NUTRITIONS);

  const { data } = useGetIngredientNutrition(ingredientId, !isClosing);

  useEffect(() => {
    if (!isClosing && data) {
      setIngredient(data);
    }
  }, [data]);

  return (
    <>
      {ingredient && (
        <div className="relative">
          <DetailIngredientImage
            imgSrc={ingredient.imageUrl ? ingredient.imageUrl : noImg}
            altImgSrc={noImg}
            detailInfo={ingredient.nutrients}
          />

          {/* 선택된 식재료 현황 */}
          <div className="flex justify-between items-center w-full h-14 px-6 py-2 font-preSemiBold">
            <h1 className="m-0 text-xl">{ingredient.name}</h1>
            <h1 className="m-0 text-xl">{ingredient.totalCount}개</h1>
          </div>

          {/* 선택된 식재료 상세 목록  */}
          <div className="w-full h-fit px-2">
            <div className="flex h-[35vh] max-h-[35vh] items-start content-start px-4 gap-y-5 shrink-0 flex-wrap font-preMedium bg-[#EEE] rounded-xl overflow-y-auto">
              <table className="w-full font-preRegular text-center text-xs">
                <thead className="sticky top-0  bg-[#EEE] z-10">
                  <tr className="h-10 border-b-2 border-gray-300">
                    <th colSpan={2} className="w-4/5">
                      만료 시간
                    </th>
                    <th className="w-1/5">위치</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredient.ingredients &&
                    ingredient.ingredients.map((item, index) => {
                      return <DetailIngredientItem key={item.ingredientId} ingredient={item} index={index} />;
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end align-center px-4 py-4 gap-2">
            <Button type="button" design="confirm" content="닫기" onAction={closeModal} className="w-24 h-10"></Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailIngredientModal;
