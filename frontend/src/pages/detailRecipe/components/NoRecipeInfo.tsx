import IconError from "@assets/icons/IconError";

const NoRecipeInfo = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-4">
      <IconError width={70} height={70} />
      <p className="text-base font-preMedium text-longContent">{text}</p>
    </div>
  );
};

export default NoRecipeInfo;
