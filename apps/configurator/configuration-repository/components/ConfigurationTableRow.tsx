import React from "react";
import { Chip, Divider as MuiDivider, IconButton, Link, Menu, MenuList, TableCell, TableRow, Tooltip, MenuItem, ListItemIcon, ListItemText, Button, TextField } from "@mui/material";
import DatetimeCell from "apps/configurator/common/components/DatetimeCell";
import { useConfigurationTableRow } from "../hooks/useConfigurationTableRow";
import { Else, If, Then } from "react-if";
import { toPrintableVersion } from "@viss/viss";
import { DeleteOutlined, EditOutlined, MoreVert, RestoreFromTrashOutlined, ShuffleOutlined, StarOutlined } from "@mui/icons-material";
import { Modal } from "apps/configurator/common/components/Modal";
import { Config, colors, starWars, uniqueNamesGenerator } from "unique-names-generator";
import { ConfigurationWithVersionAndCount } from "@viss/db";

export interface ConfigurationTableRowProps {
  configuration: ConfigurationWithVersionAndCount

  onRename: (configuration: ConfigurationWithVersionAndCount, name: string) => Promise<any>
  onDuplicate: (configuration: ConfigurationWithVersionAndCount, name: string) => Promise<any>
  onAssignVersion: (configuration: ConfigurationWithVersionAndCount) => Promise<any>
  onSetActive: (configuration: ConfigurationWithVersionAndCount) => Promise<any>
  onRemove: (configuration: ConfigurationWithVersionAndCount) => Promise<any>
  onRestore: (configuration: ConfigurationWithVersionAndCount) => Promise<any>
};

const Divider: React.FC = () => <MuiDivider style={{ marginTop: 4, marginBottom: 4 }} />;

