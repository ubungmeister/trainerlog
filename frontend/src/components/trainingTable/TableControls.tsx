import { SquareArrowRight, SquareArrowLeft } from "lucide-react";

type TableControlsProps = {
  dates: Date[];
  startIndex: number;
  endIndex: number;
  showPrev: () => void;
  showNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
};

export const TableControls = ({
  dates,
  startIndex,
  endIndex,
  showPrev,
  showNext,
  canPrev,
  canNext,
}: TableControlsProps) => {
  return (
    <div className="justify-between items-center p-2 bg-white border-t-1 border-primary-button flex">
      <button
        onClick={showPrev}
        disabled={!canPrev}
        className="px-2 py-1 rounded border disabled:opacity-50"
        aria-label="Previous dates"
      >
        <SquareArrowLeft style={{ color: "green" }} />
      </button>
      <span className="text-sm text-gray-600">
        {dates.length === 0
          ? "No sessions"
          : `${startIndex + 1}–${endIndex} of ${dates.length}`}
      </span>
      <button
        onClick={showNext}
        disabled={!canNext}
        className="px-2 py-1 rounded border disabled:opacity-50"
        aria-label="Next dates"
      >
        <SquareArrowRight style={{ color: "green" }} />
      </button>
    </div>
  );
};
