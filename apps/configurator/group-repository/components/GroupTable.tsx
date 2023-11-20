import { Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

export const GroupTable: React.FC<TableProps> = ({children, ...rest}) => {
  return (
    <Table {...rest}>
      <TableHead>
        <TableRow>
          <TableCell>Key</TableCell>
          <TableCell>Name</TableCell>
          <TableCell align="center">Description</TableCell>
          <TableCell align="right">Last update</TableCell>
          <TableCell width="80px"/>
        </TableRow>
      </TableHead>
      <TableBody>
        { children }
      </TableBody>
    </Table>
  );
}