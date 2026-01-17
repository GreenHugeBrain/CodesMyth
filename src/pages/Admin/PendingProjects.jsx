// src/pages/Admin/PendingProjects.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { 
  Clock, 
  Play, 
  Eye, 
  Calendar,
  User,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react'

const PendingProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [startingProject, setStartingProject] = useState(null)

  useEffect(() => {
    fetchPendingProjects()
  }, [])

  const fetchPendingProjects = async () => {
    try {
      const response = await api.get('/admin/projects/pending')
      setProjects(response.data.projects)
    } catch (error) {
      console.error('Error fetching pending projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartGeneration = async (projectId) => {
    if (!confirm('დარწმუნებული ხარ რომ გსურს გენერაციის დაწყება?')) return

    setStartingProject(projectId)
    try {
      await api.post(`/admin/projects/${projectId}/start-generation`)
      
      // Remove from pending list
      setProjects(projects.filter(p => p.id !== projectId))
      
      alert('გენერაცია დაიწყო! ნახე Project Details გვერდზე')
    } catch (error) {
      alert('გენერაციის დაწყების შეცდომა: ' + (error.response?.data?.error || 'Unknown error'))
    } finally {
      setStartingProject(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Clock className="mr-3" size={40} />
                მოლოდინში მყოფი პროექტები
              </h1>
              <p className="text-yellow-100 text-lg">{projects.length} პროექტი ელოდება დამტკიცებას</p>
            </div>
            <Link to="/admin" className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">ყველა პროექტი დამუშავებულია!</h3>
            <p className="text-gray-400">ახალი პროექტების მოლოდინში...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden hover:border-yellow-500 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{project.name}</h3>
                        <p className="text-gray-400 mb-2">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User size={14} className="mr-1" />
                            User ID: {project.user_id}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(project.created_at).toLocaleDateString('ka-GE', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500 text-white flex items-center">
                      <Clock size={16} className="mr-1" />
                      Pending
                    </span>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-700/50 rounded-xl">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Website Type</div>
                      <div className="text-white font-semibold">{project.website_type || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Industry</div>
                      <div className="text-white font-semibold">{project.industry || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Pages</div>
                      <div className="text-white font-semibold">{project.pages_count} გვერდი</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">ფასი</div>
                      <div className="text-green-400 font-bold">{project.calculated_price} ₾</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleStartGeneration(project.id)}
                      disabled={startingProject === project.id}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {startingProject === project.id ? (
                        <>
                          <Loader className="animate-spin mr-2" size={20} />
                          დაწყება...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2" size={20} />
                          დაიწყე გენერაცია
                        </>
                      )}
                    </button>
                    <Link
                      to={`/admin/projects/${project.id}`}
                      className="px-6 py-3 rounded-xl font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center"
                    >
                      <Eye className="mr-2" size={20} />
                      დეტალები
                    </Link>
                  </div>
                </div>

                {/* Urgent Badge */}
                {project.created_at && (Date.now() - new Date(project.created_at).getTime()) > 3600000 && (
                  <div className="bg-red-500/20 border-t border-red-500/50 px-6 py-3">
                    <div className="flex items-center text-red-400 text-sm">
                      <AlertCircle size={16} className="mr-2" />
                      <span className="font-semibold">გაფრთხილება:</span>
                      <span className="ml-2">პროექტი ელოდება 1 საათზე მეტი ხანი</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingProjects