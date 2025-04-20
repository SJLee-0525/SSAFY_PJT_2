import { useNavigate } from "react-router-dom";

import useModalStore from "@stores/modalStore";
import useUserStore from "@stores/userStore";

import ProfileChangeModal from "@components/profile/ProfileChangeModal";

import defaultProfile from "@assets/images/DefaultProfile.png";

const ProfileModal = () => {
  const { closeModal, openModal } = useModalStore();
  const { username, currentProfileImg } = useUserStore();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    closeModal();
    navigate(path);
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 gap-6 font-preSemiBold text-md">
      <button
        className="flex flex-col items-center justify-center w-full gap-5"
        onClick={() => handleNavigate("/setting")}
      >
        <img
          src={currentProfileImg} // 이미지 서버가 추가된다면 변경 필요
          alt="프로필 이미지"
          onError={(event) => (event.currentTarget.src = defaultProfile)} // 이미지 로드 실패 시 대체 이미지
          className="w-32 aspect-[1/1] rounded-full object-cover"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-preSemiBold text-xl">{username}</p>
          <p className="text-sm text-content2">프로필 정보 보기</p>
        </div>
      </button>

      <hr className="w-[80%]" />
      {/* 프로필 전환 */}
      <button onClick={() => openModal(<ProfileChangeModal />)}>프로필 전환</button>
      <hr className="w-[80%]" />
      {/* 닫기 */}
      <button onClick={closeModal}>닫기</button>
    </div>
  );
};

export default ProfileModal;
