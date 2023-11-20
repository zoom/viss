import { Button, Chip, Container, Paper, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { ConfigurationFull, ConfigurationWithoutDeletedValuesInclude, RuleWithMetricsAndValues, RuleWithMetricsAndValuesInclude, database } from "@viss/db";
import { toPrintableVersion } from "@viss/viss";
import Breadcrumbs from "apps/configurator/common/components/Breadcrumbs";
import { Header } from "apps/configurator/common/components/Header";
import Navbar from "apps/configurator/common/components/Navbar";import { useConfigurationRulePage } from "apps/configurator/configuration/hooks/useConfigurationRulesetPage";
;
import Notification from "apps/configurator/notification/components/Notification";
import CreateRuleModal from "apps/configurator/ruleset/components/CreateRuleModal";
import { RulesetTable } from "apps/configurator/ruleset/components/RulesetTable";
import RulesetTableRow from "apps/configurator/ruleset/components/RulesetTableRow";
import { GetServerSidePropsContext } from "next";
import { Else, If, Then } from "react-if";

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
    include: ConfigurationWithoutDeletedValuesInclude
  });

  if (!configuration) {
    return {
      notFound: true
    }
  }

  const rules = await database.rule.findMany({
    where: {
      configuration: {
        id: configuration.id
      }
    },
    include: RuleWithMetricsAndValuesInclude
  })

  return {
    props: {
      configuration: JSON.parse(JSON.stringify(configuration)),
      rules: JSON.parse(JSON.stringify(rules))
    }
  }
}

export interface ConfigurationRulePageProps {
  configuration: ConfigurationFull,
  rules: RuleWithMetricsAndValues[]
}

function ConfigurationRulesetPage({ 
  configuration, 
  rules,
  modal,
  action,
  handleCreate,
  handleDelete
}: ReturnType<typeof useConfigurationRulePage>) {
  return (
    <>
      <Navbar />

      <Notification />

      <Container sx={{ mt: 2, mb: 20 }}>
        <Breadcrumbs 
          items={[
            { item: 'Configurations', link: '/configuration' },
            { item: configuration.name, link: `/configuration/${configuration.id}` },
            { item: 'Ruleset' }
          ]}
        />

        <Header 
          title="Ruleset"
          subtitle={ 
            <>
              { configuration.name }
              { configuration.version && <Chip label={ toPrintableVersion(configuration.version.id) } size="small" /> }
              { configuration.active && <Chip label="active" size="small" color="primary" /> }
              { configuration.deleted && <Chip label="deleted" size="small" color="error" /> }
            </>
          }
        >
          <Button variant="outlined" onClick={ () => action.setModalOpen('create', true) }>Create</Button>
        </Header>

        <CreateRuleModal
          open={ modal.create.open }
          close={ () => action.setModalOpen('create', false) }
          title="Create Rule"
          width="sm"
          configuration={ configuration }
          rules={ rules }
          onCreate={ handleCreate }
        />

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <RulesetTable suppressHydrationWarning>
            <If condition={ rules.length > 0 }>
              <Then>
                {
                  rules.map(rule => (
                    <RulesetTableRow 
                      rule={ rule } 
                      onDelete={ handleDelete }
                    />
                  ))
                }
              </Then>
              <Else>
                <TableRow>
                  <TableCell colSpan={ 7 } align="center">
                    <Typography variant="subtitle2" color="grey" fontStyle="italic">No rules...</Typography>
                  </TableCell>
                </TableRow>
              </Else>
            </If>
          </RulesetTable>    
        </TableContainer>
      </Container>
    </>
  )
}

export default (props: ConfigurationRulePageProps) => <ConfigurationRulesetPage { ...useConfigurationRulePage(props) } />;