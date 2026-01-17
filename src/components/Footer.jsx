import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold">Website Builder</span>
            </div>
            <p className="text-gray-400 text-sm">
              შექმენი შენი ვებსაიტი AI-ის ძალით, წამებში!
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">პროდუქტი</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/generate" className="hover:text-white transition">გენერაცია</Link></li>
              <li><Link to="/#templates" className="hover:text-white transition">თემფლეითები</Link></li>
              <li><Link to="/#features" className="hover:text-white transition">ფუნქციები</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition">ფასები</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">კომპანია</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">ჩვენ შესახებ</a></li>
              <li><a href="#" className="hover:text-white transition">ბლოგი</a></li>
              <li><a href="#" className="hover:text-white transition">კარიერა</a></li>
              <li><a href="#" className="hover:text-white transition">კონტაქტი</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">სოციალური ქსელები</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 AI Website Builder. ყველა უფლება დაცულია.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
