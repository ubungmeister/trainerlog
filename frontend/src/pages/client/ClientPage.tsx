import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface Exercise {
  id: string;
  name: string;
}

interface ClientExercise {
  id: string;
  client_id: string;
  exercise_id: string;
}

interface Session {
  id: string;
  date: string;
  client_id: string;
}

interface SessionExercise {
  id: string;
  training_session_id: string;
  exercise_id: string;
  weight: number;
  repetitions: number;
}

// Mock data
const MOCK_CLIENT_EXERCISES = [
  { id: "client1-ex1", client_id: "client1", exercise_id: "ex1" },
  { id: "client1-ex2", client_id: "client1", exercise_id: "ex2" },
];

const MOCK_EXERCISES = [
  { id: "ex1", name: "Bench Press" },
  { id: "ex2", name: "Deadlift" },
  { id: "ex3", name: "Squat" },
];

const MOCK_SESSIONS = [
  { id: "s1", date: "2025-06-10", client_id: "client1" },
  { id: "s2", date: "2025-06-08", client_id: "client1" },
  { id: "s3", date: "2025-06-05", client_id: "client1" },
  { id: "s4", date: "2025-06-07", client_id: "client1" },
  { id: "s5", date: "2025-06-11", client_id: "client1" },
];

const MOCK_SESSION_EXERCISES = [
  {
    id: "se1",
    training_session_id: "s1",
    exercise_id: "ex1",
    weight: 60,
    repetitions: 10,
  },
  {
    id: "se2",
    training_session_id: "s1",
    exercise_id: "ex3",
    weight: 80,
    repetitions: 8,
  },
  {
    id: "se3",
    training_session_id: "s2",
    exercise_id: "ex2",
    weight: 100,
    repetitions: 5,
  },
  {
    id: "se4",
    training_session_id: "s3",
    exercise_id: "ex1",
    weight: 55,
    repetitions: 12,
  },
  {
    id: "se5",
    training_session_id: "s3",
    exercise_id: "ex1",
    weight: 55,
    repetitions: 12,
  },
  {
    id: "se6",
    training_session_id: "s3",
    exercise_id: "ex1",
    weight: 55,
    repetitions: 12,
  },
];

export const ClientPage = () => {
  const { clientId } = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clientExercises, setClientExercises] = useState<ClientExercise[]>([]);
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>(
    [],
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    setSessions(MOCK_SESSIONS.filter((s) => s.client_id === "client1"));
    setClientExercises(
      MOCK_CLIENT_EXERCISES.filter((ce) => ce.client_id === "client1"),
    );
    setSessionExercises(MOCK_SESSION_EXERCISES);
    setExercises(MOCK_EXERCISES);
  }, [clientId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [sessions]);

  const exerciseMap = Object.fromEntries(
    exercises.map((e: Exercise) => [e.id, e.name]),
  );
  const sortedSessions = [...sessions].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const dates = sortedSessions.map((s: Session) => s.date);
  const visibleDates = [...dates.slice(-5), "new"];
  const exerciseIds = clientExercises.map(
    (ce: ClientExercise) => ce.exercise_id,
  );

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
                      const session = sessions.find((s) => s.date === date);
                      const cell = sessionExercises.find(
                        (se) =>
                          se.training_session_id === session?.id &&
                          se.exercise_id === exId,
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
