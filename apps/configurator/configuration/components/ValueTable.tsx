import { Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

export const ValueTable: React.FC<TableProps> = ({children, ...rest}) => {
  return (
    <Table {...rest}>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell width="30px">Key</TableCell>
          <TableCell width="420px">Name</TableCell>
          <TableCell width="150px" align="right">Weight</TableCell>
          <TableCell width="130px" align="right">History</TableCell>
          <TableCell width="160px" align="right">Last update</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>                  
        { children }
      </TableBody>
    </Table>
  )
}