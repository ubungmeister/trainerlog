import { Label } from "components/ui/Label";
import type { Category } from "types/tableType";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

type SelectCategoryProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  categories: Category[] | null;
  fieldName: Path<T>;
};

export const SelectCategory = <T extends FieldValues>({
  register,
  errors,
  categories,
  fieldName,
}: SelectCategoryProps<T>) => {
  return (
    <div>
      <Label htmlFor="categoryId">Choose category</Label>
      <select
        id="categoryId"
        {...register(fieldName)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select category</option>
        {categories?.map((category: Category) => (
          <option key={category.id} value={category.id || ""}>
            {category.name}
          </option>
        ))}
      </select>
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[fieldName]?.message)}
        </p>
      )}
    </div>
  );
};
