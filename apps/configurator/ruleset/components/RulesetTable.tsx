import { Table, TableBody, TableCell, TableHead, TableProps, TableRow } from "@mui/material";

export const RulesetTable: React.FC<TableProps> = ({children, ...rest}) => {
  return (
    <Table {...rest}>
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          <TableCell>Activate on</TableCell>
          <TableCell align="right">Created at</TableCell>
          <TableCell width="150px" />
        </TableRow>
      </TableHead>
      <TableBody>                  
        { children }
      </TableBody>
    </Table>
  )
}