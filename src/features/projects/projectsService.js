import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';

async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return await response.json();
}

async function getProjectById(id) {
  const response = await fetch(`${API_URL}/projects/${id}`);

  if (!response.ok) {
    throw new Error('Project not found');
  }

  return await response.json();
}

async function createProject(projectData) {
  const newProject = {
    ...projectData,
    createdAt: new Date().toISOString().split('T')[0],
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

  await activitiesService.addActivity({
    message: `Project created: ${savedProject.title}`,
    type: 'project',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return savedProject;
}

async function updateProject(id, projectData) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
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

  await activitiesService.addActivity({
    message: `Project updated: ${updatedProject.title}`,
    type: 'project',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return updatedProject;
}

async function deleteProject(id) {
  const project = await getProjectById(id);

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  await activitiesService.addActivity({
    message: `Project deleted: ${project.title}`,
    type: 'project',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return Number(id);
}

const projectsService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectsService;
