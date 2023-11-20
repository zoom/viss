import { FormControl, InputLabel as MUIInputLabel, Select as MUISelect, MenuItem as MUIMenuItem, Divider, FormGroup, Button, InputLabelProps, SelectProps, MenuItemProps } from "@mui/material";
import { ConfigurationFull, RuleWithMetricsAndValues } from "@viss/db";
import React, {  } from "react";
import { If, Then } from "react-if";
import { Modal, ModalProps } from "apps/configurator/common/components/Modal";
import { useCreateRuleModal } from "../hooks/useCreateRuleModal";

export interface CreateRuleModalProps {
  configuration: ConfigurationFull
  rules: RuleWithMetricsAndValues[]

  onCreate: (metricId: string, activationMetricId: string, activationValueId: string) => void
}

const InputLabel: React.FC<InputLabelProps> = (props) => 
  <MUIInputLabel 
    sx={{
      fontSize: '14px',
      top: '-8px',
      '&.MuiInputLabel-shrink': {
        top: 1,
        backgroundColor: 'white',
        paddingX: '4px'
      }
    }} 
    {...props} 
  />

const Select: React.FC<SelectProps> = (props) => 
  <MUISelect 
    size="small"
    {...props}
  />

const MenuItem: React.FC<MenuItemProps> = (props) =>
  <MUIMenuItem
    sx={{ fontSize: '14px' }}
    {...props}
  />

function CreateRuleModal({
  configuration,
  rules,
  form,
  action,
  ...rest
}: ReturnType<typeof useCreateRuleModal>) {

  return (
    <Modal
      { ...rest }
      actions={[
        <Button key={ `create-rule-cancel` } variant="text" color="error" onClick={ () => { rest.close() } }>Cancel</Button>,
        <Button key={ `create-rule-confirm` } variant="contained" disabled={ false } onClick={ () => { action.handleCreate() } }>Save</Button>
      ]}
    >
      <FormGroup>
        <FormControl>
          <InputLabel>
            Metric
          </InputLabel>
          <Select
            name="metric"
            value={ form.select.metric }
            onChange={ action.updateRuleFormField }
            sx={{
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {
              configuration
                .metrics
                .map(metric => (
                  <MenuItem value={ metric.id }>
                    { `${metric.key} - ${metric.name}` }
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
        
        <Divider sx={{ my: 2 }} />

        <FormControl>
          <InputLabel>
            Activation metric
          </InputLabel>
          <Select
            name="activationMetric"
            value={ form.select.activationMetric }
            onChange={ action.updateRuleFormField }
            sx={{ fontSize: '14px' }}
            disabled={ !form.select.metric }
          >
            {
              configuration
                .metrics
                .filter(metric => metric.id !== form.select.metric)
                .map(metric => (
                  <MenuItem value={ metric.id }>
                    { `${metric.key} - ${metric.name}` }
                  </MenuItem>
                ))
            }
          </Select>
        </FormControl>
        
        <If condition={ !!form.select.activationMetric }>
          <Then>
            <FormControl sx={{ mt: 1.5 }}>
              <InputLabel>
                Activation value
              </InputLabel>
              <Select
                name="activationValue"
                value={ form.select.activationValue }
                onChange={ action.updateRuleFormField }
                sx={{ fontSize: '14px' }}
                disabled={ !form.select.activationMetric }
              >
                <MenuItem value={ 'any' }>
                  Any
                </MenuItem>
                {
                  (configuration
                    .metrics
                    .find(metric => metric.id === form.select.activationMetric)
                    ?.values || [])
                    .map(value => (
                      <MenuItem value={ value.id }>
                        { `${value.key} - ${value.name}` }
                      </MenuItem>
                    ))
                }
              </Select>
            </FormControl>
          </Then>
        </If>
      </FormGroup>
    </Modal>
  )
}

export default (props: CreateRuleModalProps & ModalProps) => <CreateRuleModal { ...useCreateRuleModal(props) } />