import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userModalStore } from "app/store/user/userModalStore";
import { useSaveUser } from "hooks/users/useUpdateUser";
import { useDeleteUser } from "hooks/users/useDeleteUser";
import { Label } from "components/ui/Label";
import { FormInput } from "components/ui/FormInput";
import { CloseButton } from "components/ui/button/CloseButton";
import { SaveButton } from "components/ui/button/SaveButton";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email().trim(),
});

type FormSchemaType = z.infer<typeof schema>;

export const UserFormModal = () => {
  const closeModal = userModalStore((state) => state.closeModal);
  const user = userModalStore((state) => state.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formHeader = user ? "Edit Client" : "Add Client";

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: user || { fullName: "", email: "" },
  });

  const { mutate: saveUser, isPending: isSaving } = useSaveUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const fullName = watch("fullName");
  const email = watch("email");

  // Determine if there are changes to enable the Save button
  const hasChanges = user
    ? fullName.trim() !== user.fullName.trim() ||
      email.trim() !== user.email.trim()
    : true;

  const canSave = hasChanges && !isSaving && !isDeleting;

  const onSubmit = (data: FormSchemaType) => {
    saveUser(
      {
        fullName: data.fullName,
        email: data.email,
        id: user?.id ?? null,
        method: user ? "PUT" : "POST",
      },
      { onSuccess: closeModal },
    );
  };

  const onDelete = () => {
    if (!user) return;
    deleteUser({ id: user.id }, { onSuccess: closeModal });
  };

  return (
    <div className="modal-form">
      <div className="modal-container">
        <div className="modal-box">
          <h2 className="text-xl font-semibold">{formHeader}</h2>
          <CloseButton closeModal={() => closeModal()} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="fullName">Full Name</Label>
            <FormInput
              type="text"
              id="fullName"
              register={register("fullName", { required: true })}
              error={errors.fullName?.message}
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="email">Email</Label>
            <FormInput
              type="email"
              id="email"
              register={register("email", { required: true })}
              error={errors.email?.message}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            {!showDeleteConfirm && (
              <SaveButton disabled={isSaving || isDeleting || !canSave}>
                {isSaving ? "Saving..." : "Save"}
              </SaveButton>
            )}

            {user && !showDeleteConfirm && (
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
