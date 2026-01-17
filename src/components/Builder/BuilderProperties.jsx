// src/components/Builder/BuilderProperties.jsx
import { useState } from 'react'
import { 
  Palette, 
  Type, 
  Layout, 
  Maximize, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Plus,
  Trash2
} from 'lucide-react'

const BuilderProperties = ({ selectedElement, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('styles')
  const [expandedSections, setExpandedSections] = useState({
    dimensions: true,
    position: true,
    typography: true,
    colors: true,
    spacing: true,
    borders: true,
    effects: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400 p-8">
          <Layout size={48} className="mx-auto mb-4" />
          <p className="font-medium">არაფერი არჩეული</p>
          <p className="text-sm mt-2">აირჩიე ელემენტი რომ დაარედაქტირო</p>
        </div>
      </div>
    )
  }

  const updateStyle = (key, value) => {
    onUpdate({
      styles: {
        ...selectedElement.styles,
        [key]: value
      }
    })
  }

  const updateContent = (key, value) => {
    onUpdate({
      content: {
        ...selectedElement.content,
        [key]: value
      }
    })
  }

  // Helper functions for complex content
  const addFooterColumn = () => {
    const columns = selectedElement.content.columns || []
    updateContent('columns', [...columns, { title: 'ახალი სვეტი', links: ['ბმული 1', 'ბმული 2'] }])
  }

  const updateFooterColumn = (index, field, value) => {
    const columns = [...(selectedElement.content.columns || [])]
    columns[index] = { ...columns[index], [field]: value }
    updateContent('columns', columns)
  }

  const deleteFooterColumn = (index) => {
    const columns = selectedElement.content.columns.filter((_, i) => i !== index)
    updateContent('columns', columns)
  }

  const addFooterLink = (columnIndex) => {
    const columns = [...(selectedElement.content.columns || [])]
    columns[columnIndex].links.push('ახალი ბმული')
    updateContent('columns', columns)
  }

  const updateFooterLink = (columnIndex, linkIndex, value) => {
    const columns = [...(selectedElement.content.columns || [])]
    columns[columnIndex].links[linkIndex] = value
    updateContent('columns', columns)
  }

  const deleteFooterLink = (columnIndex, linkIndex) => {
    const columns = [...(selectedElement.content.columns || [])]
    columns[columnIndex].links = columns[columnIndex].links.filter((_, i) => i !== linkIndex)
    updateContent('columns', columns)
  }

  const addGridItem = () => {
    const items = selectedElement.content.items || []
    updateContent('items', [...items, { title: 'ახალი', text: 'აღწერა', icon: '⭐' }])
  }

  const updateGridItem = (index, field, value) => {
    const items = [...(selectedElement.content.items || [])]
    items[index] = { ...items[index], [field]: value }
    updateContent('items', items)
  }

  const deleteGridItem = (index) => {
    const items = selectedElement.content.items.filter((_, i) => i !== index)
    updateContent('items', items)
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">თვისებები</h2>
          <p className="text-sm text-gray-600 capitalize">{selectedElement.type}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('styles')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'styles'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Palette size={16} className="inline mr-2" />
            სტილი
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'content'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Type size={16} className="inline mr-2" />
            კონტენტი
          </button>
        </div>

        {/* Styles Tab */}
        {activeTab === 'styles' && (
          <div className="space-y-4">
            {/* Dimensions - Always available */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('dimensions')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <Maximize size={16} />
                  ზომა
                </span>
                <span className={`transform transition-transform ${expandedSections.dimensions ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.dimensions && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">სიგანე (px)</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.width)}
                        onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">სიმაღლე (px)</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.height)}
                        onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Position */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('position')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700">პოზიცია</span>
                <span className={`transform transition-transform ${expandedSections.position ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.position && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">X</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.x)}
                        onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Y</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.y)}
                        onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Typography - For all text-based components */}
            {['text', 'heading', 'button', 'hero', 'cta', 'card', 'navbar', 'header'].includes(selectedElement.type) && (
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => toggleSection('typography')}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <Type size={16} />
                    ტექსტი
                  </span>
                  <span className={`transform transition-transform ${expandedSections.typography ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {expandedSections.typography && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">ზომა (px)</label>
                      <input
                        type="number"
                        min="8"
                        max="200"
                        value={parseInt(selectedElement.styles.fontSize) || 16}
                        onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">ფერი</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={selectedElement.styles.color || '#000000'}
                          onChange={(e) => updateStyle('color', e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedElement.styles.color || '#000000'}
                          onChange={(e) => updateStyle('color', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">სტილი</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStyle('fontWeight', 
                            selectedElement.styles.fontWeight === 'bold' ? 'normal' : 'bold'
                          )}
                          className={`flex-1 p-2 rounded border ${
                            selectedElement.styles.fontWeight === 'bold'
                              ? 'bg-primary-100 border-primary-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <Bold size={16} className="mx-auto" />
                        </button>
                        <button
                          onClick={() => updateStyle('fontStyle', 
                            selectedElement.styles.fontStyle === 'italic' ? 'normal' : 'italic'
                          )}
                          className={`flex-1 p-2 rounded border ${
                            selectedElement.styles.fontStyle === 'italic'
                              ? 'bg-primary-100 border-primary-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <Italic size={16} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">განლაგება</label>
                      <div className="flex gap-2">
                        {['left', 'center', 'right'].map(align => (
                          <button
                            key={align}
                            onClick={() => updateStyle('textAlign', align)}
                            className={`flex-1 p-2 rounded border ${
                              selectedElement.styles.textAlign === align
                                ? 'bg-primary-100 border-primary-500'
                                : 'bg-white border-gray-300'
                            }`}
                          >
                            {align === 'left' && <AlignLeft size={16} className="mx-auto" />}
                            {align === 'center' && <AlignCenter size={16} className="mx-auto" />}
                            {align === 'right' && <AlignRight size={16} className="mx-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">ხაზის სიმაღლე</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="3"
                        value={parseFloat(selectedElement.styles.lineHeight) || 1.5}
                        onChange={(e) => updateStyle('lineHeight', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Colors & Background */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('colors')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <Palette size={16} />
                  ფონი და ფერები
                </span>
                <span className={`transform transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.colors && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ფონის ფერი</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedElement.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElement.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ფონის სურათი (URL)</label>
                    <input
                      type="text"
                      value={selectedElement.styles.backgroundImage?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') || ''}
                      onChange={(e) => updateStyle('backgroundImage', e.target.value ? `url('${e.target.value}')` : '')}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  {selectedElement.styles.backgroundImage && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ფონის ზომა</label>
                        <select
                          value={selectedElement.styles.backgroundSize || 'cover'}
                          onChange={(e) => updateStyle('backgroundSize', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="cover">Cover (სრული დაფარვა)</option>
                          <option value="contain">Contain (შეიცავს)</option>
                          <option value="auto">Auto</option>
                          <option value="100% 100%">Stretch (გაჭიმვა)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ფონის პოზიცია</label>
                        <select
                          value={selectedElement.styles.backgroundPosition || 'center'}
                          onChange={(e) => updateStyle('backgroundPosition', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ფონის გამეორება</label>
                        <select
                          value={selectedElement.styles.backgroundRepeat || 'no-repeat'}
                          onChange={(e) => updateStyle('backgroundRepeat', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="no-repeat">არ გამეორდეს</option>
                          <option value="repeat">გამეორება</option>
                          <option value="repeat-x">ჰორიზონტალური</option>
                          <option value="repeat-y">ვერტიკალური</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ფონის გამჭვირვალობა</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElement.styles.opacity || 1}
                      onChange={(e) => updateStyle('opacity', e.target.value)}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-600 text-right">{Math.round((selectedElement.styles.opacity || 1) * 100)}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Spacing */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('spacing')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700">დაშორება</span>
                <span className={`transform transition-transform ${expandedSections.spacing ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.spacing && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Padding (შიდა)</label>
                    <input
                      type="text"
                      value={selectedElement.styles.padding || '0'}
                      onChange={(e) => updateStyle('padding', e.target.value)}
                      placeholder="24px or 24px 48px"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Margin (გარე)</label>
                    <input
                      type="text"
                      value={selectedElement.styles.margin || '0'}
                      onChange={(e) => updateStyle('margin', e.target.value)}
                      placeholder="24px or 24px 48px"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Borders */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('borders')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700">საზღვრები</span>
                <span className={`transform transition-transform ${expandedSections.borders ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.borders && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">კუთხის რადიუსი</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={parseInt(selectedElement.styles.borderRadius) || 0}
                      onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-600 text-right">{parseInt(selectedElement.styles.borderRadius) || 0}px</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ჩარჩო</label>
                    <input
                      type="text"
                      value={selectedElement.styles.border || ''}
                      onChange={(e) => updateStyle('border', e.target.value)}
                      placeholder="2px solid #000"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Effects */}
            <div className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleSection('effects')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-700">ეფექტები</span>
                <span className={`transform transition-transform ${expandedSections.effects ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedSections.effects && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ჩრდილი (Box Shadow)</label>
                    <select
                      value={selectedElement.styles.boxShadow || 'none'}
                      onChange={(e) => updateStyle('boxShadow', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="none">არა</option>
                      <option value="0 1px 3px rgba(0,0,0,0.1)">მცირე</option>
                      <option value="0 4px 6px rgba(0,0,0,0.1)">საშუალო</option>
                      <option value="0 10px 15px rgba(0,0,0,0.1)">დიდი</option>
                      <option value="0 20px 25px rgba(0,0,0,0.15)">ძალიან დიდი</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ტრანსფორმაცია</label>
                    <input
                      type="text"
                      value={selectedElement.styles.transform || ''}
                      onChange={(e) => updateStyle('transform', e.target.value)}
                      placeholder="rotate(45deg) or scale(1.1)"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Text/Heading/Button */}
            {['text', 'heading', 'button'].includes(selectedElement.type) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ტექსტი
                </label>
                <textarea
                  value={selectedElement.content.text || ''}
                  onChange={(e) => updateContent('text', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm resize-none"
                />
              </div>
            )}

            {/* Heading Level */}
            {selectedElement.type === 'heading' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">დონე</label>
                <select
                  value={selectedElement.content.level || 'h2'}
                  onChange={(e) => updateContent('level', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                >
                  {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
                    <option key={level} value={level}>{level.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Image */}
            {selectedElement.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">სურათის URL</label>
                  <input
                    type="text"
                    value={selectedElement.content.src || ''}
                    onChange={(e) => updateContent('src', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alt ტექსტი</label>
                  <input
                    type="text"
                    value={selectedElement.content.alt || ''}
                    onChange={(e) => updateContent('alt', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </>
            )}

            {/* Hero Content */}
            {selectedElement.type === 'hero' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">სათაური</label>
                  <input
                    type="text"
                    value={selectedElement.content.title || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ქვესათაური</label>
                  <textarea
                    value={selectedElement.content.subtitle || ''}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ღილაკის ტექსტი</label>
                  <input
                    type="text"
                    value={selectedElement.content.ctaText || ''}
                    onChange={(e) => updateContent('ctaText', e.target.value)}// Continue from previous, complete Content Tab section:

                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Მეორადი ღილაკის ტექსტი</label>
                  <input
                    type="text"
                    value={selectedElement.content.secondaryCtaText || ''}
                    onChange={(e) => updateContent('secondaryCtaText', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    placeholder="არასავალდებულო"
                  />
                </div>
              </>
            )}

            {/* Add more component specific content editors as needed */}
          </div>
        )}
      </div>
    </div>
  )
}

export default BuilderProperties