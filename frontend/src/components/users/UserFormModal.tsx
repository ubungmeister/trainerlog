import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { userModalStore } from "app/store/user/userModalStore";
import { useUpdateUser } from "hooks/users/useUpdateUser";
import { useDeleteUser } from "hooks/users/useDeleteUser";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
});

type FormSchemaType = z.infer<typeof schema>;

import { useForm } from "react-hook-form";

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
    const fullName = data.fullName.trim();
    const email = data.email.trim();
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
          <button
            onClick={() => closeModal()}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Name
            </label>
            <input
              type="text"
              id="fullName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("fullName", { required: true })}
            />
            {errors.fullName && (
              <span className="text-red-500 text-xs italic">
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs italic">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-secondary text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-primary-bg"
              type="submit"
            >
              Save
            </button>
            {user && (
              <button
                onClick={onDelete}
                className="ml-4 bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-600"
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
