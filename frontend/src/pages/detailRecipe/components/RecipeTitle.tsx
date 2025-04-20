interface RecipeTitleProps {
  title: string;
  channelTitle: string;
}

const RecipeTitle = ({ title, channelTitle }: RecipeTitleProps) => {
  return (
    <div className="w-full flex justify-between px-2">
      {/* 영상 제목 및 채널 이름 표시 */}
      <div className="w-full flex flex-col gap-1">
        <p className="line-clamp-2 font-preSemiBold text-base landscape:text-sm">{title}</p>
        <p className="text-sm landscape:text-xs font-preSemiBold text-content">{channelTitle}</p>
      </div>
    </div>
  );
};

export default RecipeTitle;
