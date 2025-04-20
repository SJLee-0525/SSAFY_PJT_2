import { useState } from "react";
import ArrowLeft from "@assets/icons/ArrowLeft";
import ArrowRight from "@assets/icons/ArrowRight";

const CATEGORY = ["한식", "중식", "일식", "양식"];

const PreferenceCategory = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  //이전으로
  function goToPrevious() {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 3 : prevIndex - 1));
  }

  //다음으로
  function goToNext() {
    setCurrentIndex((prevIndex) => (prevIndex === 3 ? 0 : prevIndex + 1));
  }

  return (
    <div className="w-full flex justify-between items-center">
      <p className="w-[30%] font-preBold text-lg">카테고리</p>
      <div className="w-[50%] flex justify-between">
        <ArrowLeft width={25} height={25} strokeColor="#292D32" onClick={goToPrevious} />
        <div className="w-[30%] flex justify-between text-center overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {CATEGORY.map((category) => (
              <p key={category} className="w-full flex-shrink-0 font-preSemiBold text-lg">
                {category}
              </p>
            ))}
          </div>
        </div>

        <ArrowRight width={25} height={25} strokeColor="#292D32" onClick={goToNext} />
      </div>
    </div>
  );
};

export default PreferenceCategory;
