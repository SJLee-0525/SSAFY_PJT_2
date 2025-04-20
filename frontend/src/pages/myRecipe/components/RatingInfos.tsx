import IconHeart from "@assets/icons/IconHeart";
import IconHeartFill from "@assets/icons/IconHeartFill";
import IconStarBlank from "@assets/icons/IconStarBlank";
import IconStarFill from "@assets/icons/IconStarFill";

const RatingInfos = ({ favorite, rating }: { favorite: boolean; rating: number }) => {
  return (
    <div className="flex justify-end items-center w-1/4 gap-2.5 font-preBold text-sm">
      {favorite ? (
        <IconHeartFill width={17} height={17} />
      ) : (
        <IconHeart width={15} height={15} strokeColor="#202020" strokeWidth={2} />
      )}

      {rating > 0 ? (
        <span className="flex items-center gap-1">
          <IconStarFill width={15} height={15} />
          <p>{rating}.0</p>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <IconStarBlank width={15} height={15} />
          <p>0.0</p>
        </span>
      )}
    </div>
  );
};

export default RatingInfos;
