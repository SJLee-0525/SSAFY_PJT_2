import instance from "./instance";

import { User } from "@/types/userTypes";
import { filteredInfomations } from "@/types/filterTypes.ts";

export const getMemberListApi = async (): Promise<User[]> => {
  try {
    const response = await instance.get("/v1/member");
    // console.log("v1/member", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const addMemberApi = async (newMemberName: string): Promise<User> => {
  try {
    const response = await instance.post("/v1/member", {
      membername: newMemberName,
    });
    // console.log("v1/member (post)", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const modifyNameApi = async (id: number, newMemberName: string): Promise<User> => {
  try {
    const response = await instance.put(`/v1/member/${id}`, {
      newMembername: newMemberName,
    });
    // console.log(`v1/member/${id} (put)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const deleteMemberApi = async (id: number) => {
  try {
    const response = await instance.delete(`/v1/member/${id}`);
    // console.log(`v1/member/${id} (delete)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const getMemberFilterApi = async (
  id: number
): Promise<{ memberId: number; filterData: filteredInfomations }> => {
  try {
    const response = await instance.get(`/v1/filter/${id}`);
    // console.log(`v1/filter/${id} (get)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const saveMemberFilterApi = async ({
  id,
  filterData,
}: {
  id: number;
  filterData: filteredInfomations;
}): Promise<{ memberId: number; filterData: filteredInfomations }> => {
  try {
    const response = await instance.put(`/v1/filter/${id}`, filterData);
    // console.log(`v1/filter/${id} (put)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const authLoginApi = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await instance.post("/v1/auth/login", { username, password });

    if (response.status !== 200) return false; // 로그인 실패

    // 로그인 성공 시 JWT 토큰을 로컬 스토리지에 저장
    const token = response.data as string;
    localStorage.setItem("jwt", token);

    // 토큰이 localStorage에 완전히 저장될 때까지 짧은 지연 시간 추가
    //  await new Promise(resolve => setTimeout(resolve, 100));

    return true;
  } catch (error: unknown) {
    console.error("로그인 실패:", error);
    return false;
  }
};
