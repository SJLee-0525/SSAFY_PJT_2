import IconClose from "@assets/icons/IconClose";

const PreferenceSelectedItem = ({ value, onDelete }: { value: string; onDelete: () => void }) => {
  return (
    <div className="max-w-30 px-3 py-1 flex justify-center items-center bg-white rounded-full shadow-md">
      <div className="w-full font-preMedium text-lg">{value}</div>
      <IconClose width={30} height={30} strokeColor="#292D32" onClick={onDelete} />
    </div>
  );
};

export default PreferenceSelectedItem;
