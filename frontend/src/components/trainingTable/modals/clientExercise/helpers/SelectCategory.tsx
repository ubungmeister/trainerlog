import { Label } from "components/ui/Label";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormSchemaType } from "components/trainingTable/modals/clientExercise/ClientExerciseModal";
import type { Category } from "types/tableType";

type SelectCategoryProps = {
  register: UseFormRegister<FormSchemaType>;
  errors: FieldErrors<FormSchemaType>;
  categories: Category[] | null;
};

export const SelectCategory = ({
  register,
  errors,
  categories,
}: SelectCategoryProps) => {
  return (
    <div>
      <Label htmlFor="categoryId">Chose category</Label>
      <select
        id="categoryId"
        {...register("categoryId")}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select category </option>
        {categories?.map((category: Category) => (
          <option key={category.id} value={category.id || ""}>
            {category.name}
          </option>
        ))}
      </select>
      {errors.exerciseName && (
        <p className="text-red-500 text-sm mt-1">
          {errors.exerciseName.message}
        </p>
      )}
    </div>
  );
};
