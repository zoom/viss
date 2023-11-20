import React, { useState } from 'react';
import { Button, Container, Dialog, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { ConfigurationBasic, ConfigurationBasicSelect, RuleBasic, RuleBasicSelect, database } from "@viss/db";
import 'md-editor-rt/lib/style.css';
import Header from 'apps/calculator/components/Header';
import { scoreToImpact } from '@viss/viss';
import { Group } from '@prisma/client';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { If, Then } from "react-if";
import { useCalculatorPage } from '../../hooks/useCalculatorPage';
import withStaticFiles from 'apps/calculator/utils/withStaticFiles';

export const getServerSideProps = withStaticFiles(async(props: GetServerSidePropsContext) => {
  if (!props.params?.version) {
    return {
      notFound: true
    }
  }

  const version = Number(props.params.version) * 100;

  if (Number.isNaN(version) || !Number.isInteger(version)) {
    return {
      notFound: true
    }
  }

  if (!await database.configurationVersion.findUnique({
    where: {
      id: version
    }
  })) {
    return {
      notFound: true
    }
  }

  const configuration = await database.configuration.findFirstOrThrow({
    where: {
      version: {
        id: version
      }
    },
    select: ConfigurationBasicSelect
  });

  if (!configuration) {
    return {
      notFound: true
    }
  }

  const rules = await database.rule.findMany({
    where: {
      configuration: {
        version: {
          id: version
        }
      }
    },
    select: RuleBasicSelect
  });

  const groups = await database.group.findMany({
    select: {
      key: true,
      description: true,
      name: true
    },
    orderBy: {
      index: 'asc'
    }
  })

  return {
    props: {
      groups: JSON.parse(JSON.stringify(groups)),
      configuration: JSON.parse(JSON.stringify(configuration)),
      rules: JSON.parse(JSON.stringify(rules))
    }
  }
})

function Info({description}: {description: string}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog
        open={ open }
        onClose={ () => setOpen(false) }
        maxWidth="md"
        fullWidth
      >
        <MdPreview modelValue={ description } />
      </Dialog>
      <IconButton onClick={ () => {setOpen(true)}} sx={{ marginLeft: 0.5 }} size="small">
        <HelpOutlineIcon sx={{ fontSize: '16px' }} />
      </IconButton>
    </>
  )
}

export interface CalculatorPageProps {
  groups: Group[]
  configuration: ConfigurationBasic
  rules: RuleBasic[],
  hasHome: boolean,
  hasSpecs: boolean
}

function CalculatorPage({
  groups,
  metrics,
  selection,
  score,
  action,
  isDisabled,
  handleValueChange,
  hasHome,
  hasSpecs
}: ReturnType<typeof useCalculatorPage> & { hasHome: boolean, hasSpecs: boolean }) {
  return (
    <>
      <Header showHomeLink={ hasHome } showSpecsLink={ hasSpecs } />
      <Container maxWidth="md" sx={{ mt: 4, py: 2 }} component={Paper}>
        <Container>
          <Grid 
            container 
            spacing={ 1 }
          >
            {
              [
                { label: 'Infrastructure', score: 'infrastructure' },
                { label: 'Tenancy', score: 'tenancy' },
                { label: 'Data', score: 'data' },
                { label: 'VISS', score: 'viss' },
              ].map(entry => (
                <>
                  <Grid item md={ 2 } xs={ 10 }>
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
      </Container>

      <Container maxWidth="md" sx={{ my: 2, py: 2 }} component={Paper}>
        {
          groups.map(group => (
            <>
              <Grid container>
                <Grid item md={ 3 } xs={ 12 }>
                  <Typography key={ `group-name-${group.key}` } variant="body2" marginTop={ 2.5 } marginBottom={ 2 } noWrap>
                    { group.name }
                    <If condition={ !!group.description }>
                      <Then>
                        <Info description={ group.description } />
                      </Then>
                    </If>
                  </Typography>
                </Grid>
                {
                  metrics
                    .filter(metric => metric.group.key === group.key)
                    .map(metric => (
                      <Grid item xs={ 12 } md={ 3 } paddingTop={ 1.5 } paddingX={ 0.5 }>
                        <FormControl fullWidth>
                          <InputLabel
                            key={ `input-${metric.key}` }
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
                            key={ `metric-${metric.key}` }
                            fullWidth
                            name={ metric.key }
                            size="small"
                            sx={{ fontSize: '14px' }}
                            value={ selection[metric.key] || '' }
                            onChange={ handleValueChange }
                            disabled={ isDisabled(metric.key) }
                          >
                            {
                              metric
                                .values
                                .map(value => (
                                <MenuItem
                                  key={ `value-${metric.key}-${value.key}` }
                                  value={ value.key }
                                  sx={{ fontSize: '14px' }}
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
              <If condition={ ['platform-impacted', 'tenants-impacted', 'data-classification'].includes(group.key) }>
                <Then>
                  <Divider sx={{ my: 0.5 }} />
                </Then>
              </If>
            </>
          ))
        }
      </Container>
    </>
  )
}

export default (props: CalculatorPageProps) => <CalculatorPage { ...useCalculatorPage(props) } hasHome={ props.hasHome } hasSpecs={ props.hasSpecs } />

