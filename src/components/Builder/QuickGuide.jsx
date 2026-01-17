// src/components/Builder/QuickGuide.jsx
import { X, MousePointer2, Move, Maximize2, Palette, Save, Eye } from 'lucide-react'

const QuickGuide = ({ onClose }) => {
  const shortcuts = [
    { icon: <MousePointer2 size={20} />, action: 'კლიკი', description: 'ელემენტის არჩევა' },
    { icon: <Move size={20} />, action: 'გადათრევა', description: 'ელემენტის გადატანა' },
    { icon: <Maximize2 size={20} />, action: 'resize', description: 'ზომის შეცვლა (8 handle)' },
    { icon: <Palette size={20} />, action: 'მარჯვენა პანელი', description: 'სტილების რედაქტირება' }
  ]

  const tips = [
    '🎨 ყველა კომპონენტი სრულად რედაქტირებადია',
    '📱 შეამოწმე როგორ გამოიყურება სხვადასხვა ეკრანზე',
    '💾 ავტომატური შენახვა ყოველ 30 წამში',
    '⚡ Ctrl+Z - Undo, Ctrl+Y - Redo',
    '🔄 Ctrl+D - Duplicate selected element',
    '🗑️ Delete ღილაკი - არჩეულის წაშლა'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-cyan-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">🚀 სწრაფი სახელმძღვანელო</h2>
              <p className="text-primary-100">ყველაფერი რაც გჭირდება დასაწყებად</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Actions */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MousePointer2 className="text-primary-600" />
              ძირითადი მოქმედებები
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                      {shortcut.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{shortcut.action}</div>
                      <div className="text-sm text-gray-600">{shortcut.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step by Step */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 ნაბიჯ-ნაბიჯ</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold text-gray-900">აირჩიე კომპონენტი</div>
                  <div className="text-sm text-gray-600">მარცხენა სიდებარიდან</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold text-gray-900">გადმოათრიე canvas-ზე</div>
                  <div className="text-sm text-gray-600">drag & drop სისტემა</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-semibold text-gray-900">დაარედაქტირე</div>
                  <div className="text-sm text-gray-600">მარჯვენა პანელიდან ან ორმაგი კლიკით</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <div className="font-semibold text-gray-900">შეინახე</div>
                  <div className="text-sm text-gray-600">ზედა მარჯვენა კუთხეში "შენახვა" ღილაკი</div>
                </div>
              </li>
            </ol>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              💡 სასარგებლო რჩევები
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Types */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎨 კომპონენტების ტიპები</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <div className="font-bold mb-1">ძირითადი</div>
                <div className="text-gray-600">Text, Button, Image</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-bold mb-1">განლაგება</div>
                <div className="text-gray-600">Container, Section</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-bold mb-1">გამზადებული</div>
                <div className="text-gray-600">Header, Footer, Hero</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-bold mb-1">სპეციალური</div>
                <div className="text-gray-600">Pricing, Team, Stats</div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">⌨️ კლავიატურის მალსახმობები</h3>
            <div className="bg-gray-900 text-white p-4 rounded-xl space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Ctrl + Z</span>
                <span>Undo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ctrl + Y</span>
                <span>Redo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ctrl + D</span>
                <span>Duplicate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delete</span>
                <span>Remove Element</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ctrl + S</span>
                <span>Save Project</span>
              </div>
            </div>
          </div>

          {/* Video Tutorial CTA */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">📹 ვიდეო გაკვეთილი</h3>
                <p className="text-red-100">უყურე 5 წუთიან ვიდეოს სრული ფუნქციონალის შესახებ</p>
              </div>
              <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:shadow-lg transition">
                ნახვა
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition"
          >
            მივიღე! დავიწყოთ შექმნა 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickGuide