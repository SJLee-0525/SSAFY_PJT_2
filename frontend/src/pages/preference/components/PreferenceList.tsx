import PreferenceCategory from "@pages/preference/components/PreferenceCategory";
import PreferenceInputs from "@pages/preference/components/PreferenceInputs";

const PreferenceList = () => {
  return (
    <div className="w-full px-8 flex flex-col gap-4 justify-center items-center">
      <PreferenceCategory />
      <PreferenceInputs type="EatingHabit" />
      <PreferenceInputs type="LikeIngredient" />
      <PreferenceInputs type="DislikeIngredient" />
    </div>
  );
};

export default PreferenceList;
