import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Generate from './pages/Generate'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Profile/Dashboard'
import Projects from './pages/Profile/Projects'
import Settings from './pages/Profile/Settings'
import ProtectedRoute from './components/ProtectedRoute'

// Admin Pages
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/Admin/AdminDashboard'
import PendingProjects from './pages/Admin/PendingProjects'
import ProjectDetails from './pages/Admin/ProjectDetails'
import UsersManagement from './pages/Admin/UsersManagement'
import AllProjects from './pages/Admin/AllProjects'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Protected Routes */}
            <Route path="/profile/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/profile/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/pending" element={
              <AdminRoute>
                <PendingProjects />
              </AdminRoute>
            } />
            <Route path="/admin/projects" element={
              <AdminRoute>
                <AllProjects />
              </AdminRoute>
            } />
            <Route path="/admin/projects/:id" element={
              <AdminRoute>
                <ProjectDetails />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UsersManagement />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App