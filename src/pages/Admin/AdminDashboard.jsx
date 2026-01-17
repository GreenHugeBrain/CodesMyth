// src/pages/Admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { 
  Users, 
  Folder, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_projects: 0,
    pending_projects: 0,
    in_progress_projects: 0,
    completed_projects: 0,
    failed_projects: 0,
    recent_users: 0,
    recent_projects: 0,
    latest_projects: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    )
  }

  const statusColors = {
    pending: 'bg-yellow-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500'
  }

  const statusLabels = {
    pending: 'მოლოდინში',
    in_progress: 'პროცესში',
    completed: 'დასრულებული',
    failed: 'ჩავარდნილი'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-cyan-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Activity className="mr-3" size={40} />
                Admin Dashboard
              </h1>
              <p className="text-primary-100 text-lg">სისტემის მართვის პანელი</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-primary-100">ბოლო განახლება</div>
                <div className="text-white font-semibold">{new Date().toLocaleTimeString('ka-GE')}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="text-white" size={28} />
              </div>
              <div className="text-white/80 text-sm">+{stats.recent_users} ამ კვირაში</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-1">{stats.total_users}</div>
              <div className="text-blue-100">მომხმარებელი</div>
            </div>
          </div>

          {/* Total Projects */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Folder className="text-white" size={28} />
              </div>
              <div className="text-white/80 text-sm">+{stats.recent_projects} ამ კვირაში</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-1">{stats.total_projects}</div>
              <div className="text-purple-100">პროექტი</div>
            </div>
          </div>

          {/* Pending Projects */}
          <Link to="/admin/pending" className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="text-white" size={28} />
              </div>
              <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={20} />
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-1">{stats.pending_projects}</div>
              <div className="text-yellow-100">მოლოდინში</div>
            </div>
          </Link>

          {/* Completed Projects */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="text-white" size={28} />
              </div>
              <TrendingUp className="text-white" size={20} />
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-1">{stats.completed_projects}</div>
              <div className="text-green-100">დასრულებული</div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">პროცესში</h3>
              <Activity className="text-blue-400" size={20} />
            </div>
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats.in_progress_projects}</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(stats.in_progress_projects / stats.total_projects) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">ჩავარდნილი</h3>
              <AlertCircle className="text-red-400" size={20} />
            </div>
            <div className="text-4xl font-bold text-red-400 mb-2">{stats.failed_projects}</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${(stats.failed_projects / stats.total_projects) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">წარმატება</h3>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">
              {((stats.completed_projects / stats.total_projects) * 100).toFixed(1)}%
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(stats.completed_projects / stats.total_projects) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/admin/users" className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">მართე მომხმარებლები</h3>
                <p className="text-gray-400">ნახე და მართე ყველა რეგისტრირებული იუზერი</p>
              </div>
              <Users className="text-gray-600 group-hover:text-primary-500 group-hover:scale-110 transition-all" size={48} />
            </div>
          </Link>

          <Link to="/admin/projects" className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">ყველა პროექტი</h3>
                <p className="text-gray-400">ნახე და მართე ყველა პროექტი</p>
              </div>
              <Folder className="text-gray-600 group-hover:text-primary-500 group-hover:scale-110 transition-all" size={48} />
            </div>
          </Link>
        </div>

        {/* Latest Projects */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Activity className="mr-3 text-primary-400" size={28} />
              ბოლო პროექტები
            </h2>
          </div>
          <div className="p-6">
            {stats.latest_projects.length > 0 ? (
              <div className="space-y-4">
                {stats.latest_projects.map((project) => (
                  <Link 
                    key={project.id}
                    to={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">{project.name}</h3>
                        <p className="text-sm text-gray-400">{new Date(project.created_at).toLocaleDateString('ka-GE')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </span>
                      <ArrowRight className="text-gray-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Folder className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">პროექტები არ მოიძებნა</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard