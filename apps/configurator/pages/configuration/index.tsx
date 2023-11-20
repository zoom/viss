import { ConfigurationWithVersionAndCount, ConfigurationWithVersionAndCountInclude, database } from "@viss/db";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Navbar from "../../common/components/Navbar";
import { ConfigurationTable } from "apps/configurator/configuration-repository/components/ConfigurationTable";
import { TableContainer, Paper, Container, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, TableRow, TableCell, Button, IconButton } from "@mui/material";
import { DeleteOutlined, PinOutlined, SearchOutlined, ShuffleOutlined } from "@mui/icons-material";
import Notification from "apps/configurator/notification/components/Notification";
import ConfigurationTableRow from "apps/configurator/configuration-repository/components/ConfigurationTableRow";
import { Header } from "apps/configurator/common/components/Header";
import { Else, If, Then } from "react-if";
import { Modal } from "apps/configurator/common/components/Modal";
import { useConfigurationRepositoryPage } from "apps/configurator/configuration/hooks/useConfigurationRepositoryPage";

export interface ConfigurationRepositoryPageProps {
  configurations: ConfigurationWithVersionAndCount[]
};

export const getServerSideProps: GetServerSideProps<{
  configurations: ConfigurationWithVersionAndCount[]
}> = async() => {

  const configurations = await database.configuration.findMany({
    include: ConfigurationWithVersionAndCountInclude
  });

  return {
    props: {
      configurations: [...JSON.parse(JSON.stringify(configurations))]
    }
  }
}

function ConfigurationRepositoryPage({ 
  configurations,
  modal,
  action,
  filter,
  form,
  handleRenameConfiguration,
  handleDuplicateConfiguration,
  handleAssignConfigurationVersion,
  handleSetActive,
  handleRemove,
  handleRestore
}: ReturnType<typeof useConfigurationRepositoryPage>) {
  return (
    <>
      <Navbar />

      <Notification />
      
      <Modal
        open={ modal.create.open }
        title="Create New Configuration"
        subtitle="New configurations contain default values only"
        width="xs"
        actions={[
          <Button key={ `create-configuration-cancel` } variant="text" color="error" onClick={ () => action.closeModal('create') }>Cancel</Button>,
          <Button key={ `create-configuration-confirm` } variant="contained" disabled={ form.create.disabled } onClick={ () => { action.create() } }>Create</Button>
        ]}
      >
        <TextField
          autoFocus
          placeholder="Configuration name..."
          name="configuration-name"
          value={ form.create.input.name }
          onChange={ action.updateCreateFormInput }
          InputProps={{ 
            endAdornment: 
            <Tooltip title="Random name">
              <IconButton size="small" onClick={ () => action.generateRandomName() }>
                <ShuffleOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          }}
        />
      </Modal>

      <Container sx={{ mt: 2, mb: 10 }}>
        <Header
          title="Configurations"
          subtitle="Available configurations"
        >
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
            <Tooltip title="Show versioned only">
              <ToggleButton 
                value="versioned" 
                color="primary"
                selected={ filter.versionedOnly }
                onClick={ () => { action.toggleFilter('versionedOnly') } }
              >
                <PinOutlined fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
          <TextField 
            variant="outlined" 
            placeholder="Search..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment>
            }}
            onChange={ (event) => { action.setSearchTerm(event.target.value) } }
          />
          <Button variant="contained" onClick={ () => { action.openModal('create') } }>New</Button>
        </Header>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <ConfigurationTable size="small">
            <If condition={ !configurations || configurations.length === 0 }>
              <Then>
                <TableRow>
                  <TableCell colSpan={ 7 } align="center">
                    <Typography variant="subtitle2" color="grey" fontStyle="italic">No results...</Typography>
                  </TableCell>
                </TableRow>
              </Then>
              <Else>
                {
                  configurations
                    .map(row => (
                      <ConfigurationTableRow
                        key={ `configuration-table-row-${row.id}` }
                        configuration={ row }
                        onRename={ handleRenameConfiguration }
                        onDuplicate={ handleDuplicateConfiguration }
                        onAssignVersion={ handleAssignConfigurationVersion }
                        onSetActive={ handleSetActive }
                        onRemove={ handleRemove }
                        onRestore={ handleRestore }
                      />
                    ))
                }
              </Else>
            </If>
          </ConfigurationTable>
        </TableContainer>
      </Container>
    </>
  )  
}

export default (props: InferGetServerSidePropsType<typeof getServerSideProps>) => <ConfigurationRepositoryPage {...useConfigurationRepositoryPage(props)} />;
