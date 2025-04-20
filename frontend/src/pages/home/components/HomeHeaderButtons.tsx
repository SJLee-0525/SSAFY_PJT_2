import { useEffect } from "react";

import useModalStore from "@stores/modalStore.ts";
import useUserStore from "@stores/userStore.ts";

import { useGetMemberList } from "@hooks/useUserHook";

import Button from "@components/common/button/Button";

import StoreIngredientModal from "@pages/storeIngredient/StoreIngredientModal";

import ProfileModal from "@components/profile/ProfileModal";

import defaultProfile from "@assets/images/DefaultProfile.png";

const HomeHeaderButtons = () => {
  const { openModal } = useModalStore();
  const { userId, currentProfileImg, setUserId, setUserName, setCurrentProfileImg } = useUserStore();

  const { data: profiles } = useGetMemberList();

  // 만약 설정된 프로필이 없을 경우, 첫번째 가족 구성원의 정보를 설정
  useEffect(() => {
    if (userId === 0 && profiles && profiles.length > 0) {
      setUserId(profiles[0].memberId);
      setUserName(profiles[0].membername);

      // 추후 프로필 이미지 관련해서 수정해야함 (이미지 서버가 열린다면..)
      setCurrentProfileImg(defaultProfile);
    }
  }, [profiles]);

  return (
    <div className="flex h-fit justify-between items-center gap-2">
      <button
        className="flex flex-1 w-10 aspect-[1/1] bg-white rounded-full items-center justify-center"
        onClick={() => openModal(<ProfileModal />)}
      >
        <img
          src={`${currentProfileImg}`}
          alt="profile"
          onError={(event) => (event.currentTarget.src = defaultProfile)}
          className="w-full h-full rounded-full object-cover"
        />
      </button>

      <Button
        type="button"
        design="confirm"
        content="입고"
        className="w-10 aspect-[1/1]"
        onAction={() => openModal(<StoreIngredientModal />)}
      />
    </div>
  );
};

export default HomeHeaderButtons;
