import { database } from "@viss/db";
import { GetServerSidePropsContext } from "next";
import Navbar from "../../common/components/Navbar";
import { TableContainer, Paper, Container } from "@mui/material";
import { Group } from "@prisma/client";
import { GroupTable } from "apps/configurator/group-repository/components/GroupTable";
import 'md-editor-rt/lib/style.css';
import { Header } from "apps/configurator/common/components/Header";
import GroupTableRow from "apps/configurator/group-repository/components/GroupTableRow";
import { useGroupRepositoryPage } from "apps/configurator/configuration/hooks/useGroupRepositoryPage";

export const getServerSideProps = async(props: GetServerSidePropsContext) => {
  const groups = await database.group.findMany({
    orderBy: {
      index: 'asc'
    }
  });

  return {
    props: {
      groups: JSON.parse(JSON.stringify(groups))
    }
  }
}

export interface GroupRepositoryPageProps {
  groups: Group[]
}

function GroupRepositoryPage({ groups, handleChange }: ReturnType<typeof useGroupRepositoryPage>) {
  return (
    <>
      <Navbar />

      <Container sx={{ mt: 2, mb: 20 }}>

        <Header 
          title="Groups"
          subtitle="Define group description"
        />

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <GroupTable size="small">
            {
              groups.map(group => (
                <GroupTableRow 
                  group={ group }
                  onChange={ handleChange }
                />
              ))
            }
          </GroupTable>
        </TableContainer>

      </Container>
    </>
  )
}

export default (props: GroupRepositoryPageProps) => <GroupRepositoryPage { ...useGroupRepositoryPage(props) } />