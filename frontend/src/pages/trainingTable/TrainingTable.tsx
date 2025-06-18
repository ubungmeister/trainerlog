import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAllTrainingSessions } from "hooks/trainingTable/trainingSession/useGetAllTrainingSessions";
import { useGetAllClientExercises } from "hooks/trainingTable/clientExercise/useGetAllClientExercises";
import { useGetAllExercises } from "hooks/trainingTable/exercises/useGetAllExercises";
import { useGetAllSessionExercises } from "hooks/trainingTable/sessionExercise/useGetAllSessionExercises";
interface Exercise {
  id: string;
  name: string;
}

interface ClientExercise {
  id: string;
  client_id: string;
  exerciseId: string;
}

interface Session {
  id: string;
  date: string;
  client_id: string;
}

interface SessionExercise {
  id: string;
  training_session_id: string;
  exerciseId: string;
  weight: number;
  repetitions: number;
}

export const TrainingTable = () => {
  const { clientId } = useParams();

  const { data: trainingSesions, isLoading: isSessionsLoading } =
    useGetAllTrainingSessions(clientId || "");
  console.log("Training Sessions:", trainingSesions);

  const { data: clientExercises, isLoading: isClientExercisesLoading } =
    useGetAllClientExercises(clientId || "");
  console.log("Client Exercises:", clientExercises);

  const { data: exercises, isLoading: isExercisesLoading } =
    useGetAllExercises();
  console.log("Exercises:", exercises);
  const { data: sessionExercises, isLoading: isSessionExercisesLoading } =
    useGetAllSessionExercises(clientId || "");
  console.log("Session Exercises:", sessionExercises);

  const isLoading =
    isSessionsLoading ||
    isClientExercisesLoading ||
    isExercisesLoading ||
    isSessionExercisesLoading;

  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [trainingSesions]);

  const exerciseMap = exercises
    ? Object.fromEntries(exercises.map((e: Exercise) => [e.id, e.name]))
    : {};

  // Sort sessions by date
  const sortedSessions = trainingSesions
    ? [...trainingSesions].sort((a, b) => {
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      })
    : [];
  //Retrieve the last 5 sessions and add a "new" date
  const dates = sortedSessions.map((s: Session) => s.date);
  console.log("Dates:", dates);

  const visibleDates = [...dates.slice(-5), "new"];
  console.log("Visible Dates:", visibleDates);

  const exerciseIds = clientExercises
    ? clientExercises.map((ce: ClientExercise) => ce.exerciseId)
    : [];
  console.log("Exercise IDs:", exerciseIds);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Training Table</h2>
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <div className="overflow-x-auto" ref={scrollRef}>
            <table className="min-w-max bg-white border-collapse">
              <thead>
                <tr className="bg-[var(--color-primary-menu)] text-white">
                  <th className="sticky left-0 z-20 bg-[var(--color-primary-menu)] px-4 py-3 text-left min-w-[120px]">
                    Exercise
                  </th>
                  {visibleDates.map((date) => (
                    <th
                      key={date}
                      className="px-4 py-3 text-left whitespace-nowrap min-w-[80px]"
                    >
                      {date === "new" ? "+" : formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exerciseIds.map((exId) => (
                  <tr
                    key={exId}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="sticky left-0 bg-white px-4 py-3 font-medium">
                      {exerciseMap[exId]}
                    </td>
                    {visibleDates.map((date) => {
                      if (date === "new") {
                        return (
                          <td
                            key="new"
                            className="px-4 py-3 text-center text-gray-400"
                          >
                            +
                          </td>
                        );
                      }
                      console.log("exId", exId);
                      const session = trainingSesions.find(
                        (s) => s.date === date,
                      );
                      const cell = sessionExercises
                        ? sessionExercises.find(
                            (se: any) =>
                              se.trainingSessionId === session?.id &&
                              se.exerciseId === exId,
                          )
                        : [];
                      console.log(
                        "sessionExercises:",
                        sessionExercises,
                        "exId",
                        exId,
                        "session?.id",
                        session?.id,
                        "cell",
                        cell,
                      );
                      return (
                        <td
                          key={date}
                          className="px-4 py-3 min-w-[80px] text-center"
                        >
                          {cell ? (
                            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-center">
                              {cell.weight}×{cell.repetitions}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
