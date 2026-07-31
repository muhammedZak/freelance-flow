import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function readJsonResponse(response, fallbackMessage) {
  if (!response.ok) {
    let errorMessage = fallbackMessage;

    try {
      const errorData = await response.json();

      errorMessage = errorData?.message || errorData?.error || fallbackMessage;
    } catch {
      /*
       * The response did not contain JSON error data.
       * Keep the provided fallback message.
       */
    }

    throw new Error(errorMessage);
  }

  return response.json();
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

/*
 * Retained for compatibility with the existing fetchTasks
 * thunk and Tasks feature public API.
 */
export async function getTasks({ signal } = {}) {
  const response = await fetch(`${API_URL}/tasks`, {
    signal,
  });

  return readJsonResponse(response, 'Failed to fetch tasks');
}

export async function getTasksByProject(projectId, { signal } = {}) {
  const normalizedProjectId = String(projectId);

  const query = new URLSearchParams({
    projectId: normalizedProjectId,
  });

  const response = await fetch(`${API_URL}/tasks?${query.toString()}`, {
    signal,
  });

  return readJsonResponse(response, 'Failed to fetch project tasks');
}

async function getTaskById(id, { signal } = {}) {
  const normalizedTaskId = String(id);

  const response = await fetch(`${API_URL}/tasks/${normalizedTaskId}`, {
    signal,
  });

  return readJsonResponse(response, 'Task not found');
}

export async function createTask(taskData) {
  const newTask = {
    ...taskData,
    id: Date.now().toString(),
    projectId: String(taskData.projectId),
    createdAt: getCurrentDate(),
  };

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  const savedTask = await readJsonResponse(response, 'Failed to create task');

  await logTaskActivity(`Task created: ${savedTask.title}`);

  return savedTask;
}

export async function updateTask(id, taskData) {
  const normalizedTaskId = String(id);

  const updatedData = {
    ...taskData,
  };

  if (updatedData.projectId !== undefined) {
    updatedData.projectId = String(updatedData.projectId);
  }

  const response = await fetch(`${API_URL}/tasks/${normalizedTaskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  const updatedTask = await readJsonResponse(response, 'Failed to update task');

  await logTaskActivity(`Task updated: ${updatedTask.title}`);

  return updatedTask;
}

export async function deleteTask(id) {
  const normalizedTaskId = String(id);

  const task = await getTaskById(normalizedTaskId);

  const response = await fetch(`${API_URL}/tasks/${normalizedTaskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

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
