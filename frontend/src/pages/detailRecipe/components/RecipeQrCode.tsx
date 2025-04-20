import { QRCodeCanvas } from "qrcode.react";

import Button from "@components/common/button/Button";

const RecipeQrCode = ({ path, onClose }: { path: string; onClose: () => void }) => {
  function handleOutsideClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="w-fit h-fit p-8 gap-8 bg-white rounded-3xl shadow-lg flex flex-col justify-center items-center">
        <QRCodeCanvas value={path} size={180} fgColor="#000000" level="H" />

        <div className="w-full flex justify-center items-center">
          <Button type="button" design="confirm" content="닫기" onAction={onClose} className="w-full h-10" />
        </div>
      </div>
    </div>
  );
};

export default RecipeQrCode;
