/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    center: true,
    screens: {
      mobile: "344px", // mobile(344px) 이상
      sm: "375px", // 스마트폰 모바일(세로) ~ 479px
      md: "480px", // 스마트폰 모바일(가로) & 태블릿 세로
      lg: "768px", // 태블릿 가로
      xl: "1024px", // 노트북 & 이외 사이즈
      portrait: { raw: "(orientation: portrait)" }, // 세로 화면
      landscape: { raw: "(orientation: landscape)" }, // 가로 화면
    },
    fontFamily: {
      preLight: ["Pretendard-Light"],
      preRegular: ["Pretendard-Regular"],
      preMedium: ["Pretendard-Medium"],
      preSemiBold: ["Pretendard-SemiBold"],
      preBold: ["Pretendard-Bold"],
      preExtraBold: ["Pretendard-ExtraBold"],
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        offWhite: "#FAF9F6",
        title: "#202020",
        longContent: "#3C3C3C",
        content: "#828282",
        content2: "#9D9D9D",
        subContent: "#DDDDDD",
        primaryLight: "#3E91FF",
        primary: "#0381FE",
        primaryDark: "#0072DE",
        error: "#D44848",
      },
    },
  },
  plugins: [scrollbarHide],
};
