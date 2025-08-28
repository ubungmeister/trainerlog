import { format } from "date-fns";
import {
  Chip,
  IconButton,
  SwipeableDrawer,
  Stack,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { CalendarCog } from "lucide-react";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import { useEffect, useState } from "react";

function RangePill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Chip
      label={label}
      onClick={onClick}
      variant="filled"
      sx={{
        borderRadius: 999,
        px: 0.5,
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
}

type PillsProps = {
  value: [Date | null, Date | null];
  onChange: (v: [Date, Date]) => void;
};

export function DateRange({ value, onChange }: PillsProps) {
  const [open, setOpen] = useState(false);
  const [tmp, setTmp] = useState<[Date | null, Date | null]>(value);

  // синхронизируем, если value меняется снаружи
  useEffect(() => setTmp(value), [value]);

  const start = value[0];
  const end = value[1];

  const apply = (range: [Date | null, Date | null]) => {
    const [s, e] = range;
    if (s && e) onChange([s, e]);
  };

  const presets: { label: string; range: [Date, Date] }[] = [
    { label: "Today", range: [new Date(), new Date()] },
    { label: "Last 7 days", range: [subDays(new Date(), 6), new Date()] },
    {
      label: "Current month",
      range: [startOfMonth(new Date()), endOfMonth(new Date())],
    },
  ];

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        className="w-full px-2 py-2 justify-center items-center"
      >
        <RangePill
          label={start ? format(start, "MMM d") : "Start"}
          onClick={() => setOpen(true)}
        />
        <span>–</span>
        <RangePill
          label={end ? format(end, "MMM d") : "End"}
          onClick={() => setOpen(true)}
        />
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="calendar"
          size="small"
        >
          <CalendarCog />
        </IconButton>
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          },
        }}
      >
        <Box p={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {presets.map((p) => (
              <Button
                key={p.label}
                size="small"
                variant="outlined"
                onClick={() => {
                  apply(p.range);
                  setOpen(false);
                }}
              >
                {p.label}
              </Button>
            ))}
          </Stack>

          <Divider sx={{ my: 1 }} />

          <DateRangeCalendar
            value={tmp}
            onChange={(r) => setTmp(r)}
            reduceAnimations
          />

          <Stack direction="row" spacing={1} mt={1} justifyContent="flex-end">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                apply(tmp);
                setOpen(false);
              }}
              disabled={!tmp[0] || !tmp[1]}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
