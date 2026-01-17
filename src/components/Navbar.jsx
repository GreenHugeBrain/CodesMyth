import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, LogOut, LayoutDashboard, Folder, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-primary-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">Website Builder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors relative group">
              <span>მთავარი</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/generate" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors relative group">
              <span>გენერაცია</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile/dashboard" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-semibold group"
                >
                  <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                  <span>დაშბორდი</span>
                </Link>
                <Link 
                  to="/profile/projects" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-semibold group"
                >
                  <Folder size={20} className="group-hover:scale-110 transition-transform" />
                  <span>პროექტები</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold"
                >
                  <LogOut size={18} />
                  <span>გასვლა</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-semibold transition-colors">
                  შესვლა
                </Link>
                <Link to="/register" className="btn-primary text-sm px-6 py-2.5">
                  რეგისტრაცია
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-primary-100/50 animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              მთავარი
            </Link>
            <Link 
              to="/generate" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              გენერაცია
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  <LayoutDashboard size={20} />
                  <span>დაშბორდი</span>
                </Link>
                <Link 
                  to="/profile/projects" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  <Folder size={20} />
                  <span>პროექტები</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold"
                >
                  <LogOut size={20} />
                  <span>გასვლა</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                >
                  შესვლა
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-semibold text-center"
                >
                  რეგისტრაცია
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
