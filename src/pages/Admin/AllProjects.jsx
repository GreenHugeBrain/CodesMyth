// src/pages/Admin/AllProjects.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { 
  Folder, 
  Eye,
  Calendar,
  User,
  Filter,
  ArrowRight
} from 'lucide-react'

const AllProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProjects()
  }, [page, statusFilter])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const filterParam = statusFilter ? `&status=${statusFilter}` : ''
      const response = await api.get(`/admin/projects?page=${page}${filterParam}`)
      setProjects(response.data.projects)
      setTotalPages(response.data.pages)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    pending: { bg: 'bg-yellow-500', text: 'text-yellow-100', label: 'მოლოდინში' },
    in_progress: { bg: 'bg-blue-500', text: 'text-blue-100', label: 'პროცესში' },
    completed: { bg: 'bg-green-500', text: 'text-green-100', label: 'დასრულებული' },
    failed: { bg: 'bg-red-500', text: 'text-red-100', label: 'ჩავარდნილი' }
  }

  const filters = [
    { value: '', label: 'ყველა' },
    { value: 'pending', label: 'მოლოდინში' },
    { value: 'in_progress', label: 'პროცესში' },
    { value: 'completed', label: 'დასრულებული' },
    { value: 'failed', label: 'ჩავარდნილი' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Folder className="mr-3" size={40} />
                ყველა პროექტი
              </h1>
              <p className="text-purple-100 text-lg">ნახე და მართე ყველა გენერირებული საიტი</p>
            </div>
            <Link to="/admin" className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center space-x-3">
          <Filter className="text-gray-400" size={20} />
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setStatusFilter(filter.value)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === filter.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
            <Folder className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">პროექტები არ მოიძებნა</h3>
            <p className="text-gray-400">სცადე სხვა ფილტრი</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {projects.map((project) => {
                const statusConfig = statusColors[project.status] || statusColors.pending
                return (
                  <Link
                    key={project.id}
                    to={`/admin/projects/${project.id}`}
                    className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User size={14} className="mr-2" />
                          <span>User ID: {project.user_id}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2" />
                          <span>{new Date(project.created_at).toLocaleDateString('ka-GE')}</span>
                        </div>
                        <div className="flex items-center">
                          <Folder size={14} className="mr-2" />
                          <span>{project.pages_count} გვერდი</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                        <div className="text-green-400 font-bold">{project.calculated_price} ₾</div>
                        <div className="flex items-center text-primary-400 group-hover:translate-x-1 transition-transform">
                          <span className="text-sm mr-1">დეტალები</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-800 rounded-xl px-6 py-4 border border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  გვერდი {page} / {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← წინა
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    შემდეგი →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AllProjects