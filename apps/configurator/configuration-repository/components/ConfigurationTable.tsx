import { Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

export const ConfigurationTable: React.FC<TableProps> = ({children, ...rest}) => {
  return (
    <Table {...rest}>
      <TableHead>
        <TableRow>
          <TableCell width="400px">Configuration name</TableCell>
          <TableCell width="50px" align="right">Version</TableCell>
          <TableCell align="right"># Values</TableCell>
          <TableCell align="right"># Rules</TableCell>
          <TableCell align="right">Created at</TableCell>
          <TableCell align="right">Last update</TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>
      <TableBody>
        { children }
      </TableBody>
    </Table>
  );
}