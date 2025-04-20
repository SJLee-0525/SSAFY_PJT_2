import { useState } from "react";

import { Nutritions } from "@/types/ingredientsTypes";

import IconCloseCircle from "@assets/icons/IconCloseCircle";
import IconInfomation from "@assets/icons/IconInfomation";

const NutritionsInfo = ({ detailInfo }: { detailInfo: Nutritions }) => {
  const [isOpenDetailInfo, setIsOpenDetailInfo] = useState<boolean>(false);

  const allergenInfo = detailInfo.allergenInfo.split(", ");

  // 소수점 둘째 자리까지 반올림
  function mathRound(data: number): number {
    return Math.round(data * 100) / 100;
  }

  return (
    <div className="grid grid-cols-2 w-5/6 h-2/3 gap-5 text-center text-xs font-preLight">
      <table className="w-full h-full text-left">
        <tbody className="w-1/2 h-full">
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">칼로리</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.calories)} kcal</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">탄수화물</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.carbohydrate)} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">단백질</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.protein)} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">지방</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.fat)} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">나트륨</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.sodium)} mg</td>
          </tr>
          <tr>
            <th className="p-1 w-1/2">당류</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.sugars)} g</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full h-5/6 text-left">
        <tbody className="w-1/2 h-full">
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">콜레스테롤</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.cholesterol)} mg</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">포화지방</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.saturatedFat)} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">불포화지방</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.unsaturatedFat)} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1 w-1/2">트랜스지방</th>
            <td className="p-1 w-1/2">{mathRound(detailInfo.transFat)} g</td>
          </tr>
          <tr className="relative cursor-pointer" onClick={() => setIsOpenDetailInfo(!isOpenDetailInfo)}>
            <th className="p-1 w-1/2">알레르기 정보</th>
            <td className="p-1 w-1/2">
              {allergenInfo.length > 2 ? allergenInfo[0] + ", " + allergenInfo[1] + "..." : allergenInfo[0]}
            </td>
            {isOpenDetailInfo && (
              <div
                className="absolute top-full left-0 flex justify-center items-center w-full h-fit p-1 bg-black bg-opacity-50 text-white font-preRegular"
                onClick={() => setIsOpenDetailInfo(false)}
              >
                {detailInfo.allergenInfo}
              </div>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const DetailIngredientImage = ({
  imgSrc,
  altImgSrc,
  detailInfo,
}: {
  imgSrc: string;
  altImgSrc: string;
  detailInfo: Nutritions | null;
}) => {
  const [isOpenDetailInfo, setIsOpenDetailInfo] = useState<boolean>(false);

  function handleDetailInfo() {
    setIsOpenDetailInfo(!isOpenDetailInfo);
  }

  return (
    <div className="relative h-[30vh] w-full overflow-hidden">
      <img
        src={imgSrc}
        alt={imgSrc}
        onError={(event) => (event.currentTarget.src = altImgSrc)} // 경로가 존재하지만, 해당 경로에 이미지가 없을 경우에 대한 에러처리
        className="w-full h-full object-cover object-center"
      />

      {/* 영양 정보 표시 */}
      {detailInfo && isOpenDetailInfo && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 text-white font-preRegular">
          <NutritionsInfo detailInfo={detailInfo} />
        </div>
      )}
      {!detailInfo && isOpenDetailInfo && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 text-white font-preRegular">
          <p>영양 정보가 없습니다.</p>
        </div>
      )}

      {/* 영양 정보 - 사진 전환 버튼 */}
      {isOpenDetailInfo ? (
        <button
          className="absolute bottom-3 right-3 flex justify-between items-center pl-2 pr-3 h-8 gap-2 rounded-3xl bg-white bg-opacity-75 font-preRegular text-sm shadow-lg"
          onClick={handleDetailInfo}
        >
          <IconCloseCircle strokeColor="black" width={15} height={15} />
          <p>닫기</p>
        </button>
      ) : (
        <button
          className="absolute bottom-3 right-3 flex justify-between items-center pl-2 pr-3 h-8 gap-2 rounded-3xl bg-white bg-opacity-75 font-preRegular text-sm shadow-lg"
          onClick={handleDetailInfo}
        >
          <IconInfomation strokeColor="black" width={15} height={15} />
          <p>영양 정보</p>
        </button>
      )}
    </div>
  );
};

export default DetailIngredientImage;
