import { ExternalLink } from 'lucide-react'

const TemplateCard = ({ template }) => {
  return (
    <div className="card group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gradient-to-br from-primary-100 to-primary-200">
        <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
          {template.icon}
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary-600">
            {template.category}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{template.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>🎨 {template.pages} გვერდი</span>
          <span>•</span>
          <span>⚡ {template.features} ფუნქცია</span>
        </div>
        <button className="text-primary-600 hover:text-primary-700 transition">
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  )
}

export default TemplateCard
