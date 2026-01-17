// src/pages/Generate.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { 
  Building2, 
  ShoppingBag, 
  Heart, 
  BookOpen, 
  Coffee, 
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Save,
  Layers,
  HelpCircle,
  X,
  Lightbulb,
  Undo,
  Redo,
  Copy,
  Download
} from 'lucide-react'
import BuilderSidebar from '../components/Builder/BuilderSidebar'
import BuilderCanvas from '../components/Builder/BuilderCanvas'
import BuilderProperties from '../components/Builder/BuilderProperties'

const Generate = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [onboardingStep, setOnboardingStep] = useState(0)
  
  // Builder State
  const [pages, setPages] = useState([
    { id: 'page-1', name: 'მთავარი', elements: [] }
  ])
  const [activePage, setActivePage] = useState('page-1')
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [history, setHistory] = useState([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  // Save to history when elements change
  useEffect(() => {
    if (elements.length > 0 || historyIndex > 0) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(elements)))
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [elements.length])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }

  const handleQuickAdd = (component) => {
    let width = component.defaultWidth || 200
    let height = component.defaultHeight || 100
    
    // Center position
    let x = (1440 - width) / 2
    let y = (1024 - height) / 2
    
    // Smart positioning for special components
    if (component.componentType === 'header' || component.componentType === 'navbar') {
      width = 1440
      x = 0
      y = 0
    } else if (component.componentType === 'footer') {
      width = 1440
      x = 0
      y = 1024 - height
    }
    
    const newElement = {
      id: `element-${Date.now()}`,
      type: component.componentType,
      x,
      y,
      width,
      height,
      styles: JSON.parse(JSON.stringify(component.defaultStyles || {})),
      content: JSON.parse(JSON.stringify(component.defaultContent || {})),
      pageId: activePage,
      locked: false
    }
    
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement)
    
    // Success toast
    const toast = document.createElement('div')
    toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up font-semibold'
    toast.innerHTML = `✅ ${component.label} დაემატა!`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }
  
  // Tutorial tooltips
  const [showTooltip, setShowTooltip] = useState(null)

  const websiteTypes = [
    { 
      id: 'business', 
      name: 'ბიზნეს საიტი', 
      icon: <Building2 size={32} />,
      description: 'კომპანიის პრეზენტაცია, სერვისები',
      examples: '🏢 მაგალითები: კონსალტინგი, სააგენტო'
    },
    { 
      id: 'ecommerce', 
      name: 'ინტერნეტ მაღაზია', 
      icon: <ShoppingBag size={32} />,
      description: 'ონლაინ ვაჭრობა პროდუქტებით',
      examples: '🛍️ მაგალითები: ტანსაცმელი, ელექტრონიკა'
    },
    { 
      id: 'portfolio', 
      name: 'პორტფოლიო', 
      icon: <BookOpen size={32} />,
      description: 'შენი სამუშაოების ჩვენება',
      examples: '🎨 მაგალითები: დიზაინერი, ფოტოგრაფი'
    },
    { 
      id: 'restaurant', 
      name: 'რესტორანი/კაფე', 
      icon: <Coffee size={32} />,
      description: 'მენიუ და ონლაინ შეკვეთები',
      examples: '🍽️ მაგალითები: რესტორანი, ბარი'
    },
    { 
      id: 'medical', 
      name: 'მედიცინა', 
      icon: <Heart size={32} />,
      description: 'კლინიკა, ექიმის საიტი',
      examples: '⚕️ მაგალითები: კლინიკა, კაბინეტი'
    }
  ]

  // Onboarding steps
  const onboardingSteps = [
    {
      title: '👋 გამარჯობა!',
      description: 'მოგესალმები AI Website Builder-ში! აქ შეგიძლია შექმნა შენი საოცნებო ვებსაიტი სულ რამდენიმე წუთში.',
      tips: ['არ არის საჭირო პროგრამირების ცოდნა', 'მარტივი drag & drop სისტემა', 'რეალურ დროში preview']
    },
    {
      title: '🎨 როგორ მუშაობს?',
      description: '1️⃣ აირჩიე ვებსაიტის ტიპი\n2️⃣ გადმოათრიე კომპონენტები canvas-ზე\n3️⃣ დაარედაქტირე როგორც გინდა\n4️⃣ შეინახე და გამოიყენე!',
      tips: ['ყველა კომპონენტი სრულად მორგებადია', 'შეგიძლია დაამატო რამდენიმე გვერდი', 'ავტომატური შენახვა']
    }
  ]

  useEffect(() => {
    // Check if first time user
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (hasSeenOnboarding) {
      setShowOnboarding(false)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setShowOnboarding(false)
  }

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId)
    setStep(2)
    
    // Show tooltips for first-time users
    setTimeout(() => setShowTooltip('sidebar'), 1000)
    setTimeout(() => setShowTooltip('canvas'), 3000)
    setTimeout(() => setShowTooltip(null), 6000)
  }

  const addPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `გვერდი ${pages.length + 1}`,
      elements: []
    }
    setPages([...pages, newPage])
    setActivePage(newPage.id)
  }

  const deletePage = (pageId) => {
    if (pages.length === 1) {
      alert('❌ უნდა იყოს მინიმუმ 1 გვერდი')
      return
    }
    
    if (!confirm('⚠️ დარწმუნებული ხარ რომ გსურს ამ გვერდის წაშლა?')) return
    
    setPages(pages.filter(p => p.id !== pageId))
    if (activePage === pageId) {
      setActivePage(pages[0].id)
    }
    setElements(elements.filter(el => el.pageId !== pageId))
  }

  const renamePage = (pageId, newName) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, name: newName } : p))
  }

  const handleSave = async () => {
    if (!user) {
      if (confirm('🔐 შენახვისთვის საჭიროა ავტორიზაცია. გსურს შესვლა?')) {
        navigate('/login')
      }
      return
    }

    const projectData = {
      websiteType: selectedType,
      pages: pages.map(page => ({
        ...page,
        elements: elements.filter(el => el.pageId === page.id)
      }))
    }

    console.log('Saving project:', projectData)
    // TODO: Send to backend
    
    // Show success message
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up'
    toast.innerHTML = '✅ პროექტი შენახულია!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const duplicateElement = () => {
    if (!selectedElement) return
    
    const newElement = {
      ...selectedElement,
      id: `element-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20
    }
    
    setElements([...elements, newElement])
    setSelectedElement(newElement)
  }

  // Onboarding Modal
  if (showOnboarding && step === 1) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-scale-up">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{onboardingSteps[onboardingStep].title}</div>
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {onboardingSteps[onboardingStep].description}
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-cyan-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
              <Lightbulb size={20} />
              💡 რჩევები:
            </h4>
            <ul className="space-y-2">
              {onboardingSteps[onboardingStep].tips.map((tip, i) => (
                <li key={i} className="text-sm text-primary-800 flex items-start gap-2">
                  <span className="text-primary-600 mt-0.5">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {onboardingSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === onboardingStep ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={completeOnboarding}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                გამოტოვება
              </button>
              {onboardingStep < onboardingSteps.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
                >
                  შემდეგი
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={completeOnboarding}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  დავიწყოთ! 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress indicator */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <span className="font-semibold text-gray-700">ვებსაიტის ტიპის არჩევა</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              რა სახის ვებსაიტს ქმნი? 🎨
            </h1>
            <p className="text-xl text-gray-600">
              აირჩიე შენი ბიზნესის ტიპი და ჩვენ დაგეხმარებით იდეალური საიტის შექმნაში
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {websiteTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-2xl transition-all duration-300 group text-left overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-gray-600 mb-3">{type.description}</p>
                  <p className="text-sm text-primary-600 font-medium">{type.examples}</p>
                  
                  <div className="mt-4 flex items-center text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>აირჩიე</span>
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Help section */}
          <div className="bg-white rounded-xl p-6 border-2 border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">არ იცი რომელი აირჩიო?</h3>
                <p className="text-gray-600 mb-3">
                  არ ინერვიულო! შეგიძლია შემდეგ შეცვალო ან კომბინირება გააკეთო. 
                  ყველა ტიპი მხარს უჭერს ყველა ფუნქციას.
                </p>
                <button className="text-primary-600 font-semibold hover:underline flex items-center gap-2">
                  <Lightbulb size={16} />
                  იხილე მაგალითები
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        {/* Enhanced Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('⚠️ დარწმუნებული ხარ? შეუნახავი ცვლილებები დაიკარგება.')) {
                  setStep(1)
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="უკან დაბრუნება"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                AI
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Website Builder</h1>
                <p className="text-xs text-gray-600">
                  {websiteTypes.find(t => t.id === selectedType)?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={20} />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={20} />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <button 
              onClick={duplicateElement}
              disabled={!selectedElement}
              className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Duplicate (Ctrl+D)"
            >
              <Copy size={20} />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition flex items-center gap-2"
              title="Preview"
            >
              <Eye size={18} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-cyan-600 hover:shadow-lg text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Save size={18} />
              <span className="hidden sm:inline">შენახვა</span>
            </button>
            
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="დახმარება"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Pages Navigation */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-2 overflow-x-auto shadow-sm">
          <div className="flex items-center gap-2 mr-4">
            <Layers size={18} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">გვერდები:</span>
          </div>
          
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all group cursor-pointer
                ${activePage === page.id 
                  ? 'bg-gradient-to-r from-primary-600 to-cyan-600 border-primary-600 text-white shadow-lg' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow'
                }
              `}
              onClick={() => setActivePage(page.id)}
            >
              <input
                type="text"
                value={page.name}
                onChange={(e) => {
                  e.stopPropagation()
                  renamePage(page.id, e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className={`
                  bg-transparent border-none outline-none font-medium text-sm w-24
                  ${activePage === page.id ? 'text-white placeholder-white/70' : 'text-gray-700'}
                `}
                placeholder={`გვერდი ${index + 1}`}
              />
              {pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePage(page.id)
                  }}
                  className={`
                    p-1 rounded opacity-0 group-hover:opacity-100 transition
                    ${activePage === page.id 
                      ? 'hover:bg-white/20' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addPage}
            className="px-4 py-2 bg-gradient-to-r from-primary-50 to-cyan-50 border-2 border-dashed border-primary-300 hover:border-primary-400 rounded-lg font-medium text-sm text-primary-700 hover:shadow transition flex items-center gap-2 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            <span>ახალი გვერდი</span>
          </button>
        </div>

        {/* Main Builder Area with Tooltips */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Tooltip for sidebar */}
          {showTooltip === 'sidebar' && (
            <div className="absolute left-80 top-20 z-50 animate-bounce">
              <div className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-2xl relative">
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-600 rotate-45" />
                <p className="font-semibold">👈 აქედან გადმოათრიე კომპონენტები!</p>
              </div>
            </div>
          )}

          {/* Tooltip for canvas */}
          {showTooltip === 'canvas' && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-pulse">
              <div className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-2xl">
                <p className="font-semibold">🎨 აქ ააწყე შენი ვებსაიტი!</p>
              </div>
            </div>
          )}

          <BuilderSidebar onQuickAdd={handleQuickAdd} />
          <BuilderCanvas
            elements={elements}
            setElements={setElements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            activePage={activePage}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
          <BuilderProperties
            selectedElement={selectedElement}
            onUpdate={(updates) => {
              if (selectedElement) {
                setElements(elements.map(el => 
                  el.id === selectedElement.id ? { ...el, ...updates } : el
                ))
                setSelectedElement({ ...selectedElement, ...updates })
              }
            }}
          />
        </div>
      </div>
    </DndProvider>
  )
}

export default Generate