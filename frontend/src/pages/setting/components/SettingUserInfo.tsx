import React, { useState, useEffect, useRef } from "react";

import useUserStore from "@stores/userStore";
import { useGetMemberList } from "@hooks/useUserHook";

import { modifyNameApi } from "@apis/userApi";

import IconEdit from "@assets/icons/IconEdit";
import IconCheck from "@assets/icons/IconCheck";

const SettingUserInfo = () => {
  const { currentProfileImg, userId, username, setUserName } = useUserStore();
  const { refetch: refetchMemberList } = useGetMemberList();

  const [isEdit, setIsEdit] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [originalUsername, setOriginalUsername] = useState(username);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setEditUsername(e.target.value);
  }

  async function modifyUserName() {
    try {
      const response = await modifyNameApi(userId, editUsername);
      setUserName(response.membername);
      setOriginalUsername(response.membername);
      refetchMemberList();

      alert("성공적으로 수정했습니다.");
    } catch {
      setEditUsername(originalUsername);
      setUserName(originalUsername);
      alert("이름 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  function handleEditBtn() {
    setIsEdit(false);

    //이름 변경 API 호출
    modifyUserName();
  }

  // isEdit 상태일 때, 자동으로 input 포커스 설정
  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div className="w-full h-[30%] flex flex-col items-center justify-center gap-4">
      <img src={currentProfileImg} alt="profile" className="w-40 rounded-full" />
      <div
        className={`w-[30%] flex items-end justify-between font-preRegular text-lg border-b-2 ${isEdit ? "border-primary bg-offWhite" : "border-longContent"}`}
      >
        <input
          type="text"
          value={editUsername}
          className={`w-[90%] py-1 bg-offWhite outline-none`}
          onChange={handleChangeUsername}
          disabled={!isEdit}
          ref={inputRef}
        />
        {isEdit ? (
          <IconCheck width={30} height={30} strokeColor="#0381FE" onClick={handleEditBtn} />
        ) : (
          <IconEdit width={20} height={30} fillColor="#292D32" onClick={() => setIsEdit(true)} />
        )}
      </div>
    </div>
  );
};

export default SettingUserInfo;
