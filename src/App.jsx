import { Route, Routes } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientFormPage from './pages/ClientFormPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectTasksPage from './pages/ProjectTasksPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceFormPage from './pages/InvoiceFormPage';
import InvoiceDetailsPage from './pages/InvoiceDetailsPage';
import PaymentsPage from './pages/PaymentsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path='/dashboard' element={<DashboardPage />} />

        <Route path='/clients' element={<ClientsPage />} />
        <Route path='/clients/new' element={<ClientFormPage />} />
        <Route path='/clients/:id' element={<ClientDetailsPage />} />
        <Route path='/clients/:id/edit' element={<ClientFormPage />} />

        <Route path='/projects' element={<ProjectsPage />} />
        <Route path='/projects/new' element={<ProjectFormPage />} />
        <Route path='/projects/:id' element={<ProjectDetailsPage />} />
        <Route path='/projects/:id/edit' element={<ProjectFormPage />} />
        <Route path='/projects/:id/tasks' element={<ProjectTasksPage />} />

        <Route path='/invoices' element={<InvoicesPage />} />
        <Route path='/invoices/new' element={<InvoiceFormPage />} />
        <Route path='/invoices/:id' element={<InvoiceDetailsPage />} />

        <Route path='/payments' element={<PaymentsPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/admin' element={<AdminPage />} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
