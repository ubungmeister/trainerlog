import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Check, ChevronDown } from "lucide-react";
import type { ClientExercise, Exercise } from "types/tableType";
import { useAddExerciseEntry } from "hooks/trainingTable/sessionExercise/useAddExerciseEntry";

const addEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  exerciseId: z.string().min(1, "Please select an exercise"),
  repetitions: z
    .number({ invalid_type_error: "Required" })
    .min(1, "Must be at least 1"),
  sets: z
    .number({ invalid_type_error: "Required" })
    .min(1, "Must be at least 1"),
  weight: z
    .number({ invalid_type_error: "Required" })
    .positive("Must be at least 1"),
});

type AddEntryFormValues = z.infer<typeof addEntrySchema>;

interface AddEntryModalProps {
  clientId: string;
  clientExercises: ClientExercise[];
  exercises: Exercise[];
  onClose: () => void;
}

export function AddEntryModal({
  clientId,
  clientExercises,
  exercises,
  onClose,
}: AddEntryModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [isExerciseListOpen, setIsExerciseListOpen] = useState(false);

  const addEntry = useAddExerciseEntry();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddEntryFormValues>({
    resolver: zodResolver(addEntrySchema),
    defaultValues: {
      date: today,
      exerciseId: "",
      repetitions: 0,
      sets: 0,
      weight: 0,
    },
  });

  const exerciseId = watch("exerciseId");

  // Merge client exercises + shared exercises into one list
  const allExercises = useMemo(() => {
    const clientExIds = new Set(
      clientExercises
        .filter((ce) => ce.activeClientExercise)
        .map((ce) => ce.exerciseId),
    );

    const fromClient = clientExercises
      .filter((ce) => ce.activeClientExercise)
      .map((ce) => ({
        id: ce.exerciseId ?? "",
        name: ce.exerciseName ?? "Unknown",
      }));

    const fromShared = exercises
      .filter(
        (e) =>
          e.sharedExercise &&
          e.activeExercise &&
          e.id &&
          !clientExIds.has(e.id),
      )
      .map((e) => ({ id: e.id!, name: e.name ?? "Unknown" }));

    return [...fromClient, ...fromShared];
  }, [clientExercises, exercises]);

  const selectedExercise = allExercises.find((e) => e.id === exerciseId);

  const onSubmit = (data: AddEntryFormValues) => {
    addEntry.mutate(
      {
        clientId,
        date: data.date,
        exerciseId: data.exerciseId,
        repetitions: Number(data.repetitions),
        sets: Number(data.sets),
        weight: Number(data.weight),
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-t-2xl p-5 pb-24 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            Add Exercise Entry
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Date picker */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-bg/30"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Exercise selector - mobile-friendly */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise
            </label>
            <input type="hidden" {...register("exerciseId")} />
            <button
              type="button"
              onClick={() => setIsExerciseListOpen(!isExerciseListOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-base text-left transition-colors ${
                isExerciseListOpen
                  ? "border-primary-bg ring-2 ring-primary-bg/30"
                  : errors.exerciseId
                    ? "border-red-300"
                    : "border-gray-200"
              }`}
            >
              <span
                className={selectedExercise ? "text-gray-900" : "text-gray-400"}
              >
                {selectedExercise?.name ?? "Select exercise..."}
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${isExerciseListOpen ? "rotate-180" : ""}`}
              />
            </button>
            {errors.exerciseId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.exerciseId.message}
              </p>
            )}

            {isExerciseListOpen && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-y-auto max-h-40 bg-white shadow-sm">
                {allExercises.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No exercises available
                  </div>
                ) : (
                  allExercises.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        setValue("exerciseId", ex.id, { shouldValidate: true });
                        setIsExerciseListOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 text-left text-base border-b border-gray-100 last:border-b-0 active:bg-gray-100 transition-colors ${
                        exerciseId === ex.id
                          ? "bg-primary-bg/5 text-primary-bg font-medium"
                          : "text-gray-800"
                      }`}
                    >
                      {ex.name}
                      {exerciseId === ex.id && (
                        <Check size={18} className="text-primary-bg" />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Reps / Sets / Weight */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reps
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="10"
                {...register("repetitions", { valueAsNumber: true })}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-base text-center focus:outline-none focus:ring-2 focus:ring-primary-bg/30"
              />
              {errors.repetitions && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.repetitions.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sets
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="3"
                {...register("sets", { valueAsNumber: true })}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-base text-center focus:outline-none focus:ring-2 focus:ring-primary-bg/30"
              />
              {errors.sets && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sets.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                placeholder="60"
                {...register("weight", { valueAsNumber: true })}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-base text-center focus:outline-none focus:ring-2 focus:ring-primary-bg/30"
              />
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>
          </div>

          {/* API error message */}
          {addEntry.isError && (
            <p className="text-red-500 text-sm mb-3">
              {addEntry.error?.message || "Failed to add entry"}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={addEntry.isPending}
            className="w-full bg-primary-bg text-white py-3.5 rounded-xl font-medium text-base hover:bg-primary-bg/90 transition-colors disabled:opacity-50"
          >
            {addEntry.isPending ? "Adding..." : "Add Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
