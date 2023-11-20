import { ArticleOutlined, EditOutlined } from "@mui/icons-material"
import { Button, IconButton, TableCell, TableRow, TextField, Tooltip } from "@mui/material"
import { Group } from "@prisma/client"
import DatetimeCell from "apps/configurator/common/components/DatetimeCell"
import { Modal } from "apps/configurator/common/components/Modal";
import { MdEditor } from "md-editor-rt";
import { If, Then } from "react-if";
import { useGroupTableRow } from "../hooks/useGroupTableRow";

export interface GroupTableRowProps {
  group: Group,

  onChange: (id: string, name?: string, description?: string) => Promise<any>
}

function GroupTableRow({ 
  group, 
  modal,
  action,
  form,
  isHovering
}: ReturnType<typeof useGroupTableRow>) {
  return (
    <>
      <Modal
        open={ modal.rename.open }
        close={ () => action.setModalOpen('rename', false) }
        title="Edit Name"
        subtitle={ `Edit "${group.name}"`}
        width="xs"
        actions={[
          <Button key={ `rename-cancel-${group.id}` } variant="text" color="error" onClick={ () => action.setModalOpen('rename', false) }>Cancel</Button>,
          <Button key={ `rename-confirm-${group.id}` } variant="contained" disabled={ form.rename.disabled } onClick={ () => { action.renameGroup() } }>Save</Button>
        ]}
      >
        <TextField
          autoFocus
          placeholder="Group name..."
          value={ form.rename.input.name }
          name="group-name"
          onChange={ action.updateRenameFormInput }
        />
      </Modal>

      <Modal
        open={ modal.description.open }
        close={ () => action.setModalOpen('description', false) }
        title="Edit Description"
        subtitle={ `Edit description for "${group.name}"`}
        width="xl"
        actions={[
          <Button key={ `description-cancel-${group.id}` } variant="text" color="error" onClick={ () => action.setModalOpen('description', false) }>Cancel</Button>,
          <Button key={ `description-confirm-${group.id}` } variant="contained" onClick={ () => { action.updateDescription() } }>Save</Button>
        ]}
      >
        <MdEditor 
          language="en-US" 
          modelValue={ form.description.input.description || '' } 
          onChange={ action.updateDescriptionFormField } 
        />
      </Modal>

      <TableRow
        onMouseEnter={() => action.setIsHovering(true) }
        onMouseLeave={() => action.setIsHovering(false) }
      >
        <TableCell>
          { group.key }
        </TableCell>
        
        <TableCell>
          { group.name }
        </TableCell>
        
        <TableCell align="center">
          <IconButton onClick={ () => action.setModalOpen('description', true) } size="small">
            <ArticleOutlined fontSize="small" />       
          </IconButton>
        </TableCell>

        <DatetimeCell datetime={ group.updatedAt } />
        
        <TableCell>
          <If condition={ isHovering }>
            <Then>
              <Tooltip placement="top" title="Edit name...">
                <IconButton onClick={ () => action.setModalOpen('rename', true) } size="small">
                  <EditOutlined fontSize="small" color="primary" />       
                </IconButton>
              </Tooltip>
            </Then>
          </If>
        </TableCell>
      </TableRow>
    </>
  )
}

export default (props: GroupTableRowProps) => <GroupTableRow { ...useGroupTableRow(props) } />;