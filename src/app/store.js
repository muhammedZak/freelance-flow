import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import clientsReducer from '../features/clients/clientsSlice';
import projectsReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import invoicesReducer from '../features/invoices/invoicesSlice';
import activitiesReducer from '../features/activities/activitiesSlice';
import paymentsReducer from '../features/payments/paymentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    invoices: invoicesReducer,
    activities: activitiesReducer,
    payments: paymentsReducer,
  },
});
