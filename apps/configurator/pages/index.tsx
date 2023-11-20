import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async(props: GetServerSidePropsContext) => {
  return {
    redirect: {
      destination: `/configuration`
    },
    props: {
    }
  }
}

export function Index() {};

export default Index;