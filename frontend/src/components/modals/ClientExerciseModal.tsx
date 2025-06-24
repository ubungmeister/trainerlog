import { CloseButton } from "components/ui/button/CloseButton";
import { SaveButton } from "components/ui/button/SaveButton";
import { DeleteButton } from "components/ui/button/DeleteButton";
import { FormInput } from "components/ui/FormInput";
import { Label } from "components/ui/Label";
import { useQueryClient } from "@tanstack/react-query";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateExercise } from "hooks/trainingTable/exercises/useUpdateExercise";
import type { Exercise } from "types/tableType";
import { useDeleteClientExercise } from "hooks/trainingTable/clientExercise/useDeleteClientExercise";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useCreateClientExercise } from "hooks/trainingTable/clientExercise/useCreateClientExercise";
import { useState } from "react";
const schema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required").trim(),
});

type FormSchemaType = z.infer<typeof schema>;

export const ClientExerciseModal = () => {
  const queryClient = useQueryClient();
  const closeModal = clientExerciseStore((state) => state.closeModal);
  const clientExercise = clientExerciseStore((state) => state.clientExercise);
  const exercises = clientExerciseStore((state) => state.exercises);
  const clientId = tableStore((state) => state.clientId);
  const { mutate: updateExerciseName } = useUpdateExercise();
  const { mutate: deleteClientExercise } = useDeleteClientExercise();
  const { mutate: createClientExercise } = useCreateClientExercise();

  const [isActiveClientExercise, setIsActiveClientExercise] = useState(
    clientExercise?.activeClientExercise || false,
  );

  const formHeader = clientExercise
    ? "Edit Client Exercise"
    : "Add Client Exercise";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: clientExercise?.exerciseName
      ? { exerciseName: clientExercise.exerciseName }
      : { exerciseName: "" },
  });

  const onSubmit = (data: FormSchemaType) => {
    // if cleint exercise is not defined, create

    if (!clientExercise) {
      const isNameExist = exercises?.find(
        (ex: Exercise) => ex.name === data.exerciseName,
      );
      if (isNameExist) return false;

      //create new Client Exercise
      const newExercise = {
        clientId: clientId as string,
        name: data.exerciseName,
        activeClientExercise: isActiveClientExercise,
      };

      createClientExercise(newExercise, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["clientExercises", clientId],
          });
          queryClient.invalidateQueries({
            queryKey: ["allExercises"],
          });
          closeModal();
        },
        onError: (error) => {
          console.error("Error updating training session:", error);
        },
      });
    }

    //if name chnaged -> update Exercise
    else if (data.exerciseName !== clientExercise.exerciseName) {
      //update Exercise name
      // first check if Trainer doesn't have exercises with the same names
      const isNameExist = exercises?.find(
        (ex: Exercise) => ex.name === data.exerciseName,
      );
      if (isNameExist) return false;
      const newExercise = {
        id: clientExercise.exerciseId as string,
        name: data.exerciseName,
      };
      updateExerciseName(newExercise, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["allExercises"],
          });
          closeModal();
        },
        onError: (error) => {
          console.error("Error updating training session:", error);
        },
      });
    }
  };
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!clientExercise?.id) return;
    deleteClientExercise(clientExercise, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["clientExercises", clientExercise.clientId],
        });
        closeModal();
      },
      onError: (error) => {
        console.error("Error deleting client exercise:", error);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative flex flex-col w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <CloseButton closeModal={() => closeModal()} />
        <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">
          {formHeader}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="exerciseName">Exercise name</Label>
            <FormInput
              type="string"
              id="exerciseName"
              register={register("exerciseName")}
              error={errors.exerciseName?.message}
            />
          </div>
          <div className="mb-4 flex flex-row gap-3">
            <input
              onChange={(e) => {
                setIsActiveClientExercise(e.target.checked);
              }}
              checked={isActiveClientExercise}
              id="activeClientExercise"
              name="activeClientExercise"
              type="checkbox"
              className="toggle-styling"
            />
            <Label htmlFor="sets">
              {isActiveClientExercise ? "Active" : "Non active"}
            </Label>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            {clientExercise?.id && (
              <DeleteButton handleDelete={(e) => handleDelete(e)} />
            )}
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
};
