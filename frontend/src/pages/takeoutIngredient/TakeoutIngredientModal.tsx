import useIngredientsStore from "@stores/ingredientsStore.ts";
import useModalStore from "@stores/modalStore";
import { useDeleteIngredient } from "@hooks/useIngredientsHooks";

import ModalHeader from "@components/common/modal/ModalHeader";
import Button from "@components/common/button/Button";

import TakeoutIngredient from "@pages/takeoutIngredient/components/TakeoutIngredient";

import TakeoutConfirmModal from "@pages/takeoutIngredient/TakeoutConfirmModal";

const TakeoutIngredientModal = () => {
  const { selectedIngredients } = useIngredientsStore();
  const { openModal, closeModal } = useModalStore();

  const { mutate: deleteIngredientRequest } = useDeleteIngredient();

  function handleTakeout() {
    const ingredients = Object.values(selectedIngredients).map((ingredient) => {
      return {
        name: ingredient.name,
        quantity: ingredient.selectedCount,
      };
    });

    deleteIngredientRequest(ingredients, {
      onSuccess: () => {
        openModal(<TakeoutConfirmModal />);
      },
      onError: (error) => {
        console.error(error);
        alert("재료 출고에 실패했습니다. 다시 시도해주세요.");
      },
    });
  }

  if (Object.keys(selectedIngredients).length === 0) return;

  return (
    <div>
      <ModalHeader title="재료 출고" />

      {/* 선택한 재료 목록 확인 */}
      <div className="w-full h-fit px-2">
        <div className="flex h-[40vh] max-h-[40vh] items-start content-start py-1 px-5 gap-y-5 shrink-0 flex-wrap font-preMedium bg-[#EEE] rounded-xl overflow-y-auto">
          {selectedIngredients &&
            Object.values(selectedIngredients).map((ingredient) => (
              <TakeoutIngredient key={ingredient.ingredientInfoId} ingredient={ingredient} />
            ))}
        </div>
      </div>

      {/* 액션 */}
      <div className="flex justify-end align-center px-4 py-4 gap-2">
        <Button type="button" design="cancel" content="취소" className="w-24 h-10" onAction={closeModal} />
        <Button type="button" design="confirm" content="출고" className="w-24 h-10" onAction={handleTakeout} />
      </div>
    </div>
  );
};

export default TakeoutIngredientModal;
