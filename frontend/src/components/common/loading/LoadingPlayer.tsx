import { useEffect, useState, useMemo } from "react";

import book from "@assets/images/loading/book.gif";
import cutting from "@assets/images/loading/cutting.gif";
import egg from "@assets/images/loading/egg.gif";
import fritada from "@assets/images/loading/fritada.gif";
import pot from "@assets/images/loading/pot.gif";
import seasoning from "@assets/images/loading/seasoning.gif";

const LOADING_IMAGE_LIST = [book, cutting, egg, fritada, pot, seasoning];
const LOADING_COOK_TIP_LIST = [
  "계란을 전자레인지에 돌리면 폭발해요!",
  "파스타를 삶을 때 소금을 넣으면 더 맛있어요!",
  "고기를 구울 때는 팬이 충분히 뜨거워야 해요!",
  "감자를 삶을 때 식초를 조금 넣으면 부서지지 않아요!",
  "양파를 썰기 전에 냉장고에 넣어두면 눈물이 덜 나요!",
  "생선을 구울 때 레몬즙을 뿌리면 비린내가 줄어들어요!",
  "밥을 지을 때 버터를 한 조각 넣으면 더 고소해요!",
  "빵을 오래 보관하려면 냉동실에 넣어두세요!",
  "마늘을 쉽게 까려면 전자레인지에 10초 돌려보세요!",
  "채소를 데칠 때 소금을 넣으면 색이 더 선명해져요!",
];

const LoadingPlayer = () => {
  const [currentImage, setCurrentImage] = useState(LOADING_IMAGE_LIST[0]);
  const [fade, setFade] = useState(true);
  const [cookTip, setCookTip] = useState(LOADING_COOK_TIP_LIST[0]);

  // useMemo를 사용해 이미지 변경 시에만 새로운 좌표 생성
  const corner = useMemo(() => ({ x: Math.random() * 100, y: Math.random() * 100 }), [currentImage]);

  // 이미지 변경 및 fade 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        let newImage;
        do {
          newImage = LOADING_IMAGE_LIST[Math.floor(Math.random() * LOADING_IMAGE_LIST.length)];
        } while (newImage === currentImage);

        setCurrentImage(newImage);
        setFade(true);
      }, 800);
    }, 2500);

    return () => clearInterval(interval);
  }, [currentImage]);

  //요리 팁 전환
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCookTip((prevTip) => {
        let newTip;
        do {
          newTip = LOADING_COOK_TIP_LIST[Math.floor(Math.random() * LOADING_COOK_TIP_LIST.length)];
        } while (newTip === prevTip);
        return newTip;
      });
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <section className="flex flex-col py-20 px-10 gap-20 items-center justify-around h-full bg-white rounded-2xl">
      <div className="flex flex-col gap-8 items-center justify-center bg-white">
        <img
          src={currentImage}
          alt="Random GIF"
          className="w-[50vw]"
          style={{
            clipPath: fade ? `circle(150% at ${corner.x}% ${corner.y}%)` : `circle(0% at ${corner.x}% ${corner.y}%)`,
            transition: "clip-path 0.8s ease",
          }}
        />
        <div className="flex flex-col gap-4 items-center justify-center">
          <p className="text-xl font-preExtraBold text-primary">맛있는 요리를 만드는 중이에요!</p>
          <p className="text-xl font-preExtraBold text-primary">잠시만 기다려 주세요</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-lg font-preBold text-longContent">알고 계셨나요?</p>
        <p className="w-full text-center text-base font-preSemiBold text-longContent break-keep">{cookTip}</p>
      </div>
    </section>
  );
};

export default LoadingPlayer;
