import { CancelOutlined, DeleteOutline, EditOutlined, ErrorOutline, RestoreFromTrashOutlined } from "@mui/icons-material";
import { TableRow, TableCell, IconButton, TextField, Stack, Chip, Tooltip, Button, Typography, Link } from "@mui/material";
import React from "react";
import DatetimeCell from "apps/configurator/common/components/DatetimeCell";
import { MetricWithValuesAndCount, ValueWithHistoryCount, ValueWithHistoryCountAndSavedProps } from "@viss/db";
import { useValueTableRow } from "../hooks/useValueTableRow";
import { Else, If, Then } from "react-if";
import { Modal } from "apps/configurator/common/components/Modal";
import ValueHistoryChart from "./ValueHistoryChart";

export interface ValueTableRowProps {
  metric: MetricWithValuesAndCount,
  value: ValueWithHistoryCountAndSavedProps
  isEditable: boolean

  onKeyChange: (value: ValueWithHistoryCount, name: string) => void
  onNameChange: (value: ValueWithHistoryCount, name: string) => void
  onWeightChange: (value: ValueWithHistoryCount, weight: number) => void
  onRemove: (value: ValueWithHistoryCount) => void
  onRestore: (value: ValueWithHistoryCount) => void
}

function ValueTableRow({
  metric,
  value,
  form,
  isUnique,
  isDefault,
  isEditable,
  isHovering,
  modal,
  action,
  handleWeightChange,
  handleRemove,
  handleRestore
}: ReturnType<typeof useValueTableRow>) {

  return (
    <>
      <If condition={ isEditable }>
        <Then>
          <Modal
            key={ `edit-value-${value.id}` }
            title={ `Edit Value` }
            subtitle={ `Editing "${value.savedProps.name}" for ${metric.name} (${metric.key})` }
            open={ modal.edit.open }
            width="xs"
            close={ () => action.setModalOpen('edit', false) }
            actions={[
              <Button key={ `edit-cancel-${value.id}` } variant="text" color="error" onClick={ () => action.setModalOpen('edit', false) }>Cancel</Button>,
              <Button key={ `edit-confirm-${value.id}` } variant="contained" disabled={ form.edit.disabled || form.edit.error } onClick={ () => { action.saveChanges() } }>Save</Button>
            ]}
          >
            <Stack direction="row" spacing={ 1 }>
              <TextField
                sx={{ width: '70%' }}
                label="Key"
                name="key"
                value={ form.edit.input.key }
                error={ form.edit.error }
                helperText={ form.edit.error && "Key is not unique" }
                onChange={ action.updateEditFormField }
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
                value={ form.edit.input.weight }
                onChange={ action.updateEditFormField }
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
              value={ form.edit.input.name }
              onChange={ action.updateEditFormField }
              InputLabelProps={{
                style: {
                  fontSize: '14px'
                }
              }}
            />
          </Modal>
        </Then>
      </If>

      <Modal
        key={ `value-history-chart-${value.id}` }
        open={ modal.history.open }
        close={ () => action.setModalOpen('history', false) }
        title="Value History"
        subtitle={ `History for "${value.name}" (${value.key})` }
        width="xl"
      >
        <ValueHistoryChart 
          value={ value } 
          reload={ modal.history.open }
        />
      </Modal>

      <TableRow
        key={ `value-table-row-${value.id}` }
        onMouseEnter={ (event) => action.setIsHovering(true) }
        onMouseLeave={ (event) => action.setIsHovering(false) }
      >
        <TableCell>
          <If condition={ !isUnique }>
            <Then>
              <Tooltip title="Key is not unique">
                <ErrorOutline color="warning" fontSize="small" sx={{ marginTop: '4px' }} />
              </Tooltip>
            </Then>
          </If>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            { value.key }
          </Typography>
        </TableCell>
        
        <TableCell>
          { value.name }
          <If condition={ isDefault }>
            <Then>
              <Chip size="small" color="primary" label="default"/>
            </Then>
          </If>
          <If condition={ value.deleted }>
            <Then>
              <Tooltip title={ new Date(value.deletedAt).toLocaleDateString() }>
                <Chip size="small" color="error" label="deleted"/>
              </Tooltip>
            </Then>
          </If>
        </TableCell>
        
        <TableCell align="right">
          <If condition={ isEditable }>
            <Then>
              <Stack 
                direction="row" 
                spacing={ 0.7 }
                style={{
                  position: 'relative',
                  left: '25px'
                }}
              >
                <TextField
                  variant="standard"
                  type="number"
                  value={ value.weight }
                  onChange={ (event) => {
                    handleWeightChange(value, Number(event.target.value));
                    action.updateEditFormField(event);
                  }}
                  InputProps={{
                    inputProps: {
                      onKeyUp: (event) => {
                        if (event.key === 'Enter') {
                          event.currentTarget.blur();
                        }
                      },
                      onFocus: (event) => event.target.addEventListener('wheel', (event) => 
                        { event.preventDefault(); }, { 
                          passive: false 
                      }),
                      style: {
                        textAlign: 'right',
                        fontSize: '14px',
                        border: 'none'
                      },
                      step: '0.01',
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root::before': {
                      borderBottomStyle: 'none',
                      borderBottom: 0,
                      transition: 'none',
                    }
                  }}
                />
                <IconButton 
                  size="small" 
                  tabIndex={ -1 }
                  style={{ 
                    padding: 0, 
                    marginBottom: '3px',
                    visibility: value.weight === value.savedProps.weight ? 'hidden' : 'visible'
                  }}
                  onClick={ () => handleWeightChange(value, value.savedProps.weight) }
                >
                  <CancelOutlined fontSize="small" />
                </IconButton>
              </Stack>
            </Then>
            <Else>
              { value.weight.toString() }
            </Else>
          </If>
        </TableCell>
        
        <TableCell align="right">
          <If condition={ value._count.history !== 0 }>
            <Then>
              <Link
                color="primary"
                underline="hover"
                style={{ cursor: 'pointer' }}
                onClick={ () => action.setModalOpen('history', true) }
              >
                { value._count.history }
              </Link>
            </Then>
            <Else>
              { '' }
            </Else>
          </If>
        </TableCell>

        <DatetimeCell datetime={ value.updatedAt } />

        <TableCell>
          <Stack direction="row" spacing={ 0.3 }>
            <If condition={ isEditable }>
              <Then>
                <Tooltip title="Edit value">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={ (event) => action.setModalOpen('edit', true) }
                    style={{ visibility: isHovering ? 'visible' : 'hidden' }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>

                <If condition={ !isDefault }>
                  <Then>
                    <If condition={ !value.deleted }>
                      <Then>
                        <Tooltip title="Delete value">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={ (event) => handleRemove(value) }
                            style={{ visibility: isHovering ? 'visible' : 'hidden' }}
                          >
                            <DeleteOutline color="error" fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Then>
                      
                      <Else>
                        <If condition={ isUnique }>
                          <Then>
                            <Tooltip title="Restore value">
                              <IconButton 
                                size="small" 
                                color="primary" 
                                onClick={ (event) => handleRestore(value) }
                                style={{ visibility: isHovering ? 'visible' : 'hidden' }}
                              >
                                <RestoreFromTrashOutlined color="warning" fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Then>
                        </If>
                      </Else>
                    </If>
                  </Then>
                </If>
              </Then>
            </If>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  )
}

export default (props: ValueTableRowProps) => <ValueTableRow {...useValueTableRow(props)} />