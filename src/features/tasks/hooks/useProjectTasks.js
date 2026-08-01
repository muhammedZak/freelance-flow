import { TASK_FILTER_DEFAULTS } from '../tasks.constants';
import useProjectTasksQuery from './useProjectTasksQuery';
import useTaskCommands from './useTaskCommands';

function useProjectTasks(projectId, filters = TASK_FILTER_DEFAULTS) {
  const query = useProjectTasksQuery(projectId, filters);

  const commands = useTaskCommands({
    projectId,

    canManageTasks: query.canManageTasks,

    clientHasAccess: query.clientHasAccess,
  });

  return {
    ...query,
    ...commands,
  };
}

export default useProjectTasks;
