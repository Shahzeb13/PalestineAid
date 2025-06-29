import { useAuth } from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin-dashboard" />;
    case 'donater':
      return <Navigate to="/donater-dashboard" />;
    case 'receiver':
      return <Navigate to="/receiver-dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default Dashboard;