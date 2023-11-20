import { Box, Button, Chip, Collapse, IconButton, Stack, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { KeyboardArrowUpOutlined, KeyboardArrowDownOutlined, EditOutlined, AddCircleOutline } from "@mui/icons-material"
import DatetimeCell from "apps/configurator/common/components/DatetimeCell"
import { MetricWithValuesAndCount } from "@viss/db"
import { useMetricTableRow } from "../hooks/useMetricTableRow"
import { Else, If, Then } from "react-if"
import { Modal } from "apps/configurator/common/components/Modal"
import { ValueTable } from "./ValueTable"
import { Value } from "@prisma/client"
import { PropsWithChildren } from "react"

export interface MetricTableRowProps {
  metric: MetricWithValuesAndCount
  totalValues: number
  isEditable: boolean
  isFiltering: boolean

  onRenameMetric: (metric: MetricWithValuesAndCount, name: string) => Promise<any>
  onAddValue: (metric: MetricWithValuesAndCount, value: Pick<Value, 'key' | 'name' | 'weight'>) => Promise<any> 
}

function MetricTableRow({
  isEditable,
  isFiltering,
  totalValues,
  metric,
  children,
  collapsed,
  isHovering,
  action,
  modal,
  form
}: ReturnType<typeof useMetricTableRow>) {
  return (
    <>

      <Modal
        key={ `rename-metric-name-${metric.id}` }
        open={ modal.rename.open }
        close={ () => action.closeModal('rename') }
        title="Rename Metric"
        subtitle={ `Rename "${metric.name}"`}
        actions={[
          <Button key={ `rename-cancel-${metric.id}` } variant="text" color="error" onClick={ () => action.closeModal('rename') }>Cancel</Button>,
          <Button key={ `rename-confirm-${metric.id}` } variant="contained" disabled={ form.rename.disabled } onClick={ () => { action.renameMetric() } }>Save</Button>
        ]}
        width="xs"
      >
        <TextField
          autoFocus
          placeholder="Metric name..."
          value={ form.rename.input.name }
          name="name"
          onChange={ action.updateRenameFormField }
        />
      </Modal>

      <Modal
        key={ `new-value-${metric.id}` }
        open={ modal.newValue.open }
        close={ () => action.closeModal('newValue') }
        title="New Value"
        subtitle={ `Create new value for "${metric.name} (${metric.key})"`}
        actions={[
          <Button key={ `new-value-cancel-${metric.id}` } variant="text" color="error" onClick={ () => action.closeModal('newValue') }>Cancel</Button>,
          <Button key={ `new-value-confirm-${metric.id}` } variant="contained" disabled={ form.newValue.disabled || form.newValue.error } onClick={ () => { action.addValue() } }>Save</Button>
        ]}
        width="xs"
      >
        <Stack direction="row" spacing={ 1 }>
          <TextField
            sx={{ width: '70%' }}
            label="Key"
            name="key"
            error={ form.newValue.error }
            helperText={ form.newValue.error && "Key is not unique" }
            onChange={ action.updateNewValueFormField }
            InputLabelProps={{
              style: {
                fontSize: '14px'
              }
            }}
            inputProps={{
              style: {
                textTransform: 'uppercase',
                fontSize: '14px'
              }
            }}
          />

          <TextField
            sx={{ width: '30%' }}
            label="Weight"
            type="number"
            name="weight"
            value={ form.newValue.input.weight }
            onChange={ action.updateNewValueFormField }
            InputLabelProps={{
              style: {
                fontSize: '14px'
              }
            }}
            inputProps={{
              style: {
                textTransform: 'uppercase',
                fontSize: '14px',
                textAlign: 'right'
              },
              step: '0.01'
            }}
          />
        </Stack>

        <TextField
          sx={{ mt: 1.5 }}
          multiline
          label="Name"
          name="name"
          onChange={ action.updateNewValueFormField }
          InputLabelProps={{
            style: {
              fontSize: '14px'
            }
          }}
        />

      </Modal>

      <TableRow 
        key={ `metric-table-row-${metric.id}` }
        onMouseEnter={ () => action.setIsHovering(true) }
        onMouseLeave={ () => action.setIsHovering(false) }
        onClick={ () => !isFiltering && action.toggleCollapsed() }
      >
        <TableCell width="30px">
          <IconButton
            size="small"
            disabled={ isFiltering }
          >
            <If condition={ isFiltering }>
              <Then>
                <KeyboardArrowUpOutlined />
              </Then>
              <Else>
                <If condition={ collapsed }>
                  <Then>
                    <KeyboardArrowDownOutlined />
                  </Then>
                  <Else>
                    <KeyboardArrowUpOutlined />  
                  </Else>
                </If>
              </Else>
            </If>
            </IconButton>
        </TableCell>
        <TableCell>
          { metric.key }
        </TableCell>
        <TableCell align="left" width="310px">
          <Typography variant="body2">
            { metric.name }
          </Typography>
        </TableCell>
        <TableCell align="center" width="100px">
          <Tooltip title={ metric.defaultValue?.weight }>
            <Chip label={ metric.defaultValue?.key } size="small" />
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          { totalValues }
        </TableCell>
        <TableCell align="right">
          { metric._count.rules }
        </TableCell>
        <DatetimeCell datetime={ metric.updatedAt } />
        <TableCell>
          <Stack 
            direction="row" 
            visibility={ isHovering ? 'visible' : 'hidden' }
          >
            <Tooltip title="Edit metric name">
              <IconButton 
                size="small" 
                color="primary" 
                onClick={ (event) => { 
                  event.stopPropagation(); 
                  action.openModal('rename');
                } }>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
      <TableRow style={{ height: 'auto' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'unset' }} colSpan={ 12 }>
          <Collapse in={ isFiltering || !collapsed } timeout={ 0 } unmountOnExit>
            <Box sx={{ margin: 1, marginBottom: 10 }}>
              <ValueTable>
                { children }
              </ValueTable>

              <If condition={ isEditable }>
                <Then>
                  <Button 
                    startIcon={
                      <AddCircleOutline fontSize="small"/>
                    }
                    disableRipple
                    fullWidth
                    color="inherit"
                    onClick={ () => action.openModal('newValue') }
                  />
                </Then>
              </If>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default (props: PropsWithChildren<MetricTableRowProps>) => <MetricTableRow {...useMetricTableRow(props) } />