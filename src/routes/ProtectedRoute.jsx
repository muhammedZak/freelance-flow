import { Link, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
        <h1 className='mb-2 text-2xl font-bold text-red-700'>Access Denied</h1>

        <p className='mb-4 text-red-600'>
          Your role does not have permission to open this page.
        </p>

        <Link
          to='/dashboard'
          className='inline-block rounded bg-red-600 px-4 py-2 text-white'>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
