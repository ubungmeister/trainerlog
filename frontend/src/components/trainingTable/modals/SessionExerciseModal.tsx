import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CloseButton } from "components/ui/button/CloseButton";
import React from "react";
import { useForm } from "react-hook-form";
import { sessionExerciseStore } from "app/store/trainingTable/sessionExerciseStore";
import { useUpdateSessionExercise } from "hooks/trainingTable/sessionExercise/useUpdateSessionExercise";
import { useCreateSessionExercise } from "hooks/trainingTable/sessionExercise/useCreateSessionExercise";
import { useDeleteSessionExercise } from "hooks/trainingTable/sessionExercise/useDeleteSessionExercise";
import { Label } from "components/ui/Label";
import { SaveButton } from "components/ui/button/SaveButton";
import { DeleteButton } from "components/ui/button/DeleteButton";
import { FormInput } from "components/ui/FormInput";
import { toast } from "react-toastify";

const schema = z.object({
  repetitions: z.number().min(1, "Weight must be > 0"),
  sets: z.number().min(1, "Weight must be > 0"),
  weight: z.number().min(1, "Weight must be > 0"),
});

type FormSchemaType = z.infer<typeof schema>;

export const SessionExerciseModal = () => {
  const queryClient = useQueryClient();
  const closeModal = sessionExerciseStore((state) => state.closeModal);
  const sessionExercise = sessionExerciseStore(
    (state) => state.sessionExercise,
  );
  const exercise = sessionExerciseStore((state) => state.exercise);
  const session = sessionExerciseStore((state) => state.session);

  const formHeader = sessionExercise
    ? "Edit Session Exercise"
    : "Add Session Exercise";

  const defaultValues = sessionExercise ?? {
    repetitions: 0,
    sets: 0,
    weight: 0,
    sessionId: " ",
    exerciseId: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const { mutate: updateSessionExercise } = useUpdateSessionExercise();
  const { mutate: createSessionExercise } = useCreateSessionExercise();
  const { mutate: deleteSessionExercise } = useDeleteSessionExercise();

  const onSubmit = (data: FormSchemaType) => {
    const isSessionExerciseExist =
      sessionExercise?.id && session?.id && exercise?.id;

    if (isSessionExerciseExist) {
      //Update existing session exercise
      updateSessionExercise(
        { ...sessionExercise, ...data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessionExercises"] });
            closeModal();
            toast.success("Session updated");
          },
          onError: (error) => {
            console.error("Error updating session exercise:", error);
            toast.error("Failed to update Session");
          },
        },
      );
    } else {
      //Create new session exercise
      if (!session?.id || !exercise?.id) {
        console.error("Session or Exercise ID is missing");
        return;
      }
      const newSessionExercise = {
        trainingSessionId: session.id,
        exerciseId: exercise.id,
        weight: data.weight,
        sets: data.sets,
        repetitions: data.repetitions,
      };
      createSessionExercise(newSessionExercise, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["sessionExercises"] });
          closeModal();
          toast.success("Session created");
        },
        onError: (error) => {
          console.error("Error creating session exercise:", error);
          toast.error("Failed to create the Session");
        },
      });
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!sessionExercise?.id) return;

    deleteSessionExercise(sessionExercise, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sessionExercises"] });
        closeModal();
        toast.success("Session deleted");
      },
      onError: (error) => {
        console.error("Error deleting session exercise:", error);
        toast.error("Failed to delete the Session");
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
            <Label htmlFor="weight">Weight</Label>
            <FormInput
              type="number"
              id="weight"
              register={register("weight", { valueAsNumber: true })}
              error={errors.weight?.message}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="sets">Sets</Label>
            <FormInput
              type="number"
              id="sets"
              register={register("sets", { valueAsNumber: true })}
              error={errors.sets?.message}
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="repetitions">Repetitions</Label>
            <FormInput
              type="number"
              id="repetitions"
              register={register("repetitions", { valueAsNumber: true })}
              error={errors.repetitions?.message}
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            {sessionExercise?.id && (
              <DeleteButton handleDelete={(e) => handleDelete(e)} />
            )}
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
};
