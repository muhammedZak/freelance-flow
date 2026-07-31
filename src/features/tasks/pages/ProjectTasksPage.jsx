import { useParams } from 'react-router-dom';

import BackLink from '@components/common/BackLink';
import Button from '@components/common/Button';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import MessageAlert from '@components/common/MessageAlert';
import PageHeader from '@components/common/PageHeader';

import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskProgressCard from '../components/TaskProgressCard';
import useProjectTasks from '../hooks/useProjectTasks';
import useTaskFilters from '../hooks/useTaskFilters';

function ProjectTasksPage() {
  const { id } = useParams();

  const {
    searchText,
    statusFilter,
    priorityFilter,
    sortBy,
    hasActiveFilters,

    setSearchText,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    clearFilters,
  } = useTaskFilters();

  const {
    project,

    clientHasAccess,
    canManageTasks,

    isProjectLoading,
    isProjectNotFound,
    projectError,

    taskMutationLoading,
    isInitialTaskLoading,
    taskError,
    successMessage,

    filteredTasks,

    totalTasks,
    todoTasks,
    inProgressTasks,
    completedTasks,
    progressPercentage,

    showTaskForm,
    editingTask,

    openAddTaskForm,
    openEditTaskForm,
    closeTaskForm,

    saveTask,
    changeTaskStatus,
    deleteTask,
  } = useProjectTasks(id, {
    searchText,
    statusFilter,
    priorityFilter,
    sortBy,
  });

  if (!clientHasAccess) {
    return <ErrorMessage message='You do not have access to this project.' />;
  }

  if (isProjectLoading) {
    return <Loading />;
  }

  if (projectError) {
    return <ErrorMessage message={projectError} />;
  }

  if (isProjectNotFound || !project) {
    return <ErrorMessage message='Project not found' />;
  }

  return (
    <div className='workspace-page'>
      <div className='mb-4'>
        <BackLink to={`/projects/${id}`}>Back to Project</BackLink>
      </div>

      <PageHeader
        title={`${project.title} Tasks`}
        description='Manage tasks and monitor the project progress.'>
        {canManageTasks && (
          <Button type='button' onClick={openAddTaskForm}>
            Add Task
          </Button>
        )}
      </PageHeader>

      {successMessage && (
        <div className='mb-4' aria-live='polite' aria-atomic='true'>
          <MessageAlert message={successMessage} type='success' />
        </div>
      )}

      <div aria-live='assertive' aria-atomic='true'>
        {taskError && (
          <div className='mb-4'>
            <ErrorMessage message={taskError} />
          </div>
        )}
      </div>

      {showTaskForm && canManageTasks && (
        <TaskForm
          task={editingTask}
          loading={taskMutationLoading}
          onSubmit={saveTask}
          onCancel={closeTaskForm}
        />
      )}

      <TaskProgressCard
        totalTasks={totalTasks}
        todoTasks={todoTasks}
        inProgressTasks={inProgressTasks}
        completedTasks={completedTasks}
        progressPercentage={progressPercentage}
      />

      <TaskFilters
        searchText={searchText}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        filteredCount={filteredTasks.length}
        totalCount={totalTasks}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onSortChange={setSortBy}
        onClear={clearFilters}
      />

      <TaskList
        tasks={filteredTasks}
        totalTaskCount={totalTasks}
        isInitialLoading={isInitialTaskLoading}
        canManageTasks={canManageTasks}
        isUpdating={taskMutationLoading}
        onEdit={openEditTaskForm}
        onDelete={deleteTask}
        onStatusChange={changeTaskStatus}
      />
    </div>
  );
}

export default ProjectTasksPage;
