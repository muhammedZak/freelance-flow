import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import TaskForm from '../features/tasks/TaskForm';

import {
  clearProjectMessages,
  clearSelectedProject,
  fetchProjectById,
} from '../features/projects/projectsSlice';

import {
  addTask,
  clearTaskMessages,
  editTask,
  fetchTasksByProject,
  removeTask,
} from '../features/tasks/tasksSlice';

import { formatDate } from '../utils/formatDate';

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

  const {
    selectedProject,
    loading: projectLoading,
    error: projectError,
  } = useSelector((state) => state.projects);

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
    (task) => task.status === 'completed',
  );

  const inProgressTasks = projectTasks.filter(
    (task) => task.status === 'in-progress',
  );

  const todoTasks = projectTasks.filter((task) => task.status === 'todo');

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
          high: 1,
          medium: 2,
          low: 3,
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

  function getStatusText(status) {
    if (status === 'in-progress') {
      return 'In Progress';
    }

    if (status === 'completed') {
      return 'Completed';
    }

    return 'To Do';
  }

  function getStatusClasses(status) {
    if (status === 'completed') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'in-progress') {
      return 'bg-blue-100 text-blue-700';
    }

    return 'bg-slate-100 text-slate-700';
  }

  function getPriorityClasses(priority) {
    if (priority === 'high') {
      return 'bg-red-100 text-red-700';
    }

    if (priority === 'medium') {
      return 'bg-yellow-100 text-yellow-700';
    }

    return 'bg-green-100 text-green-700';
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
    <div>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <button
            type='button'
            onClick={() => navigate(`/projects/${id}`)}
            className='mb-2 text-sm text-blue-600'>
            ← Back to Project
          </button>

          <h1 className='text-2xl font-bold text-slate-900'>
            {selectedProject.title} Tasks
          </h1>

          <p className='text-slate-600'>
            Manage tasks and monitor the project progress.
          </p>
        </div>

        {canManageTasks && (
          <button
            type='button'
            onClick={openAddTaskForm}
            className='rounded bg-slate-900 px-4 py-2 text-white'>
            Add Task
          </button>
        )}
      </div>

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

      <div className='mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='mb-3 flex items-center justify-between gap-3'>
          <h2 className='text-lg font-bold text-slate-900'>Project Progress</h2>

          <span className='text-lg font-bold text-slate-900'>{progress}%</span>
        </div>

        <div className='h-3 overflow-hidden rounded bg-slate-200'>
          <div
            className='h-full bg-slate-900'
            style={{ width: `${progress}%` }}></div>
        </div>

        <p className='mt-2 text-sm text-slate-500'>
          {completedTasks.length} of {projectTasks.length} tasks completed
        </p>

        <div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <div className='rounded bg-slate-100 p-3 text-center'>
            <p className='text-xl font-bold text-slate-900'>
              {projectTasks.length}
            </p>
            <p className='text-sm text-slate-500'>Total</p>
          </div>

          <div className='rounded bg-slate-100 p-3 text-center'>
            <p className='text-xl font-bold text-slate-900'>
              {todoTasks.length}
            </p>
            <p className='text-sm text-slate-500'>To Do</p>
          </div>

          <div className='rounded bg-slate-100 p-3 text-center'>
            <p className='text-xl font-bold text-slate-900'>
              {inProgressTasks.length}
            </p>
            <p className='text-sm text-slate-500'>In Progress</p>
          </div>

          <div className='rounded bg-slate-100 p-3 text-center'>
            <p className='text-xl font-bold text-slate-900'>
              {completedTasks.length}
            </p>
            <p className='text-sm text-slate-500'>Completed</p>
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <div className='mb-3'>
          <h2 className='text-xl font-bold text-slate-900'>Task List</h2>

          <p className='text-sm text-slate-500'>
            Search, filter, and sort project tasks.
          </p>
        </div>

        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
          <input
            type='text'
            value={searchText}
            onChange={(event) =>
              updateSearchParams('search', event.target.value)
            }
            placeholder='Search tasks'
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              updateSearchParams('status', event.target.value)
            }
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='all'>All Status</option>
            <option value='todo'>To Do</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) =>
              updateSearchParams('priority', event.target.value)
            }
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='all'>All Priorities</option>
            <option value='high'>High Priority</option>
            <option value='medium'>Medium Priority</option>
            <option value='low'>Low Priority</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => updateSearchParams('sort', event.target.value)}
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='due-date'>Due Date</option>
            <option value='newest'>Newest First</option>
            <option value='title'>Title A-Z</option>
            <option value='priority'>Priority High to Low</option>
          </select>
        </div>

        <div className='mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-slate-500'>
            Showing {filteredTasks.length} of {projectTasks.length} tasks
          </p>

          {hasActiveFilters && (
            <button
              type='button'
              onClick={clearFilters}
              className='self-start text-blue-600 sm:self-auto'>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {taskLoading && projectTasks.length === 0 ? (
        <Loading />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          message={
            projectTasks.length === 0
              ? 'No tasks have been added to this project.'
              : 'No tasks match the selected filters.'
          }
        />
      ) : (
        <div className='space-y-4'>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex flex-wrap items-center gap-2'>
                    <h3 className='text-lg font-bold text-slate-900'>
                      {task.title}
                    </h3>

                    <span
                      className={`rounded px-2 py-1 text-xs ${getStatusClasses(
                        task.status,
                      )}`}>
                      {getStatusText(task.status)}
                    </span>

                    <span
                      className={`rounded px-2 py-1 text-xs capitalize ${getPriorityClasses(
                        task.priority,
                      )}`}>
                      {task.priority} priority
                    </span>
                  </div>

                  <p className='mb-3 text-sm text-slate-600'>
                    {task.description}
                  </p>

                  <div className='flex flex-wrap gap-4 text-sm text-slate-500'>
                    <p>
                      <span className='font-medium text-slate-700'>Due:</span>{' '}
                      {formatDate(task.dueDate)}
                    </p>

                    <p>
                      <span className='font-medium text-slate-700'>
                        Created:
                      </span>{' '}
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>

                {canManageTasks && (
                  <div className='flex flex-col gap-3 sm:flex-row md:flex-col'>
                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(task, event.target.value)
                      }
                      disabled={taskLoading}
                      className='rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:opacity-60'>
                      <option value='todo'>To Do</option>
                      <option value='in-progress'>In Progress</option>
                      <option value='completed'>Completed</option>
                    </select>

                    <div className='flex gap-3'>
                      <button
                        type='button'
                        onClick={() => openEditTaskForm(task)}
                        className='text-sm text-green-600'>
                        Edit
                      </button>

                      <button
                        type='button'
                        onClick={() => handleDeleteTask(task)}
                        className='text-sm text-red-600'>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {taskLoading && (
            <p className='text-sm text-slate-500'>Updating tasks...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectTasksPage;
