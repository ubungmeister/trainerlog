import { useQueryClient } from "@tanstack/react-query";
import { clientExerciseStore } from "app/store/trainingTable/clientExerciseStore";
import { tableStore } from "app/store/trainingTable/tableStore";
import { useUpdateExercise } from "hooks/trainingTable/exercises/useUpdateExercise";
import { useDeleteClientExercise } from "hooks/trainingTable/clientExercise/useDeleteClientExercise";
import { useCreateClientExercise } from "hooks/trainingTable/clientExercise/useCreateClientExercise";
import { useUpdateClientExercise } from "hooks/trainingTable/clientExercise/useUpdateClientExercise";
import type { FormSchemaType } from "components/trainingTable/modals/clientExercise/ClientExerciseModal";
import { createNewExercise } from "./helpers/createNewExercise";
import { createUpdatedExercise } from "./helpers/createUpdatedExercise";
import { toast } from "react-toastify";

type FormPropsType = {
  closeModal: () => void;
};

/**
 *  Hook to handle the form logic for creating, updating, and deleting client exercises.
 *
 */

export const useClientExerciseForm = ({ closeModal }: FormPropsType) => {
  const queryClient = useQueryClient();
  const clientExercise = clientExerciseStore((state) => state.clientExercise);
  const exercises = clientExerciseStore((state) => state.exercises);
  const clientId = tableStore((state) => state.clientId);
  const { mutate: updateExerciseName } = useUpdateExercise();
  const { mutate: deleteClientExercise } = useDeleteClientExercise();
  const { mutate: createClientExercise } = useCreateClientExercise();
  const { mutate: updateClientExercise } = useUpdateClientExercise();

  const handleCreate = (data: FormSchemaType) => {
    const isNameExist = exercises?.some((ex) => ex.name === data.exerciseName);
    if (isNameExist) return false;

    const newExercise = createNewExercise(data, clientId);

    createClientExercise(newExercise, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["clientExercises", clientId],
        });
        queryClient.invalidateQueries({ queryKey: ["allExercises"] });
        closeModal();
        toast.success("Created successfully");
      },
      onError: (error) => {
        console.error("Create error:", error);
        toast.error("Failed to create");
      },
    });
  };

  const handleUpdate = (data: FormSchemaType) => {
    const isExerciseShared = exercises?.find(
      (ex) => ex.id === data.exerciseId,
    )?.sharedExercise;
    if (isExerciseShared) return console.error("Cannot update shared exercise");

    const updatePromises: Promise<unknown>[] = [];

    const exerciseId = clientExercise!.exerciseId || "";

    const updatedExercise = createUpdatedExercise(data, exerciseId);

    updatePromises.push(
      new Promise((resolve, reject) => {
        updateExerciseName(updatedExercise, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
    );

    if (data.activeClientExercise !== clientExercise?.activeClientExercise) {
      updatePromises.push(
        new Promise((resolve, reject) => {
          updateClientExercise(
            {
              ...clientExercise,
              activeClientExercise: data.activeClientExercise,
              clientId: clientExercise?.clientId ?? "",
            },
            { onSuccess: resolve, onError: reject },
          );
        }),
      );
    }

    if (updatePromises.length > 0) {
      Promise.all(updatePromises)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["clientExercises", clientId],
          });
          queryClient.invalidateQueries({ queryKey: ["allExercises"] });
          closeModal();
          toast.success("Exercise updated successfully");
        })
        .catch((error) => {
          console.error("Update error:", error);
          toast.error("Failed to update");
        });
    } else {
      closeModal();
    }
  };

  const onSubmit = (data: FormSchemaType) => {
    if (!clientExercise) return handleCreate(data);
    handleUpdate(data);
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
        toast.success("Deleted successfully");
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete");
      },
    });
  };

  return { onSubmit, handleDelete };
};
