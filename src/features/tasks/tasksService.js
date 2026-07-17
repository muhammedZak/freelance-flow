import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return await response.json();
}

async function getTasksByProject(projectId) {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch project tasks');
  }

  const tasks = await response.json();

  return tasks.filter((task) => String(task.projectId) === String(projectId));
}

async function getTaskById(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`);

  if (!response.ok) {
    throw new Error('Task not found');
  }

  return await response.json();
}

async function createTask(taskData) {
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

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  const savedTask = await response.json();

  await activitiesService.addActivity({
    message: `Task created: ${savedTask.title}`,
    type: 'task',
    createdAt: getCurrentDate(),
  });

  return savedTask;
}

async function updateTask(id, taskData) {
  const updatedData = {
    ...taskData,
  };

  if (updatedData.projectId !== undefined) {
    updatedData.projectId = String(updatedData.projectId);
  }

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const updatedTask = await response.json();

  await activitiesService.addActivity({
    message: `Task updated: ${updatedTask.title}`,
    type: 'task',
    createdAt: getCurrentDate(),
  });

  return updatedTask;
}

async function deleteTask(id) {
  const task = await getTaskById(id);

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  await activitiesService.addActivity({
    message: `Task deleted: ${task.title}`,
    type: 'task',
    createdAt: getCurrentDate(),
  });

  return String(id);
}

const tasksService = {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};

export default tasksService;
