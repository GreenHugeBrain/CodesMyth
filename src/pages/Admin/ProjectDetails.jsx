// src/pages/Admin/ProjectDetails.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { 
  ArrowLeft,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Wrench,
  Play,
  Calendar,
  User,
  Folder,
  Code,
  Download,
  Loader
} from 'lucide-react'

const ProjectDetails = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [startingGeneration, setStartingGeneration] = useState(false)
  const logsEndRef = useRef(null)
  const pollingInterval = useRef(null)
  const logsContainerRef = useRef(null)

  useEffect(() => {
    fetchProjectDetails()
    startLogPolling()

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [id])

  // DISABLED AUTO-SCROLL - uncomment if needed
  // useEffect(() => {
  //   if (!isInitialLoad && logsEndRef.current && logsContainerRef.current) {
  //     const container = logsContainerRef.current
  //     const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
  //     
  //     if (isNearBottom) {
  //       logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
  //     }
  //   }
  //   
  //   if (isInitialLoad && logs.length > 0) {
  //     setIsInitialLoad(false)
  //   }
  // }, [logs])

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/admin/projects/${id}`)
      const projectData = response.data
      
      // Parse logs details safely
      const parsedLogs = (projectData.logs || []).map(log => ({
        ...log,
        details: typeof log.details === 'string' 
          ? (log.details ? JSON.parse(log.details) : null)
          : log.details
      }))
      
      setProject(projectData)
      setLogs(parsedLogs)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const startLogPolling = () => {
    // Poll for new logs every 2 seconds
    pollingInterval.current = setInterval(async () => {
      try {
        const lastLog = logs[logs.length - 1]
        const sinceParam = lastLog ? `?since=${lastLog.created_at}` : ''
        
        const response = await api.get(`/admin/projects/${id}/logs${sinceParam}`)
        const newLogs = response.data.logs
        
        if (newLogs.length > 0) {
          // Parse details safely
          const parsedNewLogs = newLogs.map(log => ({
            ...log,
            details: typeof log.details === 'string'
              ? (log.details ? JSON.parse(log.details) : null)
              : log.details
          }))
          
          // Filter out duplicates by checking existing log IDs
          setLogs(prev => {
            const existingIds = new Set(prev.map(l => l.id))
            const uniqueNewLogs = parsedNewLogs.filter(l => !existingIds.has(l.id))
            return [...prev, ...uniqueNewLogs]
          })
        }
      } catch (error) {
        console.error('Error polling logs:', error)
      }
    }, 2000)
  }

  const handleStartGeneration = async () => {
    if (!confirm('დარწმუნებული ხარ რომ გსურს გენერაციის დაწყება?')) return

    setStartingGeneration(true)
    try {
      await api.post(`/admin/projects/${id}/start-generation`)
      
      // Refresh project to get updated status
      await fetchProjectDetails()
      
      alert('გენერაცია დაიწყო! ლოგები ჩანს ქვემოთ')
    } catch (error) {
      alert('გენერაციის დაწყების შეცდომა: ' + (error.response?.data?.error || 'Unknown error'))
    } finally {
      setStartingGeneration(false)
    }
  }

  const getLogIcon = (logType) => {
    switch (logType) {
      case 'success':
        return <CheckCircle size={18} className="text-green-400" />
      case 'error':
        return <XCircle size={18} className="text-red-400" />
      case 'test':
        return <Activity size={18} className="text-blue-400" />
      case 'fix':
        return <Wrench size={18} className="text-yellow-400" />
      default:
        return <Info size={18} className="text-gray-400" />
    }
  }

  const getLogColor = (logType) => {
    switch (logType) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-300'
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-300'
      case 'test':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300'
      case 'fix':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-300'
    }
  }

  const statusColors = {
    pending: { bg: 'bg-yellow-500', text: 'text-yellow-100', label: 'მოლოდინში' },
    in_progress: { bg: 'bg-blue-500', text: 'text-blue-100', label: 'პროცესში' },
    completed: { bg: 'bg-green-500', text: 'text-green-100', label: 'დასრულებული' },
    failed: { bg: 'bg-red-500', text: 'text-red-100', label: 'ჩავარდნილი' }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">პროექტი ვერ მოიძებნა</h2>
          <Link to="/admin" className="text-primary-400 hover:underline">← დაბრუნება Dashboard-ზე</Link>
        </div>
      </div>
    )
  }

  const statusConfig = statusColors[project.status] || statusColors.pending

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-cyan-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link to="/admin" className="text-primary-100 hover:text-white mb-4 inline-flex items-center">
                <ArrowLeft size={20} className="mr-2" />
                Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-primary-100 text-lg mb-4">{project.description}</p>
              <div className="flex items-center space-x-4 text-sm text-primary-100">
                <span className="flex items-center">
                  <User size={16} className="mr-1" />
                  User ID: {project.user_id}
                </span>
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(project.created_at).toLocaleDateString('ka-GE')}
                </span>
                <span className="flex items-center">
                  <Folder size={16} className="mr-1" />
                  {project.pages_count} გვერდი
                </span>
              </div>
            </div>
            <span className={`px-6 py-3 rounded-xl text-lg font-bold ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Info className="mr-2 text-primary-400" size={24} />
                პროექტის ინფო
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Website Type</div>
                  <div className="text-white font-semibold">{project.website_type || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Industry</div>
                  <div className="text-white font-semibold">{project.industry || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Target Audience</div>
                  <div className="text-white font-semibold">{project.target_audience || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Primary Goal</div>
                  <div className="text-white font-semibold">{project.primary_goal || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Color Preference</div>
                  <div className="text-white font-semibold">{project.color_preference || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">ფასი</div>
                  <div className="text-2xl font-bold text-green-400">{project.calculated_price} ₾</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="mr-2 text-primary-400" size={24} />
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-xs text-gray-400">შექმნილია</div>
                    <div className="text-white text-sm">{new Date(project.created_at).toLocaleString('ka-GE')}</div>
                  </div>
                </div>
                {project.generation_started_at && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <div className="text-xs text-gray-400">გენერაცია დაწყებულია</div>
                      <div className="text-white text-sm">{new Date(project.generation_started_at).toLocaleString('ka-GE')}</div>
                    </div>
                  </div>
                )}
                {project.completed_at && (
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${project.status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className="text-xs text-gray-400">დასრულებულია</div>
                      <div className="text-white text-sm">{new Date(project.completed_at).toLocaleString('ka-GE')}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {project.status === 'pending' && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Play className="mr-2 text-yellow-400" size={24} />
                  მოქმედებები
                </h3>
                <button 
                  onClick={handleStartGeneration}
                  disabled={startingGeneration}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {startingGeneration ? (
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
              </div>
            )}
            {project.status === 'completed' && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
                <button className="w-full bg-gradient-to-r from-primary-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center">
                  <Download className="mr-2" size={20} />
                  Download Project
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Live Logs */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Code className="mr-3 text-primary-400" size={28} />
                  Live Generation Logs
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Live</span>
                </div>
              </div>

              <div className="bg-gray-900 p-6 max-h-[600px] overflow-y-auto custom-scrollbar" ref={logsContainerRef}>
                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="text-gray-400">ლოგები ჯერ არ არის...</p>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div
                        key={`${log.id}-${index}-${log.created_at}`}
                        className={`p-4 rounded-lg border ${getLogColor(log.log_type)} animate-fade-in`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">{getLogIcon(log.log_type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold uppercase text-xs">{log.log_type}</span>
                              <span className="text-xs opacity-60">
                                {new Date(log.created_at).toLocaleTimeString('ka-GE')}
                              </span>
                            </div>
                            <div className="text-sm">{log.message}</div>
                            {log.details && (
                              <pre className="mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails