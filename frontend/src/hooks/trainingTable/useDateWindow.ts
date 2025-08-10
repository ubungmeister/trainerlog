import { useEffect, useState, useMemo } from "react";
import { clamp } from "utils/number";

export function useDateWindow(dates: Date[], size = 5, step = 1) {
  const len = dates.length;
  const [endIndex, setEndIndex] = useState(len);

  // keep window pinned to the end when data changes
  useEffect(() => setEndIndex(len), [len]);

  const startIndex = Math.max(0, endIndex - size);
  const visibleDates = useMemo(
    () => dates.slice(startIndex, endIndex),
    [dates, startIndex, endIndex],
  );

  const canPrev = startIndex > 0;
  const canNext = endIndex < len;

  const showPrev = () => setEndIndex((e) => clamp(size, e - step, len));
  const showNext = () => setEndIndex((e) => clamp(size, e + step, len));

  return {
    visibleDates,
    canPrev,
    canNext,
    showPrev,
    showNext,
    startIndex,
    endIndex,
  };
}
