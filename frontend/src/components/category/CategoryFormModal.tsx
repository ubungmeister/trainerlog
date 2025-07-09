import { categoryModalStore } from "app/store/category/useCategoryStore";
import { Label } from "components/ui/Label";
import { FormInput } from "components/ui/FormInput";
import { SaveButton } from "components/ui/button/SaveButton";
import { CloseButton } from "components/ui/button/CloseButton";
import * as z from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateCategory } from "hooks/trainingTable/category/useUpdateCategory";
import { useDeleteCategory } from "hooks/trainingTable/category/useDeleteCategory";
import { useCreateCategory } from "hooks/trainingTable/category/useCreateCategory";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(2).max(100),
});

type FormSchemaType = z.infer<typeof schema>;

export const CategoryFormModal = () => {
  const category = categoryModalStore((state) => state.category);
  const categories = categoryModalStore((state) => state.categories);
  const closeModal = categoryModalStore((state) => state.closeModal);

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    const name = data.name;
    const id = category ? category.id : null;

    const isValidId = categories.some((cat) => cat.id === id);
    if (!id) {
      createCategory(
        { name, id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allCategories"] });
            closeModal();
          },
          onError: (error) => {
            console.error("Error creating category:", error);
          },
        },
      );
    }
    if (isValidId) {
      updateCategory(
        { name, id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allCategories"] });
            closeModal();
          },
          onError: (error) => {
            console.error("Error updating category:", error);
          },
        },
      );
    }
  };

  const onDelete = () => {
    if (!category) return;

    const id = category ? category.id : null;
    const name = category ? category.name : "";

    deleteCategory(
      { id, name },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["allCategories"] });
          closeModal();
        },
        onError: (error) => {
          console.error("Error deleting category:", error);
        },
      },
    );
  };

  const formHeader = category ? "Edit Category" : "Add Category";

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-10">
      <div className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{formHeader}</h2>
          <CloseButton closeModal={() => closeModal()} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="name">Category Name</Label>
            <FormInput
              type="text"
              id="name"
              register={register("name", { required: true })}
              error={errors.name?.message}
            />
          </div>
          <div className="flex items-center justify-center">
            <SaveButton />
            {category && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600 ml-2"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
