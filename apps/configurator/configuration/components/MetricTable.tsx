import { Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

export const MetricTable: React.FC<TableProps> = ({children, ...rest}) => {
  return (
    <Table {...rest}>
      <TableHead>
        <TableRow>
          <TableCell/>
          <TableCell>Key</TableCell>
          <TableCell align="left">Metric name</TableCell>
          <TableCell align="center">Default Value</TableCell>
          <TableCell align="right"># Values</TableCell>
          <TableCell align="right"># Rules</TableCell>
          <TableCell align="right">Last update</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        { children }
      </TableBody>
    </Table>
  );
}