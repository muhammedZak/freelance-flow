import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { clearTaskMessages } from '../tasksSlice';
import { addTask, editTask, removeTask } from '../tasksThunks';

function hasValidProjectId(projectId) {
  return projectId !== undefined && projectId !== null && projectId !== '';
}

function taskBelongsToProject(task, projectId) {
  return (
    task &&
    hasValidProjectId(projectId) &&
    String(task.projectId) === String(projectId)
  );
}

function useTaskCommands({ projectId, canManageTasks, clientHasAccess }) {
  const dispatch = useDispatch();

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    setShowTaskForm(false);
    setEditingTask(null);
  }, [projectId, clientHasAccess]);

  const closeTaskForm = useCallback(() => {
    setEditingTask(null);
    setShowTaskForm(false);
  }, []);

  const openAddTaskForm = useCallback(() => {
    if (!canManageTasks || !clientHasAccess) {
      return;
    }

    dispatch(clearTaskMessages());

    setEditingTask(null);
    setShowTaskForm(true);
  }, [canManageTasks, clientHasAccess, dispatch]);

  const openEditTaskForm = useCallback(
    (task) => {
      if (
        !canManageTasks ||
        !clientHasAccess ||
        !taskBelongsToProject(task, projectId)
      ) {
        return;
      }

      dispatch(clearTaskMessages());

      setEditingTask(task);
      setShowTaskForm(true);
    },
    [canManageTasks, clientHasAccess, dispatch, projectId],
  );

  const saveTask = useCallback(
    async (formData) => {
      if (
        !canManageTasks ||
        !clientHasAccess ||
        !hasValidProjectId(projectId)
      ) {
        return false;
      }

      try {
        if (editingTask) {
          await dispatch(
            editTask({
              id: String(editingTask.id),

              taskData: {
                ...formData,

                projectId: String(projectId),
              },
            }),
          ).unwrap();
        } else {
          await dispatch(
            addTask({
              ...formData,

              projectId: String(projectId),
            }),
          ).unwrap();
        }

        closeTaskForm();

        return true;
      } catch {
        /*
         * The rejected operation stores
         * its normalized error in the
         * Tasks Redux state.
         */
        return false;
      }
    },
    [
      canManageTasks,
      clientHasAccess,
      closeTaskForm,
      dispatch,
      editingTask,
      projectId,
    ],
  );

  const changeTaskStatus = useCallback(
    async (task, newStatus) => {
      if (
        !canManageTasks ||
        !clientHasAccess ||
        !taskBelongsToProject(task, projectId)
      ) {
        return false;
      }

      try {
        await dispatch(
          editTask({
            id: String(task.id),

            taskData: {
              status: newStatus,
            },
          }),
        ).unwrap();

        return true;
      } catch {
        /*
         * The rejected update error
         * remains available through
         * the Tasks Redux state.
         */
        return false;
      }
    },
    [canManageTasks, clientHasAccess, dispatch, projectId],
  );

  const deleteTask = useCallback(
    async (task) => {
      if (
        !canManageTasks ||
        !clientHasAccess ||
        !taskBelongsToProject(task, projectId)
      ) {
        return false;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete "${task.title}"?`,
      );

      if (!confirmed) {
        return false;
      }

      try {
        await dispatch(removeTask(String(task.id))).unwrap();

        if (editingTask && String(editingTask.id) === String(task.id)) {
          closeTaskForm();
        }

        return true;
      } catch {
        /*
         * The rejected delete error
         * remains available through
         * the Tasks Redux state.
         */
        return false;
      }
    },
    [
      canManageTasks,
      clientHasAccess,
      closeTaskForm,
      dispatch,
      editingTask,
      projectId,
    ],
  );

  return {
    showTaskForm,
    editingTask,

    openAddTaskForm,
    openEditTaskForm,
    closeTaskForm,

    saveTask,
    changeTaskStatus,
    deleteTask,
  };
}

export default useTaskCommands;
