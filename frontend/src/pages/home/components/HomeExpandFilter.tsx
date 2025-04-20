import React from "react";

import { FilterElementProps, IngredientsPreferenceProps } from "@/types/filterTypes.ts";

import useIngredientsStore from "@stores/ingredientsStore";

import IngredientInput from "@components/common/input/IngredientInput";
import Button from "@components/common/button/Button";
import FilterButton from "@components/common/button/FilterButton";
import IngredientButton from "@components/common/button/IngredientButton";

const FilterElement = ({ type, content, keys, elements, onSetFilter, onClear }: FilterElementProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center h-8 border-content">
        <span className="text-sm font-preBold">{content}</span>
        <button onClick={() => onClear(type)} className="text-xs font-preRegular text-content2">
          초기화
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {keys &&
          keys.map((elem, index) => (
            <FilterButton
              key={index}
              isSelected={elements.includes(elem)}
              content={elem}
              onAction={() => onSetFilter(type, elem)}
            />
          ))}
      </div>
    </div>
  );
};

const IngredientsPreference = ({
  type,
  label,
  placeHolder,
  selectedList,
  onSetFilter,
  onClear,
}: IngredientsPreferenceProps) => {
  function handleAddItem(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const ingredient = Object.fromEntries(fd.entries()).ingredient as string;

    if (ingredient) {
      const oppositeType = type === "preferredIngredients" ? "dislikedIngredients" : "preferredIngredients";

      if (selectedList[type].includes(ingredient)) {
        alert("이미 선택된 재료입니다.");
        return;
      }

      if (selectedList[oppositeType].includes(ingredient)) {
        alert(
          type === "preferredIngredients"
            ? "이미 싫어하는 재료로 선택된 재료입니다."
            : "이미 좋아하는 재료로 선택된 재료입니다."
        );
        return;
      }

      onSetFilter(type, ingredient);
      event.currentTarget.reset();
    } else {
      alert("올바른 재료를 입력해 주세요.");
    }
  }

  return (
    <div className="mb-4">
      {/* 입력 그룹 */}
      <div className="mb-2">
        <div className="flex justify-between items-center h-8 border-content">
          <span className="text-sm font-preBold">{label}</span>
          <button onClick={() => onClear(type)} className="text-xs font-preRegular text-content2">
            초기화
          </button>
        </div>
        <form onSubmit={handleAddItem} className="w-full flex gap-4 justify-center items-center">
          <IngredientInput name="ingredient" type="text" placeHolder={placeHolder} labelTextSize="text-lg" />
          <Button type="submit" design="confirm" content="추가" className="w-1/5 h-12" />
        </form>
      </div>

      {/* 출력 그룹 */}
      <div className="w-full h-fit flex gap-2 overflow-x-auto">
        {selectedList[type] &&
          selectedList[type].map((item, index) => (
            <IngredientButton
              key={index}
              isSelected={type === "preferredIngredients" ? true : false}
              content={item}
              onAction={() => onSetFilter(type, item)}
            />
          ))}
      </div>
    </div>
  );
};

const HomeExpandFilter = () => {
  const { filteringInfomationKeys, filteredInfomations, setFilteredInfomations, setClearFilteredInfomations } =
    useIngredientsStore();

  return (
    <div className="absolute top-9 left-0 w-full bg-white shadow-md z-30 px-4 py-2 font-preMedium">
      <IngredientsPreference
        type={"preferredIngredients"}
        label="좋아하는 재료"
        placeHolder="좋아하는 재료를 입력해주세요."
        selectedList={filteredInfomations}
        onSetFilter={setFilteredInfomations}
        onClear={setClearFilteredInfomations}
      />
      <IngredientsPreference
        type={"dislikedIngredients"}
        label="싫어하는 재료"
        placeHolder="싫어하는 재료를 입력해주세요."
        selectedList={filteredInfomations}
        onSetFilter={setFilteredInfomations}
        onClear={setClearFilteredInfomations}
      />
      <FilterElement
        type={"categories"}
        content="카테고리"
        keys={filteringInfomationKeys.categories}
        elements={filteredInfomations.categories}
        onSetFilter={setFilteredInfomations}
        onClear={setClearFilteredInfomations}
      />
      <FilterElement
        type={"dietaries"}
        content="선호 식단"
        keys={filteringInfomationKeys.dietaries}
        elements={filteredInfomations.dietaries}
        onSetFilter={setFilteredInfomations}
        onClear={setClearFilteredInfomations}
      />
      <FilterElement
        type={"allergies"}
        content="알레르기"
        keys={filteringInfomationKeys.allergies}
        elements={filteredInfomations.allergies}
        onSetFilter={setFilteredInfomations}
        onClear={setClearFilteredInfomations}
      />
    </div>
  );
};

export default HomeExpandFilter;
