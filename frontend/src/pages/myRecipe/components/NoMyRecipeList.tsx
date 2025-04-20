import { useNavigate } from "react-router-dom";
import Button from "@components/common/button/Button";
import IconClipboard from "@assets/icons/IconClipboard";

const NoMyRecipeList = ({ text }: { text: string }) => {
  const navigate = useNavigate();
  return (
    <section className="w-full h-full flex flex-col py-20 px-10 gap-20 items-center justify-around  bg-offWhite rounded-2xl">
      <div className="flex flex-col gap-8 items-center justify-center">
        <IconClipboard width={120} height={120} />
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl font-preBold">{text} 레시피가 없습니다.</h1>
          <p className="text-base font-preMedium text-content2">레시피를 찾으러 가볼까요?</p>
        </div>
      </div>
      <Button
        type="button"
        design="confirm"
        content="재료 선택하러 가기"
        className="w-[90%] h-10"
        onAction={() => {
          navigate("/");
        }}
      />
    </section>
  );
};

export default NoMyRecipeList;
