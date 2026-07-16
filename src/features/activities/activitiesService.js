import API_URL from '../../services/api';

async function getActivities() {
  const res = await fetch(`${API_URL}/activities`);

  if (!res.ok) {
    throw new Error('Failed to fetch activities');
  }

  return await res.json();
}

async function addActivity(activityData) {
  const res = await fetch(`${API_URL}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activityData),
  });

  if (!res.ok) {
    throw new Error('Failed to add activity');
  }

  return await res.json();
}

const activitiesService = {
  getActivities,
  addActivity,
};

export default activitiesService;
