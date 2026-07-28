import axios from 'axios';

const API_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
  },
});

export default apiClient;