function ConfigurationTableRow({ 
  configuration, 
  modal, 
  actionMenu, 
  form, 
  action 
}: ReturnType<typeof useConfigurationTableRow>) {
  return (
    <>
      <Modal
        key={ `rename-modal-${configuration.id}` }
        open={ modal.rename.open }
        close={ () => action.closeModal('rename') }
        title="Rename Configuration"
        subtitle={ `Rename "${configuration.name}"` }
        actions={[
          <Button key={ `rename-cancel-${configuration.id}` } variant="text" color="error" onClick={ () => action.closeModal('rename') }>Cancel</Button>,
          <Button key={ `rename-confirm-${configuration.id}` } variant="contained" disabled={ form.rename.disabled } onClick={ () => { action.rename() } }>Save</Button>
        ]}
        width="xs"
      >
        <TextField
          autoFocus
          placeholder="Configuration name..."
          value={ form.rename.input.name }
          name="configuration-name"
          onChange={ action.updateRenameFormField }
          InputProps={{ 
            endAdornment: 
            <Tooltip title="Random name">
              <IconButton size="small" onClick={ () => action.generateRandomName('rename') }>
                <ShuffleOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          }}
        />
      </Modal>

      <Modal
        key={ `assign-version-modal-${configuration.id}` }
        open={ modal.assignVersion.open }
        close={ () => action.closeModal('assignVersion') }
        title="Assign Version"
        subtitle={ `Assigning a version can't be undone. Only proceed once the configuration is ready to be published.` }
        actions={[
          <Button key={ `assign-version-cancel-${configuration.id}` } variant="text" color="error" onClick={ () => action.closeModal('assignVersion') }>Cancel</Button>,
          <Button key={ `assign-version-confirm-${configuration.id}` } variant="contained" onClick={ () => { action.assignVersion() } }>Assign Version</Button>
        ]}
        width="xs"
      />

      <Modal
        key={ `duplicate-modal-${configuration.id}` }
        open={ modal.duplicate.open }
        close={ () => action.closeModal('duplicate') }
        title="Duplicate Configuration"
        subtitle={ `Duplicate "${configuration.name}" configuration`}
        actions={[
          <Button key={ `duplicate-cancel-${configuration.id}` } variant="text" color="error" onClick={ () => action.closeModal('duplicate') }>Cancel</Button>,
          <Button key={ `duplicate-confirm-${configuration.id}` } variant="contained" disabled={ form.duplicate.disabled } onClick={ () => { action.duplicate() } }>Duplicate</Button>
        ]}
        width="xs"
      >
        <TextField
          autoFocus
          placeholder="Configuration name..."
          value={ form.duplicate.input.name }
          name="configuration-name"
          onChange={ action.updateDuplicateFormField }
          InputProps={{ 
            endAdornment: 
            <Tooltip title="Random name">
              <IconButton size="small" onClick={ () => action.generateRandomName('duplicate') }>
                <ShuffleOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          }}
        />
      </Modal>

      <TableRow key={ `configuration-table-row-${configuration.id}` } hover>
        <TableCell>
          <Link underline="none" href={ `/configuration/${configuration.id}` }>
            { configuration.name }
          </Link>
          <If condition={ !!configuration.active }>
            <Then>
              <Tooltip title={ new Date(configuration.active).toDateString() }>
                <Chip color="primary" size="small" label="active" />
              </Tooltip>
            </Then>
          </If>
          <If condition={ configuration.deleted && !!configuration.deletedAt }>
            <Then>
              <Tooltip title={ new Date(configuration.deletedAt).toDateString() } >
                <Chip color="error" size="small" label="deleted" />
              </Tooltip>
            </Then>
          </If>
        </TableCell>

        <TableCell align="right">
          <If condition={ !!configuration.version }>
            <Then>
              { toPrintableVersion(configuration.version?.id) }
            </Then>
          </If>
        </TableCell>

        <TableCell align="right">
          <If condition={ !!configuration._count }>
            <Then>
              { String(configuration._count.values) }
            </Then>
          </If>
        </TableCell>

        <TableCell align="right">
          <Link href={ `/configuration/${configuration.id}/ruleset` } underline="hover">
            <If condition={ !!configuration._count }>
              <Then>
                { String(configuration._count.rules) }
              </Then>
            </If>
          </Link>
        </TableCell>

        <DatetimeCell datetime={ configuration.createdAt } />
        
        <DatetimeCell datetime={ configuration.updatedAt } />

        <TableCell align="right">
          <IconButton
            onClick={ (event) => actionMenu.open(event.currentTarget) }
            disableFocusRipple
          >
            <MoreVert fontSize="small"></MoreVert>
          </IconButton>
          <Menu
            anchorEl={ actionMenu.anchorElement }
            open={ actionMenu.isOpen }
            onClose={ () => actionMenu.close() }
            disableRestoreFocus
          >
            <MenuList dense style={{ padding: 0 }}>
              <MenuItem>
                <ListItemIcon />
                <Link underline="none" color="inherit" href={ `configuration/${configuration.id}/ruleset` }>
                  Rules
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem onClick={ () => action.openModal('rename') }>
                <ListItemIcon>
                  <EditOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename...</ListItemText>
              </MenuItem>
              <MenuItem onClick={ () => action.openModal('duplicate') }>
                <ListItemIcon />
                <ListItemText>Duplicate...</ListItemText>
              </MenuItem>
              <MenuItem disabled={ !!configuration.active || !!configuration.version || configuration.deleted || configuration.deletedAt !== null } onClick={ () => action.openModal('assignVersion') }>
                <ListItemIcon />
                <ListItemText>Assign Version</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem disabled={ !configuration.version || configuration.active !== null } onClick={ () => action.setActive() }>
                <ListItemIcon>
                  <StarOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>Set Active</ListItemText>
              </MenuItem>
              <If condition={ !configuration.base }>
                <Then>
                  <Divider />
                  <If condition={ configuration.deleted }>
                    <Then>
                      <MenuItem onClick={ () => action.restore() }>
                        <ListItemIcon>
                          <RestoreFromTrashOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Restore</ListItemText>
                      </MenuItem>
                    </Then>
                    <Else>
                    <MenuItem disabled={ configuration.base || configuration.active !== null } onClick={ () => action.remove() }>
                      <ListItemIcon>
                        <DeleteOutlined fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                    </Else>
                  </If>
                </Then>
              </If>
            </MenuList>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  )
}

export default (props: ConfigurationTableRowProps) => <ConfigurationTableRow { ...useConfigurationTableRow(props) } />