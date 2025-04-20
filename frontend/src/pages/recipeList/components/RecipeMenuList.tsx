import { VideoList } from "@/types/recipeListTypes";

interface RecipeMenuListProps {
  dishes: string[];
  selectedDish: keyof VideoList | string;
  setSelectedDish: (dish: keyof VideoList) => void;
}

const RecipeMenuList = ({ dishes, selectedDish, setSelectedDish }: RecipeMenuListProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="px-5 py-3 flex gap-4 text-base overflow-x-auto whitespace-nowrap scrollbar-hide">
          {dishes &&
            dishes.map((dish) => (
              <div
                key={dish}
                onClick={() => setSelectedDish(dish as keyof VideoList)}
                className={`flex justify-center ${
                  selectedDish === dish ? "text-black font-preBold" : "text-content2 font-preMedium"
                }`}
              >
                {dish}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeMenuList;
