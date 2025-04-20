import React, { useState } from "react";
import PreferenceSelectedItem from "./PreferenceSelectedItem";
import Input from "@components/common/input/Input";
import Button from "@components/common/button/Button";

interface PreferenceInputsProps {
  type: "EatingHabit" | "LikeIngredient" | "DislikeIngredient";
}

const STATIC_VALUE = {
  EatingHabit: {
    label: "식습관",
    placeholder: "EX. 고단백",
    selectedList: ["채식", "고단백"],
  },
  LikeIngredient: {
    label: "좋아하는 재료",
    placeholder: "EX. 양파",
    selectedList: ["버섯", "파프리카"],
  },
  DislikeIngredient: {
    label: "싫어하는 재료",
    placeholder: "EX. 버섯",
    selectedList: ["돼지고기", "치즈"],
  },
};

const PreferenceInputs = ({ type }: PreferenceInputsProps) => {
  const [value, setValue] = useState("");
  const [selectedList, setSelectedList] = useState(STATIC_VALUE[type].selectedList);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleAddItem = () => {
    if (value) {
      setSelectedList([...selectedList, value]);
      setValue("");
    } else {
      alert("올바른 이름을 입력해 주세요.");
    }
  };

  const handleDeleteItem = (deleteItem: string) => {
    setSelectedList(selectedList.filter((item) => item !== deleteItem));
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-center">
      <div className="w-full flex gap-2 justify-center items-end">
        <Input
          label={STATIC_VALUE[type].label}
          type="text"
          placeHolder={STATIC_VALUE[type].placeholder}
          value={value}
          onChange={onChange}
          labelTextSize="text-lg"
        />
        <Button type="button" design="confirm" content="추가" className="w-20 h-10 mb-1" onAction={handleAddItem} />
      </div>

      <div className="w-full flex gap-2">
        {selectedList &&
          selectedList.map((item) => (
            <PreferenceSelectedItem key={item} value={item} onDelete={() => handleDeleteItem(item)} />
          ))}
      </div>
    </div>
  );
};

export default PreferenceInputs;
