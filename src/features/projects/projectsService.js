import API_URL from '../../services/api';

async function getProjects() {
  const res = await fetch(`${API_URL}/projects`);

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return await res.json();
}

const projectsService = {
  getProjects,
};

export default projectsService;
