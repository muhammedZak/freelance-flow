import apiClient from '../../api/apiClient';
import activitiesService from '../activities/activitiesService';

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function logTaskActivity(message) {
  try {
    await activitiesService.addActivity({
      message,
      type: 'task',
      createdAt: getCurrentDate(),
    });
  } catch (error) {
    console.error(
      'Task operation succeeded, but activity logging failed:',
      error,
    );
  }
}

export async function getTasks({ signal } = {}) {
  const response = await apiClient.get('/tasks', {
    signal,
  });

  return response.data;
}

export async function getTasksByProject(projectId, { signal } = {}) {
  const normalizedProjectId = String(projectId);

  const response = await apiClient.get('/tasks', {
    params: {
      projectId: normalizedProjectId,
    },
    signal,
  });

  return response.data;
}

async function getTaskById(id, { signal } = {}) {
  const normalizedTaskId = String(id);

  const response = await apiClient.get(`/tasks/${normalizedTaskId}`, {
    signal,
  });

  return response.data;
}

export async function createTask(taskData, { signal } = {}) {
  const newTask = {
    ...taskData,
    id: Date.now().toString(),
    projectId: String(taskData.projectId),
    createdAt: getCurrentDate(),
  };

  const response = await apiClient.post('/tasks', newTask, {
    signal,
  });

  const savedTask = response.data;

  await logTaskActivity(`Task created: ${savedTask.title}`);

  return savedTask;
}

export async function updateTask(id, taskData, { signal } = {}) {
  const normalizedTaskId = String(id);

  /*
   * Some Task workflows send partial updates, such as
   * changing only the status. Because PUT replaces the
   * complete resource, retrieve and merge the existing
   * Task before sending the update.
   */
  const existingTask = await getTaskById(normalizedTaskId, {
    signal,
  });

  const updatedData = {
    ...existingTask,
    ...taskData,
    id: existingTask.id ?? normalizedTaskId,
  };

  if (updatedData.projectId !== undefined && updatedData.projectId !== null) {
    updatedData.projectId = String(updatedData.projectId);
  }

  const response = await apiClient.put(
    `/tasks/${normalizedTaskId}`,
    updatedData,
    {
      signal,
    },
  );

  const updatedTask = response.data;

  await logTaskActivity(`Task updated: ${updatedTask.title}`);

  return updatedTask;
}

export async function deleteTask(id, { signal } = {}) {
  const normalizedTaskId = String(id);

  const task = await getTaskById(normalizedTaskId, {
    signal,
  });

  await apiClient.delete(`/tasks/${normalizedTaskId}`, {
    signal,
  });

  await logTaskActivity(`Task deleted: ${task.title}`);

  return normalizedTaskId;
}

const tasksService = {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};

export default tasksService;
