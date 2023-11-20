import { TableCell, Tooltip } from "@mui/material";
import { useDatetimeCell } from "../hooks/useDatetimeCell";

export interface DatetimeCellProps {
  datetime: string | Date
}

function DatetimeCell({ date, time, isToday }: ReturnType<typeof useDatetimeCell>) {
  return (
    <TableCell align="right">
      <Tooltip title={ isToday ? 'Today' : time}>
        <span>{ isToday ? time : date }</span>
      </Tooltip>
    </TableCell>
  )
}

export default (props: DatetimeCellProps) => <DatetimeCell { ...useDatetimeCell(props) } />;