import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CloseButton } from "components/ui/button/CloseButton";
import React from "react";
import { useForm } from "react-hook-form";
import { sessionExerciseModalStore } from "app/store/trainingTable/sessionExerciseModalStore";
import { useUpdateSessionExercise } from "hooks/trainingTable/sessionExercise/useUpdateSessionExercise";
import { useCreateSessionExercise } from "hooks/trainingTable/sessionExercise/useCreateSessionExercise";
import { useDeleteSessionExercise } from "hooks/trainingTable/sessionExercise/useDeleteSessionExercise";
import { Label } from "components/ui/Label";
import { SaveButton } from "components/ui/button/SaveButton";
import { DeleteButton } from "components/ui/button/DeleteButton";
import { FormInput } from "components/ui/FormInput";

const schema = z.object({
  repetitions: z.number().min(1, "Weight must be > 0"),
  sets: z.number().min(1, "Weight must be > 0"),
  weight: z.number().min(1, "Weight must be > 0"),
});

type FormSchemaType = z.infer<typeof schema>;

export const UserFormModal = () => {
  const queryClient = useQueryClient();
  const closeModal = sessionExerciseModalStore((state) => state.closeModal);
  const sessionExercise = sessionExerciseModalStore(
    (state) => state.sessionExercise,
  );
  const exercise = sessionExerciseModalStore((state) => state.exercise);
  const session = sessionExerciseModalStore((state) => state.session);

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
          },
          onError: (error) => {
            console.error("Error updating session exercise:", error);
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
        },
        onError: (error) => {
          console.error("Error creating session exercise:", error);
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
      },
      onError: (error) => {
        console.error("Error deleting session exercise:", error);
      },
    });
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
            <Label htmlFor="exercise">Weight</Label>
            <FormInput
              type="number"
              id="weight"
              register={register("weight", { valueAsNumber: true })}
              error={errors.weight?.message}
            />
          </div>
          <div className="mb-6">
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
          <div className="flex items-center justify-center">
            <SaveButton />
            {sessionExercise?.id && (
              <DeleteButton handleDelete={(e) => handleDelete(e)} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
