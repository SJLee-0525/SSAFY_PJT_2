import { getCurrentDate } from "@utils/getFormattedDate";

import HomeHeaderButtons from "@pages/home/components/HomeHeaderButtons.tsx";

const HomeHeader = () => {
  const formattedDate: string = getCurrentDate();

  return (
    <div className="flex items-center justify-between px-5 py-3 font-preSemiBold">
      <div>
        <h3>{formattedDate}</h3>
        {/* <p>오늘 날씨</p> */}
      </div>

      <HomeHeaderButtons />
    </div>
  );
};

export default HomeHeader;
