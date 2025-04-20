import ModalHeader from "@components/common/modal/ModalHeader";
import RecipeRatingForm from "@components/recipeRating/RecipeRatingForm";

const RecipeRatingModal = () => {
  return (
    <>
      <ModalHeader title="레시피 평가" />
      <RecipeRatingForm />
    </>
  );
};

export default RecipeRatingModal;
