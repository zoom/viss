import React, {  } from 'react';
import Header from '../components/Header';
import { Container, Paper } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { MdPreview } from "md-editor-rt";
import withStaticFiles from '../utils/withStaticFiles';

export const getServerSideProps = withStaticFiles(async(props: GetServerSidePropsContext) => {
  return { 
    props: {}
  }
})

export function Index(props: {
  homeContent: string,
  hasHome: boolean,
  hasSpecs: boolean
}) {

  return (
    <>
      <Header showHomeLink={ props.hasHome } showSpecsLink={ props.hasSpecs }/>
      <Container sx={{ mt: 4 }}>
        <Paper>
          <MdPreview
            modelValue={props.homeContent}
          />
        </Paper>
      </Container>
    </>
    
  );
}

export default Index;
