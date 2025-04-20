import useUserStore from "@stores/userStore";
import useModalStore from "@stores/modalStore";

import { useGetMemberList } from "@hooks/useUserHook";

import ModalHeader from "@components/common/modal/ModalHeader";
import ProfileAddModal from "@components/profile/ProfileAddModal";

import IconIncrease from "@assets/icons/IconIncrease";

import { User } from "@/types/userTypes";
import defaultProfile from "@assets/images/DefaultProfile.png";

// 임시 프로필 이미지
import dadProfile from "@assets/images/ProfileDad.png";
import momProfile from "@assets/images/ProfileMom.png";
import sisterProfile from "@assets/images/ProfileGirl.png";
import brotherProfile from "@assets/images/ProfileBoy.png";

const ProfileChangeModal = () => {
  const { setCurrentProfileImg, setUserName, setUserId } = useUserStore();
  const { openModal, closeModal } = useModalStore();

  // 등록된 가족 구성원 리스트 조회
  const { data: profiles } = useGetMemberList();

  function handleProfileChange(profile: User) {
    const selectedProfileImage = getProfileImage(profile.membername);

    setUserId(profile.memberId);
    setCurrentProfileImg(selectedProfileImage);
    setUserName(profile.membername);

    closeModal();
  }

  function getProfileImage(membername: string): string {
    switch (membername) {
      case "아빠":
        return dadProfile;
      case "엄마":
        return momProfile;
      case "딸":
        return sisterProfile;
      case "아들":
        return brotherProfile;
      default: // 기본 프로필 이미지
        return defaultProfile;
    }
  }

  return (
    <>
      <ModalHeader title="프로필 전환" />
      <div className="pb-10 flex flex-col items-center justify-center gap-4">
        <div className="grid grid-cols-2 gap-x-14 gap-y-6">
          {profiles &&
            profiles.map((profile) => (
              <button
                key={profile.memberId}
                className="flex flex-col items-center justify-center gap-4 rounded-full"
                onClick={() => handleProfileChange(profile)}
              >
                <img
                  src={getProfileImage(profile.membername)}
                  alt={profile.membername}
                  onError={(event) => (event.currentTarget.src = defaultProfile)} // 이미지 로드 실패 시 대체 이미지
                  className="w-28 aspect-[1/1] rounded-full object-cover"
                />
                <p className="font-preSemiBold text-lg">{profile.membername}</p>
              </button>
            ))}

          {/* 사용자 추가 */}
          {profiles && profiles.length < 6 && (
            <button
              className="flex flex-col items-center justify-center gap-4"
              onClick={() => openModal(<ProfileAddModal />)}
            >
              <div className="w-28 h-28 flex items-center justify-center bg-gray-200 rounded-full">
                <IconIncrease width={30} height={30} strokeColor="white" />
              </div>
              <p className="font-preSemiBold text-lg">구성원 추가</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileChangeModal;
