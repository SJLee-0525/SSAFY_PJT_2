import { useCallback, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { recipeCookingSequenceInfo } from "@/types/recipeListTypes";

interface RecipeTextsProps {
  recipe: recipeCookingSequenceInfo;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  playerRef: React.RefObject<ReactPlayer>;
  isAutoScroll: boolean;
}

const RecipeTexts = ({ recipe, currentTime, setCurrentTime, playerRef, isAutoScroll }: RecipeTextsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 스텝 클릭 시, 해당 시간의 영상을 재생
  function handleClickInstr(step: string, timestamp: number) {
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement && sectionRef.current) {
      stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentTime(timestamp);
      playerRef.current?.seekTo(timestamp);
    }
  }

  // 현재 시간에 해당하는 스텝 찾기
  const getCurrentStep = useCallback(() => {
    let currentStep = "";

    Object.entries(recipe).forEach(([step, instructions]) => {
      const timestamp = instructions.timestamp;
      if (timestamp <= currentTime) {
        currentStep = step;
      }
    });

    return currentStep;
  }, [recipe, currentTime]);

  // 현재 스텝으로 자동 스크롤
  useEffect(() => {
    const currentStep = getCurrentStep();

    const stepElement = document.getElementById(`step-${currentStep}`);
    if (isAutoScroll && stepElement && sectionRef.current) {
      stepElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentTime]);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center gap-6 w-full portrait:max-h-[40%] landscape:max-h-[90%] px-3 py-4 overflow-y-auto"
    >
      {recipe &&
        Object.entries(recipe).map(([step, instructions], index) => {
          const isCurrentStep = step === getCurrentStep();
          return (
            <div
              id={`step-${step}`}
              key={step}
              className="w-full flex flex-col justify-start items-start gap-2"
              onClick={() => handleClickInstr(step, instructions.timestamp)}
            >
              {step !== "자막이 너무 짧아 레시피 요약에 충분하지 않습니다." ? (
                <h3
                  className={`text-base ${isCurrentStep ? "font-preBold text-black" : "font-preMedium text-content2"}`}
                >
                  {index + 1}. {step}
                </h3>
              ) : (
                <h3 className="w-full text-center text-base font-preSemiBold text-black">{step}</h3>
              )}
              <ul className="flex flex-col">
                {instructions &&
                  instructions.sequence.map((instruction, i) => (
                    <li
                      key={i}
                      className={`text-sm ${isCurrentStep ? "font-preBold text-black" : "font-preMedium text-content2"} break-keep`}
                    >
                      {instruction}
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
    </section>
  );
};

export default RecipeTexts;
