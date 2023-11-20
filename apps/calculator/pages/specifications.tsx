import React, {  } from 'react';
import Header from '../components/Header';
import { Container, Paper } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { MdPreview } from "md-editor-rt";
import path from 'path';
import fs from 'fs'
import withStaticFiles from '../utils/withStaticFiles';

export const getServerSideProps = withStaticFiles(async(props: GetServerSidePropsContext) => {
  return {
    props: {}
  }
})

export function Specifications(props: {
  specsContent: string,
  hasHome: boolean,
  hasSpecs: boolean
}) {

  return (
    <>
      <Header showHomeLink={ props.hasHome } showSpecsLink={ props.hasSpecs } />
      <Container sx={{ my: 4 }}>
        <Paper>
          <MdPreview
            modelValue={props.specsContent}
          />
        </Paper>
      </Container>
    </>
    
  );
}

export default Specifications;
