import { useState } from "react";
import { VersionRepositoryPageProps } from "../pages/versions";

export const useVersionRepositoryPage = ({ versions }: VersionRepositoryPageProps) => {

  const [selectedVersion, setSelectedVersion] = useState(
    versions.length > 0 ? versions[0] : null
  );

  return {
    versions,
    selectedVersion,
    action: {
      setSelectedVersion
    }
  }
}