import { useState } from "react";

import { Ingredient } from "@/types/ingredientsTypes.ts";

import { formatDate, calculateDaysRemaining } from "@utils/getFormattedDate";

interface IngredientingredientProps {
  ingredient: Ingredient;
  index: number;
}

const DetailIngredientItem = ({ ingredient, index }: IngredientingredientProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const incomingDate = formatDate(new Date(ingredient.incomingDate));
  const expirationDate = formatDate(new Date(ingredient.expirationDate));
  const [remaining, isImminent] = calculateIsImminient();

  function calculateIsImminient(): [string, boolean] {
    const diffDays = calculateDaysRemaining(ingredient.expirationDate);

    let remaining = "";
    if (diffDays < 0) {
      remaining = "D+" + String(diffDays).slice(1);
    } else if (diffDays === 0) {
      remaining = "D-Day";
    } else {
      remaining = "D-" + String(diffDays);
    }

    let isImminent = false;
    if (diffDays <= 2) {
      isImminent = true;
    }

    return [remaining, isImminent];
  }

  return (
    <>
      <tr
        key={ingredient.ingredientId}
        className={`h-8 font-preRegular ${index > 0 ? "border-t border-gray-300" : ""}`}
        onClick={() => setIsClicked(!isClicked)}
        onBlur={() => setIsClicked(false)}
      >
        <td className={`font-preBold ${isImminent ? "text-error" : "text-primaryDark"}`}>{remaining}</td>
        <td className="font-preMedium">{expirationDate}</td>
        <td className="text-primaryDark font-preBold">{ingredient.storagePlace === "fridge" ? "냉장실" : "냉동실"}</td>
      </tr>
      {isClicked && (
        <tr className="h-8 bg-black/5 font-preRegular text-xs">
          <td className="font-preMedium">입고</td>
          <td className="font-preMedium">{incomingDate}</td>
          <td />
        </tr>
      )}
    </>
  );
};

export default DetailIngredientItem;
