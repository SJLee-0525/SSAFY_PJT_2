import ModalHeader from "@components/common/modal/ModalHeader";

import TakeoutConfirmMessage from "@pages/takeoutIngredient/components/TakeoutConfirmMessage";

const TakeoutConfirmModal = () => {
  return (
    <div>
      <ModalHeader title="재료 출고" />
      <TakeoutConfirmMessage />
    </div>
  );
};

export default TakeoutConfirmModal;
