import { useEffect } from "react";
import { Route, Routes, useNavigate, Navigate, useLocation, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useUserStore from "@stores/userStore";

import HomePage from "@pages/home/HomePage";
import LoginPage from "@pages/auth/LoginPage";
import RecipeListPage from "@pages/recipeList/RecipeListPage";
import DetailRecipePage from "@pages/detailRecipe/DetailRecipePage";
import SettingPage from "@pages/setting/SettingPage";
import MyRecipePage from "@pages/myRecipe/MyRecipePage";
import PreferencePage from "@pages/preference/PreferencePage";

const queryClient = new QueryClient();

// 인증이 필요한 레이아웃
const ProtectedLayout = () => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const from = location.pathname;
    localStorage.setItem("redirect", from);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// 비인증 사용자를 위한 레이아웃
const PublicLayout = () => {
  const { isAuthenticated } = useUserStore();

  if (isAuthenticated) {
    const redirect = localStorage.getItem("redirect");
    localStorage.removeItem("redirect");
    return <Navigate to={redirect || "/"} replace />;
  }

  return <Outlet />;
};

const App = () => {
  const navigate = useNavigate();

  function handleNavigation(event: CustomEvent) {
    navigate(event.detail.path);
  }

  useEffect(() => {
    //auth-navigate 이벤트 리스너 등록
    window.addEventListener("auth-navigate", handleNavigation as EventListener);
    return () => window.removeEventListener("auth-navigate", handleNavigation as EventListener);
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 비인증 라우트 그룹 */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 인증 필요 라우트 그룹 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipeList/:recommendType" element={<RecipeListPage />} />
          <Route path="/detailRecipe/:recipeId" element={<DetailRecipePage />} />

          {/* 설정 관련 중첩 라우트 */}
          <Route path="/setting">
            <Route index element={<SettingPage />} />
            <Route path=":myRecipeType" element={<MyRecipePage />} />
            <Route path="preference" element={<PreferencePage />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
