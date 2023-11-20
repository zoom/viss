import React from 'react';
import Header from '../components/Header';
import { Container, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { VersionWithConfiguration, VersionWithConfigurationSelect, database } from "@viss/db";
import 'md-editor-rt/lib/style.css';
import { Else, If, Then } from 'react-if';
import { toPrintableVersion } from '@viss/viss';
import { useVersionRepositoryPage } from '../hooks/useVersionRepositoryPage';
import withStaticFiles from '../utils/withStaticFiles';

export const getServerSideProps = withStaticFiles(async(props: GetServerSidePropsContext) => {
  const versions = await database.configurationVersion.findMany({
    select: VersionWithConfigurationSelect,
    orderBy: {
      id: 'desc'
    }
  })

  return {
    props: {
      versions: JSON.parse(JSON.stringify(versions))
    }
  }
})

export interface VersionRepositoryPageProps {
  versions: VersionWithConfiguration[],
  hasHome: boolean,
  hasSpecs: boolean
}

function VersionRepositoryPage({
  versions,
  selectedVersion,
  action,
  hasHome,
  hasSpecs
}: ReturnType<typeof useVersionRepositoryPage> & { hasHome: boolean, hasSpecs: boolean }) {
  return (
    <>
      <Header showHomeLink={ hasHome } showSpecsLink={ hasSpecs } />

      <Container maxWidth="md" sx={{ my: 4 }} component="div">
        <If condition={ !selectedVersion }>
          
          <Then>
            <Typography variant="body2">No versioned configurations...</Typography>
          </Then>

          <Else>

            <Grid container style={{ display: "flex", justifyContent: "flex-end" }}>
              <Grid item xs={ 3 } >
                <Select 
                  size="small" 
                  sx={{ fontSize: '14px' }}
                  fullWidth
                  value={ selectedVersion.id }
                  onChange={ (event) => action.setSelectedVersion(versions.find(version => version.id === Number(event.target.value))) }
                >
                  {
                    versions.map(version => (
                      <MenuItem
                        sx={{ fontSize: '14px' }}
                        value={ version.id }
                      >
                        { `v${toPrintableVersion(version.id)} - ${ new Date(version.configuration.createdAt).toDateString() }` }
                      </MenuItem>
                    ))
                  }
                </Select>
              </Grid>
            </Grid>
            <TableContainer sx={{ marginTop: 1 }} component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell>Key</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell align="right">Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    selectedVersion
                      .configuration
                      .metrics
                      .map(metric => (
                        metric.values.map((value, idx) => (
                          <TableRow hover>
                            { idx === 0 ?
                              <TableCell sx={{ fontWeight: 500 }}>{ `${metric.key} - ${metric.name}`}</TableCell> :
                              <TableCell sx={{ borderBottom: 'none' }} rowSpan={1} />
                            }
                            <TableCell>{ value.key }</TableCell>
                            <TableCell>{ value.name }</TableCell>
                            <TableCell align="right">{value.weight}</TableCell>
                          </TableRow>
                        ))
                      ))
                  }
                </TableBody>
              </Table>
            </TableContainer>

          </Else>
        </If>
      </Container>
    </>
  )
}

export default (props: VersionRepositoryPageProps) => <VersionRepositoryPage { ...useVersionRepositoryPage(props) } hasHome={ props.hasHome } hasSpecs={ props.hasSpecs } />;

