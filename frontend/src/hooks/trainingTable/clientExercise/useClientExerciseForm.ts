import { useQueryClient } from "@tanstack/react-query";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useUpdateExercise } from "hooks/trainingTable/exercises/useUpdateExercise";
import { useDeleteClientExercise } from "hooks/trainingTable/clientExercise/useDeleteClientExercise";
import { useCreateClientExercise } from "hooks/trainingTable/clientExercise/useCreateClientExercise";
import { useUpdateClientExercise } from "hooks/trainingTable/clientExercise/useUpdateClientExercise";
import type { FormSchemaType } from "components/trainingTable/modals/ClientExerciseModal"; // adjust import path

type FormPropsType = {
  isActiveClientExercise: boolean;
  closeModal: () => void;
};

/**
 *  Hook to handle the form logic for creating, updating, and deleting client exercises.
 *
 */

export const useClientExerciseForm = ({
  isActiveClientExercise,
  closeModal,
}: FormPropsType) => {
  const queryClient = useQueryClient();
  const clientExercise = clientExerciseStore((state) => state.clientExercise);
  const exercises = clientExerciseStore((state) => state.exercises);
  const clientId = tableStore((state) => state.clientId);
  const { mutate: updateExerciseName } = useUpdateExercise();
  const { mutate: deleteClientExercise } = useDeleteClientExercise();
  const { mutate: createClientExercise } = useCreateClientExercise();
  const { mutate: updateClientExercise } = useUpdateClientExercise();

  const onSubmit = (data: FormSchemaType) => {
    console.log("Form data submitted:", data);
    if (!clientExercise) {
      const isNameExist = exercises?.find(
        (ex) => ex.name === data.exerciseName,
      );
      if (isNameExist) return false;

      const newExercise = {
        clientId: clientId as string,
        name: data.exerciseName ? data.exerciseName : null,
        exerciseId: data.exerciseId ? data.exerciseId : null,
        activeClientExercise: isActiveClientExercise,
        categoryId: data.categoryId ? data.categoryId : null,
      };

      console.log("Creating new client exercise:", newExercise);

      createClientExercise(newExercise, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["clientExercises", clientId],
          });
          queryClient.invalidateQueries({ queryKey: ["allExercises"] });
          closeModal();
        },
        onError: (error) => console.error("Create error:", error),
      });
      return;
    }

    const updatePromises: Promise<unknown>[] = [];
    console.log(
      "data.exerciseName !== clientExercise.exerciseName",
      data.exerciseName,
      "data.exerciseName !== clientExercise.exerciseName",
      data.exerciseName,
    );

    const updatedExercise = {
      id: clientExercise.exerciseId as string,
      name: data.exerciseName as string,
      categoryId: data.categoryId || null,
    };

    console.log("updatedExercise", updatedExercise);

    const namePromise = new Promise((resolve, reject) => {
      updateExerciseName(updatedExercise, {
        onSuccess: resolve,
        onError: reject,
      });
    });

    updatePromises.push(namePromise);

    if (isActiveClientExercise !== clientExercise.activeClientExercise) {
      const statusPromise = new Promise((resolve, reject) => {
        updateClientExercise(
          { ...clientExercise, activeClientExercise: isActiveClientExercise },
          { onSuccess: resolve, onError: reject },
        );
      });
      updatePromises.push(statusPromise);
    }

    if (updatePromises.length > 0) {
      Promise.all(updatePromises)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["clientExercises", clientId],
          });
          queryClient.invalidateQueries({ queryKey: ["allExercises"] });
          closeModal();
        })
        .catch((error) => {
          console.error("Update error:", error);
        });
    } else {
      closeModal();
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
      onError: (error) => console.error("Delete error:", error),
    });
  };

  return { onSubmit, handleDelete };
};
