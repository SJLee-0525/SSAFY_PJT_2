import { create } from "zustand";
import { persist } from "zustand/middleware";
import defaultProfile from "@assets/images/DefaultProfile.png";

interface UserState {
  userId: number;
  username: string;
  currentProfileImg: string;
  isAuthenticated: boolean;
  setUserId: (userId: number) => void;
  setUserName: (username: string) => void;
  setCurrentProfileImg: (profileImg: string) => void;
  setAuthentication: () => void;
  clearAuthentication: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: 1,
      username: "닉네임",
      currentProfileImg: defaultProfile,
      isAuthenticated: false,
      setUserId: (userId) => set({ userId }),
      setUserName: (username) => set({ username }),
      setCurrentProfileImg: (profileImg) => set({ currentProfileImg: profileImg }),
      setAuthentication: () => {
        set({ isAuthenticated: true });
      },
      clearAuthentication: () => {
        localStorage.removeItem("jwt");
        set({ isAuthenticated: false });
      }
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
