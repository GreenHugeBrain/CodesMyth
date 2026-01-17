import { useState, useEffect } from 'react'
import { api } from '../../utils/api'
import { Download, Trash2, Eye, Edit, Calendar, Loader } from 'lucide-react'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [filter])

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/projects?filter=${filter}`)
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!confirm('დარწმუნებული ხარ რომ გსურს პროექტის წაშლა?')) return

    try {
      await api.delete(`/projects/${projectId}`)
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (error) {
      alert('წაშლის შეცდომა')
    }
  }

  const handleDownload = async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/download`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `project-${projectId}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('ჩამოტვირთვის შეცდომა')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary-600" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ჩემი პროექტები</h1>
            <p className="text-gray-600">მართე შენი შექმნილი ვებსაიტები</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              ყველა
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              დასრულებული
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in_progress'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              პროცესში
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">პროექტები არ მოიძებნა</h3>
            <p className="text-gray-600 mb-6">შექმენი შენი პირველი ვებსაიტი</p>
            <a href="/generate" className="btn-primary inline-block">
              შექმენი პროექტი
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="card group">
                <div className="relative mb-4 h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    🌐
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {project.status === 'completed' ? 'დასრულებული' : 'პროცესში'}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(project.created_at).toLocaleDateString('ka-GE')}</span>
                  <span className="mx-2">•</span>
                  <span>{project.pages_count} გვერდი</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(project.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                  >
                    <Download size={16} className="mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
