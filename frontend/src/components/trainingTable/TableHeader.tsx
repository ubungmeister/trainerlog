
import { formatDate } from "utils/formatDate";

type TableHeaderProps = {
    visibleDates: Date[];
    onDateClick: (date: Date) => void;
    };

export const TableHeader = ({visibleDates, onDateClick} :TableHeaderProps) => {
    

  return (
    <thead>
      <tr className="bg-[var(--color-primary-menu)] text-white">
        <th className=" left-0 z-20 bg-[var(--color-primary-menu)] px-4 py-3 text-left min-w-[120px]">
          Exercise
        </th>
        {visibleDates.map((date) => (
          <th
            onClick={() => onDateClick(date)}
            key={formatDate(date)}
            className="px-4 py-3 text-left whitespace-nowrap min-w-[80px]"
          >
            {formatDate(date)}
          </th>
        ))}
      </tr>
    </thead>
  );
};
