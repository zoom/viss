import { Chip, IconButton, List, ListItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import { CancelOutlined, KeyboardArrowRightOutlined } from "@mui/icons-material";
import { useState } from "react";
import { MetricWithValuesAndCountAndSavedProps, ValueWithHistoryCount, ValueWithHistoryCountAndSavedProps } from "@viss/db";
import { useReviewChangesList } from "../hooks/useReviewChangesList";
import { Case, Else, If, Switch, Then } from "react-if";

const props = ['key', 'name', 'weight', 'deleted'];

type EditableValueProps = 'key' | 'name' | 'weight' | 'deleted';

export interface ReviewChangesList {
  metrics: MetricWithValuesAndCountAndSavedProps[]
  onChangeValueProp: (value: ValueWithHistoryCount, prop: EditableValueProps, to: string | number | boolean) => void
}

export interface ReviewChangesListItem {
  value: ValueWithHistoryCountAndSavedProps
  prop: string
  
  onChangeValueProp: (value: ValueWithHistoryCount, prop: EditableValueProps, to: string | number | boolean) => void
}

function ReviewChangesListItem({ value, prop, onChangeValueProp }: ReviewChangesListItem) {
  const [showCancel, setShowCancel] = useState(false);

  const listItemSx = { maxWidth: '120px', width: '120px' };

  return (
    <ListItem 
      key={ `review-changes-list-item-${value.id}-${prop}` }
      onMouseEnter={ () => setShowCancel(true) }
      onMouseLeave={ () => setShowCancel(false) }
      secondaryAction={
        <IconButton 
          size="small" 
          sx={{ visibility: showCancel ? 'visible' : 'hidden' }}
          onClick={ () => onChangeValueProp(value, prop as EditableValueProps, value.savedProps[prop]) }
        >
          <CancelOutlined fontSize="small" />
        </IconButton> 
      }
    >
      <Switch>
        <Case condition={ prop === 'key' || prop === 'weight' }>
          <ListItemText sx={ listItemSx }>
            <Typography variant="body2" noWrap>
              { String(value.savedProps[prop]) }
            </Typography>
          </ListItemText>
          <ListItemIcon>
            <KeyboardArrowRightOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={ listItemSx }>
            <Typography variant="body2" noWrap>
              { String(value[prop]) }
            </Typography>
          </ListItemText>
        </Case>

        <Case condition={ prop === 'name' }>
          <ListItemText sx={ listItemSx }>
            <Tooltip title={ value.savedProps.name }>
              <Typography variant="body2" noWrap>
                { value.savedProps.name }
              </Typography>
            </Tooltip>
          </ListItemText>
          <ListItemIcon>
            <KeyboardArrowRightOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={ listItemSx }>
            <Tooltip title={ value.savedProps.name }>
              <Typography variant="body2" noWrap>
                { value.name }
              </Typography>
            </Tooltip>
          </ListItemText>
        </Case>

        <Case condition={ prop === 'deleted' }>
          <ListItemIcon sx={ listItemSx }>
            <Chip size="small" sx={{ marginLeft: 0 }} label={ value[prop] ? 'delete' : 'restore' } />
          </ListItemIcon>
        </Case>
      </Switch>
    </ListItem>
  )
}

function ReviewChangesList({ 
  metrics,
  handleChangeValueProp
}: ReturnType<typeof useReviewChangesList>) {
  return (
    <If condition={ metrics.length > 0 }>
      <Then>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {
                metrics.map(metric => (
                  metric.values.map(value => (
                    <TableRow
                      key={ `review-changes-value-${value.id}` }
                    >
                      <TableCell sx={{ maxWidth: '150px' }}>
                        <Typography variant="body2">{ metric.key } - { value.key }</Typography>
                        <Typography variant="subtitle2" color="grey" noWrap>{ value.savedProps.name }</Typography>
                      </TableCell>
                      <TableCell>
                        <List dense>
                          {
                            props.map(prop => (
                              value[prop] !== value.savedProps[prop] &&
                                <ReviewChangesListItem
                                  key={ `review-changes-list-item-${value.id}-${prop}` }
                                  value={ value }
                                  prop={ prop }
                                  onChangeValueProp={ handleChangeValueProp }
                                />
                            ))
                          }
                        </List>
                      </TableCell>
                    </TableRow>
                  ))
                ))
              }
            </TableBody>
          </Table> 
        </TableContainer>
      </Then>
      <Else>
        <Typography 
          textAlign="center" 
          variant="body2" 
          color="grey"
          my={ 2 }
        >
          No changes...
        </Typography>
      </Else>
    </If>
    
  )
}

export default (props: ReviewChangesList) => <ReviewChangesList {...useReviewChangesList(props) } />