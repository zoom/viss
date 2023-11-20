import { Badge, Button, Chip, Container, Divider, IconButton, InputAdornment, Paper, TableContainer, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { ConfigurationFull, ConfigurationFullInclude, database } from "@viss/db";
import Navbar from "apps/configurator/common/components/Navbar";
import { GetServerSidePropsContext } from "next";
import React, {  } from "react";
import Notification from "apps/configurator/notification/components/Notification";
import { MetricTable } from "apps/configurator/configuration/components/MetricTable";
import MetricTableRow from "apps/configurator/configuration/components/MetricTableRow";
import { Header } from "apps/configurator/common/components/Header";
import { useConfigurationPage } from "../../../configuration/hooks/useConfigurationPage";
import ValueTableRow from "apps/configurator/configuration/components/ValueTableRow";
import { Modal } from "apps/configurator/common/components/Modal";
import ReviewChangesList from "apps/configurator/configuration/components/ReviewChangesList";
import { DeleteOutlined, InventoryOutlined, SearchOutlined } from "@mui/icons-material";
import { If, Then } from "react-if";
import CalculatorDrawer from "apps/configurator/configuration/components/CalculatorDrawer";
import { Group } from "@prisma/client";
import Breadcrumbs from "apps/configurator/common/components/Breadcrumbs";
import { toPrintableVersion } from "@viss/viss";

export const getServerSideProps = async(props: GetServerSidePropsContext) => {
  if (!props.query.id) {
    return {
      notFound: true
    } 
  }

  const configuration = await database.configuration.findUnique({
    where: {
      id: String(props.query.id)
    },
    include: ConfigurationFullInclude
  });

  if (!configuration) {
    return {
      notFound: true
    }
  }

  const groups = await database.group.findMany({
    orderBy: {
      index: 'asc'
    }
  });

  return {
    props: {
      configuration: JSON.parse(JSON.stringify(configuration)),
      groups: JSON.parse(JSON.stringify(groups))
    }
  }
}

export interface ConfigurationPageProps {
  configuration: ConfigurationFull
  groups: Group[]
}

function ConfigurationPage({
  configuration,
  groups,
  draftsCount,
  searchTerm,
  modal,
  action,
  filter,
  changeValueProp,
  handleSaveChanges,
  handleMetricRename,
  handleAddValue
}: ReturnType<typeof useConfigurationPage>) {

  return (
    <>
      <Navbar />

      <Notification />

      <Container sx={{ mt: 2, mb: 20 }}>
        <Breadcrumbs 
          items={[
            { item: 'Configurations', link: '/configuration' },
            { item: configuration.name }
          ]}
        />

        <Header 
          title="Configuration"
          subtitle={ 
            <>
              { configuration.name }
              { configuration.version && <Chip label={ toPrintableVersion(configuration.version.id) } size="small" /> }
              { configuration.active && <Chip label="active" size="small" color="primary" /> }
              { configuration.deleted && <Chip label="deleted" size="small" color="error" /> }
            </>
          }
        >
          <If condition={ !configuration.version }>
            <Then>
              <ToggleButtonGroup size="small">
                <Tooltip title="Show deleted">
                  <ToggleButton 
                    value="deleted" 
                    color="primary"
                    selected={ filter.deleted }
                    onClick={ () => { action.toggleFilter('deleted') } }
                  >
                    <DeleteOutlined fontSize="small" />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Then>
          </If>
          
          <TextField 
            variant="outlined" 
            placeholder="Search..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment>
            }}
            onChange={ (event) => { action.setSearchTerm(event.target.value) } }
          />
          
          <If condition={ !configuration.version }>
            <Then>
              <ToggleButtonGroup size="small">
                <Tooltip title="Review changes..." disableFocusListener>
                  <Badge badgeContent={ draftsCount } color="warning">
                    <IconButton disableRipple onClick={ () => action.setModalOpen('reviewChanges', true) } size="small">
                      <InventoryOutlined fontSize="small" />
                    </IconButton>
                  </Badge>
                </Tooltip>
              </ToggleButtonGroup>
            </Then>
          </If>
          
          <If condition={ !configuration.version }>
            <Then>
              <Divider />
            </Then>
          </If>
          
          <If condition={ !configuration.version }>
            <Then>
              <Button
                variant="outlined"
                onClick={ () => handleSaveChanges() }
              >
                Save
              </Button>
            </Then>
          </If>
        </Header>

        <Modal
          key="modal-review-changes"
          open={ modal.reviewChanges.open }
          title="Review Changes"
          subtitle="Review changes before saving"
          width="sm"
          close={ () => action.setModalOpen('reviewChanges', false) }
          dense
          actions={[
            <Button key={ `close-review` } variant="contained" onClick={ () => { action.setModalOpen('reviewChanges', false) } }>Close</Button>
          ]}
        >
          <ReviewChangesList 
            metrics={ configuration.metrics }
            onChangeValueProp={ changeValueProp }
          />
        </Modal>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <MetricTable>
            {
              configuration
                .metrics
                .map((metric) => (
                  <If condition={ metric.values.some(filter.bySearchTerm) } >
                    <Then>
                      <MetricTableRow
                        key={ `metric-row-${metric.id}` }
                        isEditable={ !configuration.version }
                        isFiltering={ !!searchTerm }
                        metric={ metric } 
                        totalValues={ metric.values.filter(filter.byDeletedState).length }
                        onRenameMetric={ handleMetricRename }
                        onAddValue={ handleAddValue }
                      >
                        {
                          metric
                            .values
                            .filter(filter.byDeletedState)
                            .map((value) => (
                              <If condition={ filter.bySearchTerm(value) }>
                                <Then>
                                  <ValueTableRow
                                    key={ `value-row-${value.id}` }
                                    metric={ metric }
                                    value={ value }
                                    isEditable={ !configuration.version }
                                    onKeyChange={ (value, key) => changeValueProp(value, 'key', key) }
                                    onNameChange={ (value, name) => changeValueProp(value, 'name', name) }
                                    onWeightChange={ (value, weight) => changeValueProp(value, 'weight', Number(weight)) }
                                    onRemove={ (value) => changeValueProp(value, 'deleted', true) }
                                    onRestore={ (value) => changeValueProp(value, 'deleted', false) }
                                  />
                                </Then>
                              </If>
                          ))
                        }
                      </MetricTableRow>
                    </Then>
                  </If>
                ))
            }
          </MetricTable>
        </TableContainer> 

      </Container>

      <CalculatorDrawer
        configuration={ configuration }
        groups={ groups }
      />

    </>
  )
}

export default (props: ConfigurationPageProps) => <ConfigurationPage { ...useConfigurationPage(props) } />;