import { StateEnum } from "types/tableType";

type StateFilterProps = {
  filterState: StateEnum;
  setFilterState: (state: StateEnum) => void;
};

export const StateFilter = ({
  filterState,
  setFilterState,
}: StateFilterProps) => {
  return (
    <div className="flex items-center justify-start gap-1">
      <button
        onClick={() => setFilterState(StateEnum.ALL)}
        className={`button-filter ${filterState === StateEnum.ALL ? " bg-primary-bg" : "bg-gray-400"}`}
      >
        All
      </button>
      <button
        onClick={() => setFilterState(StateEnum.ACTIVE)}
        className={`button-filter ${filterState === StateEnum.ACTIVE ? " bg-primary-bg" : "bg-gray-400"}`}
      >
        Active
      </button>
      <button
        onClick={() => setFilterState(StateEnum.INACTIVE)}
        className={` button-filter ${filterState === StateEnum.INACTIVE ? " bg-primary-bg" : "bg-gray-400"}`}
      >
        Inactive
      </button>
    </div>
  );
};
