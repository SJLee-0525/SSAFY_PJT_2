import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Header from "@components/Layout/Header";
import ErrorPage from "@components/common/error/ErrorPage";

import MyRecipeHistory from "@pages/myRecipe/components/MyRecipeHistory";
import MyRecipeFavorite from "@pages/myRecipe/components/MyRecipeFavorite";

const MyRecipePage = () => {
  const { myRecipeType } = useParams();
  const TITLE = myRecipeType === "favorite" ? "즐겨찾는 레시피" : "이전 레시피";

  return (
    <section className="flex flex-col p-3 h-full">
      <Header title={TITLE} isIcon />
      <ErrorBoundary fallback={<ErrorPage />}>
        {myRecipeType === "favorite" ? <MyRecipeFavorite /> : <MyRecipeHistory />}
      </ErrorBoundary>
    </section>
  );
};

export default MyRecipePage;
