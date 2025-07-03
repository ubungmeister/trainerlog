import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userModalStore } from "app/store/user/userModalStore";
import { useUpdateUser } from "hooks/users/useUpdateUser";
import { useDeleteUser } from "hooks/users/useDeleteUser";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "components/ui/Label";
import { CloseButton } from "components/ui/button/CloseButton";

const schema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email().trim(),
});

type FormSchemaType = z.infer<typeof schema>;

import { useForm } from "react-hook-form";
import { FormInput } from "components/ui/FormInput";
import { SaveButton } from "components/ui/button/SaveButton";

export const UserFormModal = () => {
  const queryClient = useQueryClient();
  const closeModal = userModalStore((state) => state.closeModal);
  const user = userModalStore((state) => state.user);

  const formHeader = user ? "Edit Client" : "Add Client";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: user || { fullName: "", email: "" },
  });

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const onSubmit = (data: FormSchemaType) => {
    const fullName = data.fullName;
    const email = data.email;
    const id = user ? user.id : null;
    const method = user ? "PUT" : "POST";

    updateUser(
      { fullName, email, id, method },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          closeModal();
        },
        onError: (error) => {
          console.error("Error updating user:", error);
        },
      },
    );
  };

  const onDelete = () => {
    if (!user) return;

    deleteUser(
      { id: user.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          closeModal();
        },
        onError: (error) => {
          console.error("Error deleting user:", error);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-start justify-center p-10">
      <div className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
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
          <div className="flex items-center justify-center">
            <SaveButton />
            {user && (
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
