import API_URL from '../../services/api';

async function getActivities() {
  const res = await fetch(`${API_URL}/activities`);

  if (!res.ok) {
    throw new Error('Failed to fetch activities');
  }

  return await res.json();
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
