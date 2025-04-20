import React, { useState, useEffect } from "react";

import { InputProps } from "@/types/commonProps.ts";
import { IngredientsSearchInfo } from "@/types/ingredientsTypes.ts";

import { useDebounce } from "@hooks/useDebounceHook";

import { searchIngredientsApi } from "@apis/ingredientApi";

import noImg from "@assets/images/noIngredient/noIngredient.jpg";

const Suggestion = ({
  suggestion,
  onSelectSuggestion,
}: {
  suggestion: IngredientsSearchInfo;
  onSelectSuggestion: (suggestion: string) => void;
}) => {
  return (
    <li
      key={suggestion.id}
      className="flex justify-start items-center h-12 px-3 py-2 gap-3 cursor-pointer hover:bg-gray-100"
      onMouseDown={() => onSelectSuggestion(suggestion.name)}
    >
      <span className="h-full aspect-[1/1] rounded-xl">
        <img
          src={suggestion.imageUrl ? suggestion.imageUrl : noImg}
          alt="no image"
          onError={(event) => (event.currentTarget.src = noImg)}
          className="h-full aspect-[1/1] object-cover rounded-3xl"
        />
      </span>
      <span className="font-preRegular">{suggestion.name}</span>
    </li>
  );
};

const IngredientInput = ({ label, name, type, placeHolder, labelTextSize }: InputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<IngredientsSearchInfo[] | []>([]);

  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!isFocused) return;

    let isCancelled = false;

    async function fetchSuggestion() {
      const suggestions = await searchIngredientsApi(debouncedInputValue);
      if (!isCancelled) {
        setFilteredSuggestions(suggestions);
      }
    }

    fetchSuggestion();

    // 컴포넌트가 언마운트되면 이전 요청 취소
    return () => {
      isCancelled = true;
    };
  }, [debouncedInputValue, isFocused]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="relative flex flex-col w-full items-start justify-between gap-2">
      {label && <label className={`font-preMedium text-[#333] ${labelTextSize} font-semibold text-xs`}>{label}</label>}
      <input
        name={name}
        type={type}
        placeholder={placeHolder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-3 py-1 h-12 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400"
        autoComplete="off"
      />

      {/* 자동 완성 */}
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full max-h-60 z-10 bg-white border border-gray-300 rounded-lg shadow-md overflow-y-auto">
          {filteredSuggestions &&
            filteredSuggestions.map((suggestion) => (
              <Suggestion key={suggestion.id} suggestion={suggestion} onSelectSuggestion={handleSelectSuggestion} />
            ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientInput;
