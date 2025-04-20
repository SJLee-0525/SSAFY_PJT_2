import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import HomeHeader from "@pages/home/components/HomeHeader.tsx";
import HomeFilter from "@pages/home/components/HomeFilter";
// import HomeIngredients from "@pages/home/components/HomeIngredients.tsx";
import HomeIngredients from "@/pages/home/components/HomeIngredientsLive";
import HomeFooter from "@pages/home/components/HomeFooter.tsx";

import ErrorPage from "@components/common/error/ErrorPage";
import Modal from "@components/common/modal/Modal";
import useUserStore from "@stores/userStore";
import { navigate } from "@utils/navigationEvent";

const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <div className="flex flex-col justify-between w-full h-full">
        <HomeHeader />
        <HomeFilter isFilterOpen={isFilterOpen} handleFilterOpen={setIsFilterOpen} />
        <HomeIngredients isFilterOpen={isFilterOpen} />
        <HomeFooter isFilterOpen={isFilterOpen} />
      </div>
      <Modal />
    </ErrorBoundary>
  );
};

export default HomePage;
