import Header from "@components/Layout/Header";
import PreferenceList from "@pages/preference/components/PreferenceList";

const PreferencePage = () => {
  return (
    <section className="flex flex-col h-full p-3 gap-4">
      <Header title="개인 선호" isIcon />
      <PreferenceList />
    </section>
  );
};

export default PreferencePage;
