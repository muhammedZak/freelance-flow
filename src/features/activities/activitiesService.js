import apiClient from '../../api/apiClient';

async function getActivities() {
  const { data } = await apiClient.get('/activities');

  return data;
}

async function addActivity(activityData) {
  const { data } = await apiClient.post('/activities', activityData);

  return data;
}

const activitiesService = {
  getActivities,
  addActivity,
};

export default activitiesService;
