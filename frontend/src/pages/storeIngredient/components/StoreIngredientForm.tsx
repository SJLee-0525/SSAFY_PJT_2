import React, { useState, useEffect } from "react";

import useModalStore from "@stores/modalStore";

import { StoreIngredient } from "@/types/ingredientsTypes";
import { useStoreIngredient } from "@hooks/useIngredientsHooks";

import IngredientInput from "@components/common/input/IngredientInput";
import Input from "@components/common/input/Input";
import DateInput from "@components/common/input/DateInput";
import Button from "@components/common/button/Button";
import Keypad from "@components/common/keypad/Keypad";

import StoreConfirmModal from "@pages/storeIngredient/StoreConfirmModal";

const StoreIngredientForm = () => {
  const { openModal, closeModal } = useModalStore();

  const { mutate: storeIngredientRequest } = useStoreIngredient();

  const [now, setNow] = useState(new Date());

  const [customAmountInput, setCustomAmountInput] = useState(false);
  const [keypadValue, setKeypadValue] = useState("");

  const [incomingDate, setIncomingDate] = useState(now.toISOString().split("T")[0]);
  const [incomingTime, setIncomingTime] = useState(
    `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  );
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationTime, setExpirationTime] = useState("");

  const [storagePlace, setStoragePlace] = useState("냉장실");

  const maxDate = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate()).toISOString().split("T")[0];

  // 현재 시간 자동 갱신
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 5000); // 5초마다 갱신
    return () => clearInterval(timer);
  }, []);

  // 입고일 자동 갱신
  useEffect(() => {
    setIncomingDate(now.toISOString().split("T")[0]);
    setIncomingTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
  }, [now]);

  // 만료일 자동 갱신
  useEffect(() => {
    // 입고일로부터 7일 후 만료일 설정: 추후 재료별 유통기한 설정 가능하다면..
    setExpirationDate(new Date(new Date(incomingDate).getTime() + 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0]);
  }, [incomingDate]);

  useEffect(() => {
    setExpirationTime(incomingTime);
  }, [incomingTime]);

  // 저장 위치 변경
  function handleStoragePlace(place: string): void {
    setStoragePlace(place);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    if (!data.name || !data.amount || !data.expirationDate || !data.expirationTime) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 현재 시간을 UTC+9로 변환
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - currentTime.getTimezoneOffset());

    const ingredient: StoreIngredient = {
      name: data.name as string,
      amount: Number(data.amount),
      incomingDate: currentTime.toISOString().slice(0, 16) + ":00",
      expirationDate: `${expirationDate}T${expirationTime}:00`,
      storagePlace: storagePlace === "냉장실" ? "fridge" : "freezer",
    };

    // API 호출
    storeIngredientRequest(
      ingredient, // 저장할 재료 정보
      {
        onSuccess: () => openModal(<StoreConfirmModal />),
      }
    );
  }

  return (
    <form className="px-2 w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col w-full gap-4 px-6 py-4 bg-[#EEE] rounded-xl">
        {/* 재료명, 수량 입력 */}
        <div className="relative flex w-full gap-4 justify-between items-center">
          <IngredientInput label="재료명" name="name" type="text" placeHolder="재료명을 입력해주세요" />
          <div className="flex flex-col gap-2 w-2/5">
            <p className="font-preMedium text-[#333] text-xs font-semibold">수량</p>
            <input
              name="amount"
              type="text"
              value={keypadValue}
              onClick={() => setCustomAmountInput(true)}
              readOnly
              className="w-full px-3 py-1 g-2 h-12 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400"
            />
            {customAmountInput && (
              <Keypad value={keypadValue} onChange={setKeypadValue} onClose={() => setCustomAmountInput(false)} />
            )}
          </div>
        </div>

        {/* 입고일 입력 */}
        <div className="flex justify-between items-end w-full gap-4">
          <DateInput
            label="입고일"
            name="incomingDate"
            type="date"
            value={incomingDate}
            disabled={true}
            onChange={(event) => setIncomingDate(event.target.value)}
          />
          <Input
            name="incomingTime"
            type="time"
            value={incomingTime}
            disabled={true}
            onChange={(event) => setIncomingTime(event.target.value)}
          />
        </div>

        {/* 만료일 입력 */}
        <div className="flex justify-between items-end w-full gap-4">
          <DateInput
            label="만료일"
            name="expirationDate"
            type="date"
            value={expirationDate}
            min={incomingDate}
            max={maxDate}
            onChange={(event) => setExpirationDate(event.target.value)}
          />
          <Input
            name="expirationTime"
            type="time"
            value={expirationTime}
            onChange={(event) => setExpirationTime(event.target.value)}
          />
        </div>

        {/* 저장 위치 선택 */}
        <div className="flex flex-col w-full gap-2">
          <p className="font-preMedium text-[#333] text-xs font-semibold">위치</p>
          <div className="flex justify-start gap-2 items-center">
            <Button
              type="button"
              design={storagePlace === "냉장실" ? "confirm" : "cancel"}
              content="냉장실"
              className="w-16 h-8"
              onAction={() => handleStoragePlace("냉장실")}
            />
            <Button
              type="button"
              design={storagePlace === "냉동실" ? "confirm" : "cancel"}
              content="냉동실"
              className="w-16 h-8"
              onAction={() => handleStoragePlace("냉동실")}
            />
          </div>
        </div>
      </div>

      {/* 조작 */}
      <div className="flex justify-end align-center px-4 py-4 gap-2">
        <Button type="button" design="cancel" content="취소" className="w-24 h-10" onAction={closeModal} />
        <Button type="submit" design="confirm" content="입고" className="w-24 h-10" />
      </div>
    </form>
  );
};

export default StoreIngredientForm;
