import ReactPlayer from "react-player";

import useModalStore from "@stores/modalStore";

import IconShare from "@assets/icons/IconShare";

import useRecipeDetail from "@hooks/useRecipeDetail";

import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";
import TimerManager from "@components/common/timer/TimerManager";

import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";
import RecipeQrCode from "@pages/detailRecipe/components/RecipeQrCode";

const DetailRecipeContents = ({ isPortrait }: { isPortrait: boolean }) => {
  const { currentTime, qrIsOpen, playerRef, recipeTimers, detailRecipe, toRecipeList, setCurrentTime, setQrIsOpen } =
    useRecipeDetail();

  const { openModal } = useModalStore();

  //세로모드
  if (isPortrait) {
    return (
      <section className={`relative w-full h-full flex flex-col justify-between items-center gap-2 p-3`}>
        <Header title="레시피" isIcon onClick={toRecipeList} />
        <ReactPlayer
          ref={playerRef}
          url={detailRecipe.url}
          width="100%"
          height="40%"
          playing={true}
          muted={true}
          controls={true}
          light={false}
          pip={true}
          onProgress={(state) => setCurrentTime(state.playedSeconds)}
        />
        <RecipeTitle title={detailRecipe.title} channelTitle={detailRecipe.channelTitle} />

        <RecipeInfos currentTime={currentTime} setCurrentTime={setCurrentTime} playerRef={playerRef} />

        {qrIsOpen && <RecipeQrCode path={window.location.href} onClose={() => setQrIsOpen(false)} />}

        {/* 버튼 컨테이너 */}
        <div className="w-full flex justify-between items-center">
          <TimerManager recipeTimers={recipeTimers} position={{ xPercent: 0.03, yPercent: 0.68 }} />
          <div className="w-full flex justify-end items-center gap-2.5">
            <button
              className="w-10 h-10 flex justify-center items-center bg-content2 rounded-full"
              onClick={() => setQrIsOpen(true)}
            >
              <IconShare width={18} height={18} strokeColor="white" strokeWidth={2} />
            </button>
            <Button
              type="button"
              design="confirm"
              content="요리 종료"
              className="w-24 h-10"
              onAction={() => openModal(<RecipeRatingModal />)}
            />
          </div>
        </div>
      </section>
    );
  }
  //가로모드
  else {
    return (
      <section className={`w-full h-full flex flex-col justify-start items-center gap-2 p-3`}>
        <Header title="레시피" isIcon onClick={toRecipeList} />
        {qrIsOpen && <RecipeQrCode path={window.location.href} onClose={() => setQrIsOpen(false)} />}
        <div className="w-full h-[85%] flex gap-4">
          <div className="w-[60%] h-full flex flex-col justify-start gap-5">
            <ReactPlayer
              ref={playerRef}
              url={detailRecipe.url}
              width="100%"
              height="70%"
              playing={true}
              muted={true}
              controls={true}
              light={false}
              pip={true}
              onProgress={(state) => setCurrentTime(state.playedSeconds)}
            />
            <RecipeTitle title={detailRecipe.title} channelTitle={detailRecipe.channelTitle} />
          </div>

          <div className="w-[40%] h-full flex flex-col justify-between">
            <RecipeInfos currentTime={currentTime} setCurrentTime={setCurrentTime} playerRef={playerRef} />

            {/* 버튼 컨테이너 */}
            <div className="w-full flex justify-end items-center gap-2">
              <TimerManager recipeTimers={recipeTimers} position={{ xPercent: 0.688, yPercent: 0.4 }} />
              <button
                className="w-10 h-10 flex justify-center items-center bg-content2 rounded-full"
                onClick={() => setQrIsOpen(true)}
              >
                <IconShare width={18} height={18} strokeColor="white" strokeWidth={2} />
              </button>
              <Button
                type="button"
                design="confirm"
                content="요리 종료"
                className="px-3 py-2"
                onAction={() => openModal(<RecipeRatingModal />)}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default DetailRecipeContents;
