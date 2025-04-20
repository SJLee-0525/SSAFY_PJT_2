import ModalHeader from "@components/common/modal/ModalHeader";
import StoreConfirmMessage from "@pages/storeIngredient/components/StoreConfirmMessage";

const StoreConfirmModal = () => {
  return (
    <div>
      <ModalHeader title="재료 입고" />
      <StoreConfirmMessage />
    </div>
  );
};

export default StoreConfirmModal;
