// src/pages/Admin/UsersManagement.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../utils/api'
import { 
  Users, 
  Search,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Shield,
  Activity
} from 'lucide-react'

const UsersManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/users?page=${page}&search=${search}`)
      setUsers(response.data.users)
      setTotalPages(response.data.pages)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`)
      fetchUsers() // Refresh list
    } catch (error) {
      alert('შეცდომა სტატუსის შეცვლისას')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('დარწმუნებული ხარ რომ გსურს იუზერის წაშლა?')) return

    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers() // Refresh list
    } catch (error) {
      alert('შეცდომა წაშლისას')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Users className="mr-3" size={40} />
                მომხმარებლები
              </h1>
              <p className="text-blue-100 text-lg">მართე ყველა რეგისტრირებული იუზერი</p>
            </div>
            <Link to="/admin" className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ძიება სახელით ან ელ-ფოსტით..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">მომხმარებლები არ მოიძებნა</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        მომხმარებელი
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        ელ-ფოსტა
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        რეგისტრაცია
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        სტატუსი
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        როლი
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        მოქმედებები
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{user.name}</div>
                              <div className="text-xs text-gray-400">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-300">
                            <Mail size={14} className="mr-2 text-gray-500" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-400 text-sm">
                            <Calendar size={14} className="mr-2" />
                            {new Date(user.created_at).toLocaleDateString('ka-GE')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/50'
                          }`}>
                            {user.is_active ? 'აქტიური' : 'დეაქტივირებული'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.is_admin && (
                            <span className="flex items-center text-yellow-400 text-sm font-semibold">
                              <Shield size={14} className="mr-1" />
                              Admin
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/users/${user.id}`}
                              className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-all"
                              title="დეტალები"
                            >
                              <Eye size={18} />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2 rounded-lg transition-all ${
                                user.is_active
                                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              }`}
                              title={user.is_active ? 'დეაქტივაცია' : 'აქტივაცია'}
                            >
                              {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                            </button>
                            {!user.is_admin && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                title="წაშლა"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
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
    </div>
  )
}

export default UsersManagement