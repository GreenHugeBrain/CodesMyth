// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  // Check if user exists and is admin
  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute