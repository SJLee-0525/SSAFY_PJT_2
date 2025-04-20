import { useState, useEffect } from "react";

import useModalStore from "@stores/modalStore";

import Button from "@components/common/button/Button";

const StoreConfirmMessage = () => {
  const { closeModal } = useModalStore();

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 컴포넌트가 언마운트 되었을 때 clear
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      closeModal();
    }
  }, [countdown, closeModal]);

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col w-full items-center px-4 py-10 font-preMedium">
        <p className="m-0">재료 입고가 완료되었습니다.</p>
        <p className="m-0">{countdown}초 뒤 자동으로 홈으로 이동합니다.</p>
      </div>
      <div className="flex w-full justify-center items-center font-preRegular">
        <Button
          type="button"
          design="confirm"
          onAction={closeModal}
          content="홈으로 돌아가기"
          className="w-full h-10"
        />
      </div>
    </div>
  );
};

export default StoreConfirmMessage;
