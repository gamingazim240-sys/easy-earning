import { Navigate, Outlet } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AdminProtectedRoute = () => {
  const { currentUser } = useData();

  if (!currentUser) {
    // If no user is logged in, redirect to login page.
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.isAdmin) {
    // If the logged-in user is not an admin, redirect to their user dashboard.
    return <Navigate to="/user/dashboard" replace />;
  }

  // If the user is logged in and is an admin, allow access to the admin routes.
  return <Outlet />;
};

export default AdminProtectedRoute;
