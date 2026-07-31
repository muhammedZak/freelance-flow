import EmptyState from '@components/common/EmptyState';
import Loading from '@components/common/Loading';

import TaskCard from './TaskCard';

function TaskList({
  tasks,
  totalTaskCount,
  isInitialLoading,
  canManageTasks,
  isUpdating,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (isInitialLoading) {
    return <Loading />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        message={
          totalTaskCount === 0
            ? 'No tasks have been added to this project.'
            : 'No tasks match the selected filters.'
        }
      />
    );
  }

  return (
    <div className='space-y-4'>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          canManageTasks={canManageTasks}
          isUpdating={isUpdating}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}

      {isUpdating && (
        <p className='text-sm text-slate-500'>Updating tasks...</p>
      )}
    </div>
  );
}

export default TaskList;
