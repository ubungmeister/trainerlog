import { useQueryClient } from "@tanstack/react-query";
import { trainingSessionStore } from "app/store/trainingTable/trainingSessionStore";
import { Controller, useForm } from "react-hook-form";
import { Label } from "components/ui/Label";
import { SaveButton } from "components/ui/button/SaveButton";
import { DeleteButton } from "components/ui/button/DeleteButton";
import { CloseButton } from "components/ui/button/CloseButton";
import React from "react";
import DatePicker from "react-datepicker";
import { useUpdateTrainingSession } from "hooks/trainingTable/trainingSession/useUpdateTrainingSession";

import "react-datepicker/dist/react-datepicker.css";
import { useDeleteTrainingSession } from "hooks/trainingTable/trainingSession/useDeleteTrainingSession";
export const TrainingSessionModal = () => {
  const queryClient = useQueryClient();
  const closeModal = trainingSessionStore((state) => state.closeModal);
  const session = trainingSessionStore((state) => state.session);
  const { mutate: updateTrainingSession } = useUpdateTrainingSession();
  const { mutate: deleteTrainingSession } = useDeleteTrainingSession();

  const { handleSubmit, control } = useForm({
    defaultValues: {
      date: session?.date ? new Date(session.date) : null,
    },
  });

  const onSubmit = (data: { date: Date | null }) => {
    if (!session?.clientId) return;

    const dateToString = data.date;

    if (!dateToString) return;

    const updatedSession = {
      ...session,
      clientId: session?.clientId,
      date: dateToString,
    };

    updateTrainingSession(updatedSession, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["trainingSessions", session.clientId],
        });
        closeModal();
      },
      onError: (error) => {
        console.error("Error updating training session:", error);
      },
    });
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!session?.id) return;
    deleteTrainingSession(session, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["trainingSessions", session.clientId],
        });
        closeModal();
      },
      onError: (error) => {
        console.error("Error deleting training session:", error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative flex flex-col w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <CloseButton closeModal={() => closeModal()} />

          <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">
            Edit Training Date
          </h2>
          <div className="flex flex-col items-center mb-6 sm:mb-8 w-full">
            <Label htmlFor="date">Date</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border rounded-lg shadow w-full sm:w-40 px-4 py-3 text-base text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <DeleteButton handleDelete={(e) => handleDelete(e)} />
            <SaveButton />
          </div>
        </div>
      </div>
    </form>
  );
};
