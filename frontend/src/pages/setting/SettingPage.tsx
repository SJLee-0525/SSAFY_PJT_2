import { useNavigate } from "react-router-dom";

import Header from "@components/Layout/Header";

import SettingUserInfo from "@pages/setting/components/SettingUserInfo";
import SettingMenus from "@pages/setting/components/SettingMenus";

import useUserStore from "@stores/userStore";

const SettingPage = () => {
  const { clearAuthentication } = useUserStore();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthentication();
    navigate("/login");
  };

  return (
    <section className="flex flex-col p-3 gap-5 items-center h-full">
      <Header title="프로필" isIcon />
      <SettingUserInfo />
      <SettingMenus />
      {/* 임시 로그아웃 */}
      <p className="font-preSemiBold text-content underline" onClick={handleLogout}>로그아웃</p>
    </section>
  );
};

export default SettingPage;
