import { IconButton, Stack, TableCell, TableRow, Tooltip } from "@mui/material"
import { DeleteOutlined, KeyboardArrowRightOutlined } from "@mui/icons-material"
import DatetimeCell from "apps/configurator/common/components/DatetimeCell"
import { RuleWithMetricsAndValues } from "@viss/db"
import { If, Then } from "react-if"
import { useRulesetTableRow } from "../hooks/useRulesetTableRow"

export interface RulesetTableRowProps {
  rule: RuleWithMetricsAndValues

  onDelete: (rule: RuleWithMetricsAndValues) => void
}

const shorten = (str: string) => {
  return `${str.substring(0, 40)}${str.length > 40 ? '...' : ''}`;
}

function RulesetTableRow({
  rule,
  isHovering,
  action,
  handleDelete
}: ReturnType<typeof useRulesetTableRow>) {

  return (
    <TableRow
      onMouseEnter={ () => action.setIsHovering(true) }
      onMouseLeave={ () => action.setIsHovering(false) }
      hover
    >
      <TableCell>
        { `${rule.metric.name} (${rule.metric.key})` }
      </TableCell>

      <TableCell>
        <Stack direction="row">
          { `${rule.activationMetric.name} (${rule.activationMetric.key})` }
          <KeyboardArrowRightOutlined fontSize="small" />
          { 
            rule.activationValue ?
              `${shorten(rule.activationValue.name)} (${rule.activationValue.key})` :
              '*'
          }
        </Stack>
      </TableCell>

      <DatetimeCell datetime={ rule.createdAt } />

      <TableCell align="center">
        <If condition={ isHovering }>
          <Then>
            <Tooltip title="Delete rule" placement="top">
              <IconButton size="small" color="error" onClick={ () => handleDelete(rule) }>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Then>
        </If> 
      </TableCell>

    </TableRow>
  )
}

export default (props: RulesetTableRowProps) => <RulesetTableRow { ...useRulesetTableRow(props) } />;