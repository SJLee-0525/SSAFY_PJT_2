import { useEffect, useState } from "react";

import { PagenationRecipeInfo } from "@/types/recipeListTypes";

// import MyRecipeItem from "@pages/myRecipe/components/MyRecipeItem";
import MyRecipeItem from "@/pages/myRecipe/components/MyRecipeItemLive";
import NoMyRecipeList from "@pages/myRecipe/components/NoMyRecipeList";
import Pagination from "@pages/myRecipe/components/MyRecipePagenation";

import useUserStore from "@stores/userStore";

import { useGetRatingRecipe } from "@hooks/useRecipeHooks";

const MyRecipeHistory = () => {
  const { userId } = useUserStore();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [recipeList, setRecipeList] = useState<PagenationRecipeInfo[]>();

  const { isLoading, data, refetch } = useGetRatingRecipe(userId, page - 1);

  // data가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (data) {
      setRecipeList(data.content);
      setTotalPage(data.totalPages);
      setNumberOfElements(data.numberOfElements);
      setPage(data.pageable.pageNumber + 1);
    }
  }, [data]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    refetch();
  }, [page]);

  async function handleDelete() {
    await refetch();
  }

  //데이터를 받아오는 중이거나, recipeList가 undefined일 때, 빈화면 렌더링
  if (isLoading || !recipeList) return <></>;
  else {
    return (
      <div className="flex flex-col items-center justify-around w-full h-full">
        <div className="flex flex-col items-center justify-start w-full h-[80%]">
          {recipeList && recipeList.length > 0 ? (
            recipeList.map((recipe) => (
              <div key={recipe.recipeId} className="flex flex-col items-center w-full gap-4 py-2">
                <MyRecipeItem
                  currentPage={page}
                  numberOfElements={numberOfElements}
                  type="rating"
                  recipe={recipe}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <NoMyRecipeList text="이전 검색 기록" />
          )}
        </div>

        {/* 페이지네이션 적용 */}
        {recipeList && recipeList.length > 0 && (
          <Pagination totalPages={totalPage} currentPage={page} onPageChange={handlePageChange} />
        )}
      </div>
    );
  }
};

export default MyRecipeHistory;
