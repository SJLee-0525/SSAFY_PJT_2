import "@pages/auth/auth.css";

import React from "react";

import { useLogin } from "@hooks/useUserHook";

import Input from "@components/common/input/Input.tsx";
import Button from "@components/common/button/Button.tsx";

import logo from "@assets/images/logo/recipediaLogo.png";

const Login = () => {
  const { mutate: login, isPending } = useLogin();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { username, password } = data as { username: string; password: string };

    login({ username, password });
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12">
      <div className="w-48 h-fit flex flex-col items-center justify-center slide-down">
        {/* 추후 파비콘 이미지 사용 예정 */}
        <img src={logo} alt="" className="w-48 h-48 aspect-[1/1] object-cover mb-4" />
        <h1 className="text-2xl font-bold font-preBold">RECIPEDIA</h1>
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center w-4/5 gap-6 p-5 bg-white shadow-md rounded-xl"
      >
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <Input label="아이디" name="username" type="text" placeHolder="아이디를 입력해주세요." />
          <Input label="비밀번호" name="password" type="password" placeHolder="비밀번호를 입력해주세요." />
        </div>
        <Button
          type="submit"
          design="confirm"
          content={isPending ? "로그인 중..." : "로그인"}
          className="w-full h-10"
        />
      </form>
    </div>
  );
};

export default Login;
