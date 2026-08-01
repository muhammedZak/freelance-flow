import apiClient from '../../api/apiClient';
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
  const { data } = await apiClient.get('/projects');

  return data;
}

async function getProjectById(id, { signal } = {}) {
  const projectId = String(id);

  const { data } = await apiClient.get(`/projects/${projectId}`, {
    signal,
  });

  return data;
}

async function createProject(projectData) {
  const newProject = {
    ...projectData,
    createdAt: getActivityDate(),
  };

  const { data: savedProject } = await apiClient.post('/projects', newProject);

  await logProjectActivity(`Project created: ${savedProject.title}`);

  return savedProject;
}

async function updateProject(id, projectData) {
  const projectId = String(id);

  const { data: updatedProject } = await apiClient.patch(
    `/projects/${projectId}`,
    projectData,
  );

  await logProjectActivity(`Project updated: ${updatedProject.title}`);

  return updatedProject;
}

async function deleteProject(id) {
  const deletedProjectId = String(id);

  const project = await getProjectById(deletedProjectId);

  await apiClient.delete(`/projects/${deletedProjectId}`);

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
