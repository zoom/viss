import { database } from "@viss/db";
import { fromVectorString, toPrintableVersion } from "@viss/viss";
import { useHash } from "apps/calculator/hooks/useHash";
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async(props: GetServerSidePropsContext) => {
  
  const version = await database.configurationVersion.findFirst({
    select: {
      id: true,
    },
    where: {
      configuration: {
        active: {
          not: null
        }
      }
    }
  });

  return {
    props: {
      active: `/calculator/${toPrintableVersion(version.id)}`
    }
  }
}

export function Index({
  active
}: {
  active: string
}) { 

  if (typeof window !== 'undefined') {
    const [ hash ] = useHash();

    if (hash) {
      const fromVector = fromVectorString(hash);

      // Remap old 0.1 to 0.01
      if (!!fromVector.magnitudes) {
        location.href = `/calculator/0.01${hash}`;
      } else {
        location.href = `/calculator/${fromVector.version}${hash}`;
      }
    } else {
      location.href = active;
    }
  }

}

export default Index;