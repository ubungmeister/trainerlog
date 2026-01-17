import { categoryModalStore } from "app/store/category/useCategoryStore";
import { useState } from "react";
import { Label } from "components/ui/Label";
import { FormInput } from "components/ui/FormInput";
import { SaveButton } from "components/ui/button/SaveButton";
import { CloseButton } from "components/ui/button/CloseButton";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDeleteCategory } from "hooks/trainingTable/category/useDeleteCategory";
import { useSaveCategory } from "hooks/trainingTable/category/useSaveCategory";

const schema = z.object({
  name: z.string().min(2).max(100),
});

type FormSchemaType = z.infer<typeof schema>;

export const CategoryFormModal = () => {
  const category = categoryModalStore((state) => state.category);
  const categories = categoryModalStore((state) => state.categories);
  const closeModal = categoryModalStore((state) => state.closeModal);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: saveCategory, isPending: isSaving } = useSaveCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  const name = watch("name");

  const hasChanges = category ? name.trim() !== category.name.trim() : true;

  const canSave = hasChanges && !isSaving && !isDeleting;

  const onSubmit = (data: FormSchemaType) => {
    const id = category ? category.id : null;
    const isValidId = categories.some((cat) => cat.id === id);

    saveCategory(
      {
        id: id,
        name: data.name,
        method: isValidId ? "PUT" : "POST",
      },
      { onSuccess: closeModal },
    );
  };

  const onDelete = () => {
    if (!category) return;
    deleteCategory(
      { id: category.id, name: category.name },
      { onSuccess: closeModal },
    );
  };

  const formHeader = category ? "Edit Category" : "Add Category";

  return (
    <div className="modal-form">
      <div className="modal-container">
        <div className="modal-box">
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
          <div className="flex items-center justify-center gap-2">
            {!showDeleteConfirm && (
              <SaveButton disabled={isSaving || isDeleting || !canSave}>
                {isSaving ? "Saving..." : "Save"}
              </SaveButton>
            )}
            {category && !showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving || isDeleting}
                className="bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            )}
            {showDeleteConfirm && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
