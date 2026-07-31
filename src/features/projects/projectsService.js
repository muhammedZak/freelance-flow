import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';

function getActivityDate() {
  return new Date().toISOString().split('T')[0];
}

async function logProjectActivity(message) {
  try {
    await activitiesService.addActivity({
      message,
      type: 'project',
      createdAt: getActivityDate(),
    });
  } catch (error) {
    console.error(
      'Project operation succeeded, but activity logging failed:',
      error,
    );
  }
}

async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
}

async function getProjectById(id, { signal } = {}) {
  const projectId = String(id);

  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Project not found');
  }

  return response.json();
}

async function createProject(projectData) {
  const newProject = {
    ...projectData,
    createdAt: getActivityDate(),
  };

  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProject),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  const savedProject = await response.json();

  await logProjectActivity(`Project created: ${savedProject.title}`);

  return savedProject;
}

async function updateProject(id, projectData) {
  const projectId = String(id);

  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  const updatedProject = await response.json();

  await logProjectActivity(`Project updated: ${updatedProject.title}`);

  return updatedProject;
}

async function deleteProject(id) {
  const deletedProjectId = String(id);

  const project = await getProjectById(deletedProjectId);

  const response = await fetch(`${API_URL}/projects/${deletedProjectId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  await logProjectActivity(`Project deleted: ${project.title}`);

  return deletedProjectId;
}

const projectsService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectsService;
