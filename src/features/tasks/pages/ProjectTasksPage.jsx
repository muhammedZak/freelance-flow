import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import BackLink from '@components/common/BackLink';
import Button from '@components/common/Button';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import PageHeader from '@components/common/PageHeader';

import {
  clearProjectMessages,
  clearSelectedProject,
  fetchProjectById,
  selectIsProjectDetailsLoading,
  selectProjectDetailsError,
  selectSelectedProject,
} from '@features/projects';

import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskProgressCard from '../components/TaskProgressCard';
import { TASK_PRIORITY, TASK_STATUS } from '../tasks.constants';
import {
  addTask,
  clearTaskMessages,
  editTask,
  fetchTasksByProject,
  removeTask,
} from '../tasksSlice';

function ProjectTasksPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || '';

  const statusFilter = searchParams.get('status') || 'all';

  const priorityFilter = searchParams.get('priority') || 'all';

  const sortBy = searchParams.get('sort') || 'due-date';

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const selectedProject = useSelector(selectSelectedProject);

  const projectLoading = useSelector(selectIsProjectDetailsLoading);

  const projectError = useSelector(selectProjectDetailsError);

  const {
    tasks,
    loading: taskLoading,
    error: taskError,
    successMessage,
  } = useSelector((state) => state.tasks);

  const canManageTasks = user?.role === 'freelancer' || user?.role === 'admin';

  const clientHasAccess =
    user?.role !== 'client' ||
    user?.assignedProjectIds
      ?.map((projectId) => String(projectId))
      .includes(String(id));

  useEffect(() => {
    dispatch(clearTaskMessages());
    dispatch(clearProjectMessages());
    dispatch(fetchProjectById(id));
    dispatch(fetchTasksByProject(id));

    return () => {
      dispatch(clearTaskMessages());
      dispatch(clearSelectedProject());
    };
  }, [dispatch, id]);

  function updateSearchParams(key, value) {
    const newParams = new URLSearchParams(searchParams);

    const isDefaultValue = !value || value === 'all' || value === 'due-date';

    if (isDefaultValue) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  }

  function clearFilters() {
    setSearchParams({});
  }

  const projectTasks = tasks.filter(
    (task) => String(task.projectId) === String(id),
  );

  const completedTasks = projectTasks.filter(
    (task) => task.status === TASK_STATUS.COMPLETED,
  );

  const inProgressTasks = projectTasks.filter(
    (task) => task.status === TASK_STATUS.IN_PROGRESS,
  );

  const todoTasks = projectTasks.filter(
    (task) => task.status === TASK_STATUS.TODO,
  );

  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : 0;

  const filteredTasks = projectTasks
    .filter((task) => {
      const searchValue = searchText.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((firstTask, secondTask) => {
      if (sortBy === 'newest') {
        return new Date(secondTask.createdAt) - new Date(firstTask.createdAt);
      }

      if (sortBy === 'title') {
        return firstTask.title.localeCompare(secondTask.title);
      }

      if (sortBy === 'priority') {
        const priorityOrder = {
          [TASK_PRIORITY.HIGH]: 1,
          [TASK_PRIORITY.MEDIUM]: 2,
          [TASK_PRIORITY.LOW]: 3,
        };

        return (
          priorityOrder[firstTask.priority] - priorityOrder[secondTask.priority]
        );
      }

      return new Date(firstTask.dueDate) - new Date(secondTask.dueDate);
    });

  const hasActiveFilters =
    searchText ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'due-date';

  function openAddTaskForm() {
    dispatch(clearTaskMessages());
    setEditingTask(null);
    setShowTaskForm(true);
  }

  function openEditTaskForm(task) {
    dispatch(clearTaskMessages());
    setEditingTask(task);
    setShowTaskForm(true);
  }

  function closeTaskForm() {
    setEditingTask(null);
    setShowTaskForm(false);
  }

  async function handleSaveTask(formData) {
    try {
      if (editingTask) {
        await dispatch(
          editTask({
            id: String(editingTask.id),
            taskData: {
              ...formData,
              projectId: String(id),
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          addTask({
            ...formData,
            projectId: String(id),
          }),
        ).unwrap();
      }

      closeTaskForm();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStatusChange(task, newStatus) {
    try {
      await dispatch(
        editTask({
          id: String(task.id),
          taskData: {
            status: newStatus,
          },
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTask(task) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeTask(String(task.id))).unwrap();

      if (editingTask && String(editingTask.id) === String(task.id)) {
        closeTaskForm();
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!clientHasAccess) {
    return <ErrorMessage message='You do not have access to this project.' />;
  }

  if (projectLoading && !selectedProject) {
    return <Loading />;
  }

  if (projectError) {
    return <ErrorMessage message={projectError} />;
  }

  if (!selectedProject) {
    return <ErrorMessage message='Project not found' />;
  }

  return (
    <div className='workspace-page'>
      <div className='mb-4'>
        <BackLink to={`/projects/${id}`}>Back to Project</BackLink>
      </div>

      <PageHeader
        title={`${selectedProject.title} Tasks`}
        description='Manage tasks and monitor the project progress.'>
        {canManageTasks && <Button onClick={openAddTaskForm}>Add Task</Button>}
      </PageHeader>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      {taskError && (
        <div className='mb-4'>
          <ErrorMessage message={taskError} />
        </div>
      )}

      {showTaskForm && canManageTasks && (
        <TaskForm
          task={editingTask}
          loading={taskLoading}
          onSubmit={handleSaveTask}
          onCancel={closeTaskForm}
        />
      )}

      <TaskProgressCard
        totalTasks={projectTasks.length}
        todoTasks={todoTasks.length}
        inProgressTasks={inProgressTasks.length}
        completedTasks={completedTasks.length}
        progressPercentage={progress}
      />

      <TaskFilters
        searchText={searchText}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        filteredCount={filteredTasks.length}
        totalCount={projectTasks.length}
        hasActiveFilters={Boolean(hasActiveFilters)}
        onSearchChange={(value) => updateSearchParams('search', value)}
        onStatusChange={(value) => updateSearchParams('status', value)}
        onPriorityChange={(value) => updateSearchParams('priority', value)}
        onSortChange={(value) => updateSearchParams('sort', value)}
        onClear={clearFilters}
      />

      <TaskList
        tasks={filteredTasks}
        totalTaskCount={projectTasks.length}
        isInitialLoading={taskLoading && projectTasks.length === 0}
        canManageTasks={canManageTasks}
        isUpdating={taskLoading}
        onEdit={openEditTaskForm}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default ProjectTasksPage;
