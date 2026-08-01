import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import { clientsReducer } from '@features/clients';
import { projectsReducer } from '@features/projects';
import { tasksReducer } from '@features/tasks';
import { invoicesReducer } from '@features/invoices';
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
