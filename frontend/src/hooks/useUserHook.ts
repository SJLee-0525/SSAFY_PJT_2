import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "@/types/userTypes.ts";
import { filteredInfomations } from "@/types/filterTypes.ts";

import {
  getMemberListApi,
  addMemberApi,
  deleteMemberApi,
  getMemberFilterApi,
  saveMemberFilterApi,
  authLoginApi,
} from "@apis/userApi";

import useUserStore from "@stores/userStore";
import useIngredientsStore from "@stores/ingredientsStore";

// 가족 구성원 목록 조회
export const useGetMemberList = () => {
  const query = useQuery({
    queryKey: ["memberList"],
    queryFn: getMemberListApi,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return query;
};

// 가족 구성원 추가
export const useAddMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<User, Error, string>({
    mutationFn: addMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberList"] });
    },
    onError: (error) => {
      console.error("가족 구성원 등록 실패", error);
    },
  });

  return mutation;
};

// 가족 구성원 삭제
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number>({
    mutationFn: deleteMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberList"] });
    },
    onError: (error) => {
      console.error("가족 구성원 삭제 실패", error);
    },
  });

  return mutation;
};

// 필터 조회
export const useGetFilteredInfomations = () => {
  const { userId } = useUserStore();
  const { setInitFilteredInfomations } = useIngredientsStore();

  const query = useQuery({
    queryKey: ["filteredInfomations", userId],
    queryFn: () => getMemberFilterApi(userId as number),
    staleTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (query.data) {
      setInitFilteredInfomations(query.data.filterData);
    }
  }, [query.data, setInitFilteredInfomations]);

  return query;
};

// 필터 저장
export const useSaveFilteredInfomations = () => {
  const { userId } = useUserStore();

  const queryClient = useQueryClient();

  const mutation = useMutation<
    { memberId: number; filterData: filteredInfomations },
    Error,
    { id: number; filterData: filteredInfomations }
  >({
    mutationFn: saveMemberFilterApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filteredInfomations", userId] }); // 캐시 무효화하여 refetch 실행
    },
    onError: (error) => {
      console.error("필터 저장 실패", error);
    },
  });

  return mutation;
};

// 로그인 관리
export const useLogin = () => {
  const { setAuthentication } = useUserStore();

  const mutation = useMutation<boolean, Error, { username: string; password: string }>({
    mutationFn: ({ username, password }) => authLoginApi(username, password),
    onSuccess: () => {
      // authentication 상태 true로 변경
      setAuthentication();
    },
    onError: (error) => {
      console.error("로그인 실패 in useLogin:", error);
    },
  });

  return mutation;
};
