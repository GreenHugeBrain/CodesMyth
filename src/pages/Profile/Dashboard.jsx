import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'
import { Folder, TrendingUp, Clock, CheckCircle, Plus } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            გამარჯობა, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">აქ არის შენი პროექტების სტატისტიკა</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">სულ პროექტები</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalProjects}</p>
              </div>
              <Folder className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-semibold mb-1">დასრულებული</p>
                <p className="text-3xl font-bold text-green-900">{stats.completedProjects}</p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-semibold mb-1">პროცესში</p>
                <p className="text-3xl font-bold text-orange-900">{stats.inProgressProjects}</p>
              </div>
              <Clock className="text-orange-600" size={40} />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-semibold mb-1">წარმატება</p>
                <p className="text-3xl font-bold text-purple-900">98%</p>
              </div>
              <TrendingUp className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/generate" className="card hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ახალი პროექტი</h3>
                <p className="text-gray-600">შექმენი ახალი ვებსაიტი AI-ის დახმარებით</p>
              </div>
              <Plus className="text-primary-600 group-hover:scale-110 transition-transform" size={40} />
            </div>
          </Link>

          <Link to="/profile/projects" className="card hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ჩემი პროექტები</h3>
                <p className="text-gray-600">ნახე და მართე შენი პროექტები</p>
              </div>
              <Folder className="text-primary-600 group-hover:scale-110 transition-transform" size={40} />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ბოლო აქტივობა</h2>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-primary-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.project}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">ჯერ არ გაქვს აქტივობა</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
