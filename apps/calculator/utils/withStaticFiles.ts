import { GetServerSideProps } from "next";
import path from "path";
import fs from 'fs';

export default function withStaticFiles(gssp: GetServerSideProps): GetServerSideProps {
  return async (context) => {
    const props = await gssp(context);

    const homePaths = [
      path.resolve(
        process.cwd(), 
        'apps/calculator/static/home.md'
      ),
      path.resolve(
        process.cwd(),
        'static/home.md'
      )
    ];

    const specsPaths = [
      path.resolve(
        process.cwd(), 
        'apps/calculator/static/specifications.md'
      ),
      path.resolve(
        process.cwd(),
        'static/specifications.md'
      )
    ];

    const home = homePaths.find(file => fs.existsSync(file));
    const specs = specsPaths.find(file => fs.existsSync(file));

    return {
      ...props,
      props: {
        ...props['props'],
        hasHome: !!home,
        hasSpecs: !!specs,
        homeContent: !!home ? fs.readFileSync(home).toString() : '',
        specsContent: !!specs ? fs.readFileSync(specs).toString() : '',
      }
    }
  }
}