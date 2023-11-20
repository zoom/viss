import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";
import { Backdrop, Box, Button, Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Typography, styled } from "@mui/material";
import { ConfigurationFullWithSavedProps } from "@viss/db";
import { useCalculatorDrawer } from "../hooks/useCalculatorDrawer";
import { Else, If, Then } from "react-if";
import { Group } from "@prisma/client";
import { scoreToImpact } from "@viss/viss";

export interface CalculatorDrawerProps {
  configuration: ConfigurationFullWithSavedProps
  groups: Group[]
}

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  borderRadius: 0,
  left: 'calc(50% - 15px)',
}));

function CalculatorDrawer({
  configuration,
  groups,
  selection,
  score,
  open,
  action
}: ReturnType<typeof useCalculatorDrawer>) {

  return (
    <>
      <Backdrop 
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: `calc(100vh - ${ open ? '500px' : '120px' })`
        }}
        open={ open }
        onClick={ () => action.setOpen(false) }
      />

      <Container
        maxWidth={ false }
        sx={{
          position: 'fixed',
          bottom: 0,
          borderTop: 1,
          borderColor: 'rgba(224, 224, 224, 1)',
          background: 'white',
          height: open ? '500px' : '120px'
        }}
      >
        <Grid 
          container 
          justifyContent="center"
          marginTop={ 0.3 }
          paddingBottom={ 1 }
        >
          <Grid item xs={ 1 }>
            <Puller>
              <IconButton onClick={ () => action.setOpen(!open) } size="small" >
                <If condition={ open }>
                  <Then>
                    <KeyboardArrowDownOutlined />
                  </Then>
                  <Else>
                    <KeyboardArrowUpOutlined />
                  </Else>
                </If>
              </IconButton>
            </Puller>  
          </Grid>
        </Grid>

        <Container>
          <Grid 
            container 
            marginTop={ 3 }
          >
            {
              [
                { label: 'Infrastructure', score: 'infrastructure' },
                { label: 'Tenancy', score: 'tenancy' },
                { label: 'Data', score: 'data' },
                { label: 'VISS', score: 'viss' },
              ].map(entry => (
                <>
                  <Grid item xs={ 2 }>
                    <Typography variant="body1" color="primary">{ entry.label }</Typography>
                    <Typography variant="subtitle2" color="grey">{ scoreToImpact(score[entry.score]) }</Typography>
                  </Grid>
                  <Grid item xs={ 1 }>
                    <Typography variant="h6" color="grey" fontWeight={ 300 } sx={{ textAlign: 'left' }}>{ score[entry.score] }</Typography>
                    <If condition={ entry.label === 'VISS' }>
                      <Then>
                        <Button 
                          color="warning"
                          onClick={ () => action.reset() }
                        >
                          Reset
                        </Button>
                      </Then>
                    </If>
                  </Grid>    
                </>
              ))
            }
          </Grid>
        </Container>

        <Container
          sx={{
            visibility: open ? 'visible' : 'hidden',
            marginTop: 3
          }}
        >
          {
            groups.map(group => (
              <Grid container marginTop={ 0.5 } spacing={ 1 }>
                <Grid item xs={ 2 }>
                  <Typography variant="body2" paddingTop={ 1 } noWrap>
                    { group.name }
                  </Typography>
                </Grid>

                {
                  configuration
                    .metrics
                    .filter(metric => metric.groupKey === group.key)
                    .map(metric => (

                      <Grid item xs={ 3 }>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontSize: '14px',
                            top: '-8px',
                            '&.MuiInputLabel-shrink': {
                              top: 1,
                              backgroundColor: 'white',
                              paddingX: '4px'
                            }
                          }}
                        >
                          { metric.name }
                        </InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          sx={{
                            fontSize: '14px'
                          }}
                          name={ metric.key }
                          value={ selection[metric.key] }
                          onChange={ action.updateSelectField }
                        >
                          {
                            metric
                              .values
                              .filter(value => !value.deleted )
                              .map(value => (
                                <MenuItem
                                  sx={{
                                    fontSize: '14px'
                                  }}
                                  value={ value.key }
                                >
                                  { value.name }
                                </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                    ))
                }
              </Grid>
            ))
          }
        </Container>
      </Container>
    </>
  )
}

export default (props: CalculatorDrawerProps) => <CalculatorDrawer { ...useCalculatorDrawer(props) } />;