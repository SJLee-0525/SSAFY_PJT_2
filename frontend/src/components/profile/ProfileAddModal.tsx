import React, { useState, useRef } from "react";

import useModalStore from "@stores/modalStore";
import { useAddMember } from "@hooks/useUserHook";

import ProfileChangeModal from "@components/profile/ProfileChangeModal";

import ModalHeader from "@components/common/modal/ModalHeader";
import Input from "@components/common/input/Input";
import Button from "@components/common/button/Button";

import IconImage from "@assets/icons/IconImage";

// import useUserStore from "@stores/userStore";

const ProfileAddModal = () => {
  const { openModal } = useModalStore();

  const { mutate: addMemberRequest } = useAddMember();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 선택된 파일 가져오기
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  }

  // 파일 선택 버튼 클릭
  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  // 사용자 추가
  function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    if (!data.memberName) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const newMemberName = data.memberName.toString();

    // 사용자 추가 API 호출
    addMemberRequest(newMemberName, {
      onSuccess: () => {
        openModal(<ProfileChangeModal />);
      },
    });
  }

  return (
    <div className="w-full">
      <ModalHeader title="프로필 추가" />
      <form className="w-full px-4" onSubmit={handleAddMember}>
        <div className="flex justify-center items-center w-full mb-4">
          {/* 이미지 파일 선택 */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" // 기본 input 숨김
          />

          {/* 파일 선택 창 버튼 */}
          <button
            type="button"
            onClick={handleButtonClick}
            className="flex flex-col items-center justify-center mb-4 gap-4 font-preRegular"
          >
            {!selectedImage && (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full">
                <IconImage width={42} height={42} strokeColor="white" strokeWidth={2} />
              </div>
            )}
            {selectedImage && (
              <div className="w-32 h-32 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(selectedImage)} // 선택된 이미지 미리보기
                  alt="Selected"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
          </button>
        </div>
        <Input name="memberName" type="text" placeHolder="닉네임을 입력해주세요." />
        <Button type="submit" design="confirm" content="추가하기" className="w-full h-10 my-4" />
      </form>
    </div>
  );
};

export default ProfileAddModal;
