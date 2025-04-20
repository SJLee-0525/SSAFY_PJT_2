import { useNavigate } from "react-router-dom";
import ArrowLeft from "@assets/icons/ArrowLeft";

interface HeaderProps {
  title: string;
  isIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

const Header = ({ title, isIcon, className, onClick }: HeaderProps) => {
  const navigate = useNavigate();

  function handleClick() {
    onClick?.();
    navigate(-1);
  }

  return (
    <header className={`${className} w-full flex items-center justify-left gap-[10px] p-1 font-preSemiBold`}>
      {isIcon && (
        <button type="button" onClick={handleClick}>
          <ArrowLeft width={30} height={30} strokeColor="#3C3C3C" />
        </button>
      )}
      <p className="text-lg">{title}</p>
    </header>
  );
};

export default Header;
