import { useNavigate } from "react-router-dom";

import useUserStore from "@stores/userStore";
import useModalStore from "@stores/modalStore";
import { useDeleteMember } from "@hooks/useUserHook";

import ProfileChangeModal from "@components/profile/ProfileChangeModal";

import IconHistory from "@assets/icons/IconHistory";
import IconHeart from "@assets/icons/IconHeart";
import IconUserRemove from "@assets/icons/IconUserRemove";

const SettingMenus = () => {
  const navigate = useNavigate();

  const { userId } = useUserStore();
  const { openModal } = useModalStore();

  const { mutate: deleteUserRequest } = useDeleteMember();

  const BANNER_CLASS = "flex flex-col items-start";
  const TITLE_CLASS = "text-lg font-preSemiBold";
  const DESCRIPTION_CLASS = "text-sm font-preRegular break-keep";
  const BUTTON_CLASS = "w-[90%] h-24 bg-white rounded-lg shadow-md flex items-center px-4 gap-4";

  function handleDeleteUser() {
    // 유저 정보 삭제 API 호출
    if (confirm("정말 유저 프로필을 삭제하시겠습니까?")) {
      deleteUserRequest(userId, {
        onSuccess: () => {
          alert("성공적으로 삭제되었습니다.");
          openModal(<ProfileChangeModal />);
          navigate("/");
        },
        onError: () => {
          alert("유저 프로필 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        },
      });
    }
  }

  return (
    <div className="w-full h-[60%] flex flex-col items-center justify-center gap-8">
      <button className={BUTTON_CLASS} onClick={() => navigate("/setting/favorite")}>
        <IconHeart width={30} height={30} />
        <div className={BANNER_CLASS}>
          <p className={TITLE_CLASS}>즐겨찾는 레시피</p>
          <p className={DESCRIPTION_CLASS}>찜해놓은 레시피를 모아볼 수 있어요.</p>
        </div>
      </button>
      <button className={BUTTON_CLASS} onClick={() => navigate("/setting/history")}>
        <IconHistory width={30} height={30} />
        <div className={BANNER_CLASS}>
          <p className={TITLE_CLASS}>이전 레시피</p>
          <p className={DESCRIPTION_CLASS}>과거에 요리했던 레시피를 모아볼 수 있어요.</p>
        </div>
      </button>
      {userId > 1 && (
        <button className={BUTTON_CLASS} onClick={handleDeleteUser}>
          <IconUserRemove width={30} height={30} />
          <div className={BANNER_CLASS}>
            <p className={TITLE_CLASS}>유저 프로필 삭제</p>
            <p className={DESCRIPTION_CLASS}>프로필 정보를 삭제할 수 있어요.</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default SettingMenus;
