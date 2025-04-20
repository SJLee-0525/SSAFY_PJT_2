import { useState, useEffect } from "react";

import useUserStore from "@stores/userStore";
import useIngredientsStore from "@stores/ingredientsStore";

import { useGetIngredientsList } from "@hooks/useIngredientsHooks";
import { useGetFilteredInfomations, useSaveFilteredInfomations } from "@hooks/useUserHook";

import HomeExpandFilter from "@pages/home/components/HomeExpandFilter";

import Button from "@components/common/button/Button";

import IconSortAsc from "@assets/icons/IconSortAsc";
import IconSortDesc from "@assets/icons/IconSortDesc";
import IconFilter from "@assets/icons/IconFilter";
import ArrowUp from "@assets/icons/ArrowUp";

const HomeFilter = ({
  isFilterOpen,
  handleFilterOpen,
}: {
  isFilterOpen: boolean;
  handleFilterOpen: (state: boolean) => void;
}) => {
  const { userId, isAuthenticated } = useUserStore();
  const { filteredInfomations } = useIngredientsStore();

  const { mutate: useSaveFilteredRequest } = useSaveFilteredInfomations();

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [sort, setSort] = useState<"name" | "expire">("name");

  const [location, setLocation] = useState<"all" | "fridge" | "freezer">("all");

  // API 호출: 재료 목록 조회, 필터 정보 조회
  const { refetch: refectchIngredinetsList } = useGetIngredientsList(location, sort, order);
  const { refetch: refetchFilteredInfomations } = useGetFilteredInfomations();

  useEffect(() => {
    refetchFilteredInfomations();
  }, []);

  useEffect(() => {
    refetchFilteredInfomations();
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated) {
      refectchIngredinetsList();
    }
  }, [order, sort, location, isAuthenticated]);

  function handleSaveFilter(): void {
    // 필터 저장하는 API 호출
    useSaveFilteredRequest(
      { id: userId, filterData: filteredInfomations },
      {
        onSuccess: () => {
          handleFilterOpen(false);
        },
      }
    );
  }

  return (
    <div className="relative flex justify-between items-center w-full h-10 px-4">
      <div className="flex justify-start items-center gap-2">
        <Button
          type="button"
          design={location === "all" ? "confirm" : "cancel"}
          content="전체"
          onAction={() => setLocation("all")}
          className="px-2.5 py-1"
        />
        <Button
          type="button"
          design={location === "fridge" ? "confirm" : "cancel"}
          content="냉장실"
          onAction={() => setLocation("fridge")}
          className="px-2.5 py-1"
        />
        <Button
          type="button"
          design={location === "freezer" ? "confirm" : "cancel"}
          content="냉동실"
          onAction={() => setLocation("freezer")}
          className="px-2.5 py-1"
        />
      </div>
      <div className="flex justify-end items-center gap-2 font-preMedium text-sm text-gray-500">
        <div className="flex justify-center items-center gap-1 cursor-pointer">
          {order === "asc" ? (
            <IconSortAsc width={20} height={20} strokeColor="#0381fe" onClick={() => setOrder("desc")} />
          ) : (
            <IconSortDesc width={20} height={20} strokeColor="#0381fe" onClick={() => setOrder("asc")} />
          )}
          <div className="text-primary" onClick={() => setSort(sort === "name" ? "expire" : "name")}>
            {sort === "name" ? "이름순" : "만료일순"}
          </div>
        </div>
        <div className="border-r border-[#dddddd] h-5 mx-1" />

        {!isFilterOpen && (
          <IconFilter width={18} height={18} strokeColor="#9d9d9d" onClick={() => handleFilterOpen(true)} />
        )}
        {isFilterOpen && <ArrowUp width={18} height={18} strokeColor="#9d9d9d" onClick={handleSaveFilter} />}
      </div>

      {isFilterOpen && <HomeExpandFilter />}
    </div>
  );
};

export default HomeFilter;
