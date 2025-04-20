import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useCallback, useEffect, useState } from "react";

import ErrorPage from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";
import Modal from "@components/common/modal/Modal";

import { useGetRecipeDetail } from "@hooks/useRecipeHooks";

import useRecipeStore from "@stores/recipeStore";

import DetailRecipeContents from "@pages/detailRecipe/components/DetailRecipeContents";

const DetailRecipePage = () => {
  const { recipeId } = useParams();
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const { detailRecipe, hasFetchedDetailRecipe, setHasFetchedDetailRecipe } = useRecipeStore();

  // API 호출로 상세 정보 가져오기
  const { isLoading, isFetching, isError, data } = useGetRecipeDetail(Number(recipeId));

  // 스토어 값이 API 응답으로 업데이트되었는지 확인
  useEffect(() => {
    if (
      data !== undefined &&
      data.recipeId === detailRecipe.recipeId &&
      detailRecipe.recipeId === Number(recipeId) &&
      detailRecipe.recipeId !== 0
    ) {
      setHasFetchedDetailRecipe(true);
    }
  }, [data, detailRecipe, recipeId]);

  const handleOrientationChange = useCallback(() => {
    setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
  }, []);

  // 화면 방향 변경 감지
  useEffect(() => {
    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  if (isLoading || isFetching || !data || !hasFetchedDetailRecipe) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <DetailRecipeContents isPortrait={isPortrait} />
        <Modal />
      </ErrorBoundary>
    </>
  );
};

export default DetailRecipePage;
