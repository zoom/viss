import { Group } from "@prisma/client";
import { GroupRepositoryApi } from "apps/configurator/api/repository/group";
import { useNotification } from "apps/configurator/notification/context";
import { GroupRepositoryPageProps } from "apps/configurator/pages/group";
import { useImmer } from "use-immer";

const initialState: {
  groups: Group[]
} = {
  groups: []
}

export const useGroupRepositoryPage = ({
  groups
}: GroupRepositoryPageProps) => {

  const { showNotification } = useNotification();

  const [state, setState] = useImmer({
    ...initialState,
    groups
  });

  const replace = (find: Group, replaceWith: Group) => {
    setState(draft => {
      const idx = draft.groups.findIndex(group => group.id === find.id);

      if (idx !== -1) {
        draft.groups[idx] = replaceWith;
      }
    })
  }

  const handleChange = (id: string, name?: string, description?: string) => {
    return GroupRepositoryApi.update({
      id,
      name,
      description
    })
      .then((group: Group) => replace(group, group))
      .catch(() => {
        showNotification({
          message: 'Error while updating group details',
          severity: 'error'
        })
      });
  }

  return {
    groups: state.groups,
    handleChange
  }
}