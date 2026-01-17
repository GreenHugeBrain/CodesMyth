// src/components/Builder/BuilderCanvas.jsx
import { useState, useRef, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import BuilderElement from './BuilderElement'
import { 
  Trash2, Eye, Code, Save, ZoomIn, ZoomOut, Maximize2,
  Undo, Redo, Copy, Grid, AlignCenter, AlignLeft, AlignRight,
  MoveUp, MoveDown, Lock, Unlock
} from 'lucide-react'

const BuilderCanvas = ({ 
  elements, 
  setElements, 
  selectedElement, 
  setSelectedElement,
  activePage,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const canvasRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 1440, height: 2000 })
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [contextMenu, setContextMenu] = useState(null)
  const [multiSelect, setMultiSelect] = useState([])
  const [clipboard, setClipboard] = useState(null)
  const [isResizingCanvas, setIsResizingCanvas] = useState(false)
  const gridSize = 10

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasRect = canvasRef.current.getBoundingClientRect()
      
      if (!offset) return

      let x = (offset.x - canvasRect.left) / scale
      let y = (offset.y - canvasRect.top) / scale
      
      let width = item.defaultWidth || 200
      let height = item.defaultHeight || 100

      // Smart positioning - auto-fit full width components
      if (item.componentType === 'header' || 
          item.componentType === 'navbar' || 
          item.componentType === 'footer' ||
          item.componentType === 'hero' ||
          item.componentType === 'section') {
        width = canvasSize.width
        x = 0
        
        // Auto-position at top/bottom
        if (item.componentType === 'header' || item.componentType === 'navbar') {
          y = 0
        } else if (item.componentType === 'footer') {
          y = canvasSize.height - height
        }
      } else {
        // Snap to grid
        if (snapToGrid) {
          x = Math.round(x / gridSize) * gridSize
          y = Math.round(y / gridSize) * gridSize
        }
      }

      // Boundaries
      x = Math.max(0, Math.min(x, canvasSize.width - width))
      y = Math.max(0, Math.min(y, canvasSize.height - height))

      const newElement = {
        id: `element-${Date.now()}`,
        type: item.componentType,
        x,
        y,
        width,
        height,
        styles: JSON.parse(JSON.stringify(item.defaultStyles || {})),
        content: JSON.parse(JSON.stringify(item.defaultContent || {})),
        pageId: activePage,
        locked: false
      }

      setElements(prev => [...prev, newElement])
      setSelectedElement(newElement)
      
      // Success feedback
      showToast('✅ კომპონენტი დამატებულია!', 'success')
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [scale, activePage, canvasSize, snapToGrid])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        onUndo?.()
      }
      
      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z - Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        onRedo?.()
      }
      
      // Ctrl/Cmd + D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        handleDuplicate()
      }
      
      // Ctrl/Cmd + C - Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
        e.preventDefault()
        handleCopy()
      }
      
      // Ctrl/Cmd + V - Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
        e.preventDefault()
        handlePaste()
      }
      
      // Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !selectedElement.locked) {
        e.preventDefault()
        handleDeleteElement(selectedElement.id)
      }
      
      // Arrow keys - move element
      if (selectedElement && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        let newX = selectedElement.x
        let newY = selectedElement.y
        
        if (e.key === 'ArrowLeft') newX -= step
        if (e.key === 'ArrowRight') newX += step
        if (e.key === 'ArrowUp') newY -= step
        if (e.key === 'ArrowDown') newY += step
        
        handleElementUpdate(selectedElement.id, { x: newX, y: newY })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElement, clipboard, onUndo, onRedo])

  const handleElementClick = (element, e) => {
    e.stopPropagation()
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      setMultiSelect(prev => 
        prev.includes(element.id) 
          ? prev.filter(id => id !== element.id)
          : [...prev, element.id]
      )
    } else {
      setSelectedElement(element)
      setMultiSelect([])
    }
  }

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.closest('.canvas-background')) {
      setSelectedElement(null)
      setMultiSelect([])
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    if (selectedElement) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  const handleElementUpdate = (id, updates) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates })
    }
  }

  const handleDeleteElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
    showToast('🗑️ კომპონენტი წაიშალა', 'info')
  }

  const handleDuplicate = () => {
    if (!selectedElement) return
    
    const newElement = {
      ...selectedElement,
      id: `element-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      content: JSON.parse(JSON.stringify(selectedElement.content)),
      styles: JSON.parse(JSON.stringify(selectedElement.styles))
    }
    
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement)
    showToast('📋 კომპონენტი გაკოპირდა!', 'success')
  }

  const handleCopy = () => {
    if (!selectedElement) return
    setClipboard(selectedElement)
    showToast('📋 კოპირება...', 'info')
  }

  const handlePaste = () => {
    if (!clipboard) return
    
    const newElement = {
      ...clipboard,
      id: `element-${Date.now()}`,
      x: clipboard.x + 20,
      y: clipboard.y + 20,
      content: JSON.parse(JSON.stringify(clipboard.content)),
      styles: JSON.parse(JSON.stringify(clipboard.styles)),
      pageId: activePage
    }
    
    setElements(prev => [...prev, newElement])
    setSelectedElement(newElement)
    showToast('✅ ჩასმა წარმატებული!', 'success')
  }

  const handleAlign = (alignment) => {
    if (!selectedElement) return
    
    const updates = {}
    switch (alignment) {
      case 'left':
        updates.x = 0
        break
      case 'center':
        updates.x = (canvasSize.width - selectedElement.width) / 2
        break
      case 'right':
        updates.x = canvasSize.width - selectedElement.width
        break
      case 'top':
        updates.y = 0
        break
      case 'middle':
        updates.y = (canvasSize.height - selectedElement.height) / 2
        break
      case 'bottom':
        updates.y = canvasSize.height - selectedElement.height
        break
    }
    
    handleElementUpdate(selectedElement.id, updates)
    showToast(`📐 განლაგება ${alignment}`, 'success')
  }

  const handleLayerChange = (direction) => {
    if (!selectedElement) return
    
    const currentIndex = elements.findIndex(el => el.id === selectedElement.id)
    if (currentIndex === -1) return
    
    const newElements = [...elements]
    const targetIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1
    
    if (targetIndex >= 0 && targetIndex < newElements.length) {
      [newElements[currentIndex], newElements[targetIndex]] = [newElements[targetIndex], newElements[currentIndex]]
      setElements(newElements)
      showToast(`📚 Layer ${direction === 'up' ? 'ზემოთ' : 'ქვემოთ'}`, 'success')
    }
  }

  const handleToggleLock = () => {
    if (!selectedElement) return
    
    handleElementUpdate(selectedElement.id, { locked: !selectedElement.locked })
    showToast(selectedElement.locked ? '🔓 განბლოკილი' : '🔒 დაბლოკილი', 'info')
  }

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div')
    toast.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white font-semibold`
    toast.innerHTML = message
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  const pageElements = elements.filter(el => el.pageId === activePage)

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto relative">
      {/* Enhanced Floating Toolbar */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 border border-gray-200">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 pr-3 border-r border-gray-300">
          <button
            onClick={() => setScale(Math.max(0.25, scale - 0.25))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span className="font-semibold w-16 text-center text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(2, scale + 0.25))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
        </div>
        
        {/* Canvas Size */}
        <select
          value={`${canvasSize.width}x${canvasSize.height}`}
          onChange={(e) => {
            const [width, height] = e.target.value.split('x').map(Number)
            setCanvasSize({ width, height })
          }}
          className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm font-medium border border-gray-200 hover:border-primary-300 transition cursor-pointer"
        >
          <option value="1440x2000">🖥️ Desktop (Full)</option>
          <option value="1440x1024">🖥️ Desktop (Short)</option>
          <option value="1024x768">💻 Laptop</option>
          <option value="768x1024">📱 Tablet</option>
          <option value="375x812">📱 Mobile</option>
        </select>
        
        {/* Canvas Height Control */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-300">
          <label className="text-xs text-gray-600">Height:</label>
          <input
            type="number"
            value={canvasSize.height}
            onChange={(e) => setCanvasSize(prev => ({ ...prev, height: Number(e.target.value) }))}
            min="500"
            max="20000"
            step="100"
            className="w-20 px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded"
          />
          <span className="text-xs text-gray-600">px</span>
        </div>

        {/* Grid Controls */}
        <div className="flex gap-1 pl-3 border-l border-gray-300">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition ${showGrid ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
            title="Toggle Grid"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 rounded-lg transition ${snapToGrid ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
            title="Snap to Grid"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Alignment */}
        {selectedElement && (
          <div className="flex gap-1 pl-3 border-l border-gray-300">
            <button onClick={() => handleAlign('left')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Align Left">
              <AlignLeft size={18} />
            </button>
            <button onClick={() => handleAlign('center')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Align Center">
              <AlignCenter size={18} />
            </button>
            <button onClick={() => handleAlign('right')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Align Right">
              <AlignRight size={18} />
            </button>
          </div>
        )}

        {/* Layer Controls */}
        {selectedElement && (
          <div className="flex gap-1 pl-3 border-l border-gray-300">
            <button onClick={() => handleLayerChange('up')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Bring Forward">
              <MoveUp size={18} />
            </button>
            <button onClick={() => handleLayerChange('down')} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Send Backward">
              <MoveDown size={18} />
            </button>
            <button onClick={handleToggleLock} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Lock/Unlock">
              {selectedElement.locked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 text-xs text-gray-600 z-20">
        {pageElements.length} კომპონენტი • {selectedElement ? 'არჩეული' : 'არჩეული არა'}
      </div>

      {/* Canvas Container */}
      <div className="flex items-start justify-center min-h-full p-16 pt-32">
        <div className="relative">
          <div
            ref={(node) => {
              canvasRef.current = node
              drop(node)
            }}
            onClick={handleCanvasClick}
            onContextMenu={handleContextMenu}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease'
            }}
            className={`
              bg-white shadow-2xl relative overflow-visible
              ${isOver ? 'ring-4 ring-primary-400 ring-offset-4' : ''}
            `}
          >
            {/* Smart Grid */}
            {showGrid && (
              <div 
                className="canvas-background absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(59,130,246,0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(59,130,246,0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize}px ${gridSize}px`
                }}
              />
            )}

            {/* Drop Zone Indicator */}
            {isOver && (
              <div className="absolute inset-0 bg-primary-50 flex items-center justify-center animate-pulse pointer-events-none z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-dashed border-primary-400">
                  <div className="text-6xl mb-4 animate-bounce">🎨</div>
                  <p className="text-2xl font-bold text-primary-600">ჩააგდე აქ!</p>
                </div>
              </div>
            )}

            {/* Render Elements */}
            {pageElements.map(element => (
              <BuilderElement
                key={element.id}
                element={element}
                isSelected={selectedElement?.id === element.id}
                onClick={(e) => handleElementClick(element, e)}
                onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                onDelete={() => handleDeleteElement(element.id)}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
                canvasWidth={canvasSize.width}
              />
            ))}

            {/* Empty State */}
            {pageElements.length === 0 && !isOver && (
              <div className="canvas-background absolute inset-0 flex items-center justify-center">
                <div className="text-center animate-fade-in">
                  <div className="text-8xl mb-6 animate-float">🎨</div>
                  <h3 className="text-3xl font-bold text-gray-400 mb-3">
                    დაიწყე აქედან!
                  </h3>
                  <p className="text-lg text-gray-400 mb-6">
                    გადმოათრიე კომპონენტები ან დააწკაპუნე მათ<br/>
                    canvas-ზე დასამატებლად
                  </p>
                  
                  {/* Quick Start Cards */}
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-200">
                      <div className="text-2xl mb-2">👈</div>
                      <p className="text-sm text-gray-600 font-medium">გადმოათრიე<br/>მარცხნიდან</p>
                    </div>
                    <div className="text-gray-400 text-2xl">ან</div>
                    <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-200">
                      <div className="text-2xl mb-2">👆</div>
                      <p className="text-sm text-gray-600 font-medium">დააკლიკე<br/>კომპონენტს</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Canvas Height Resize Handle */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center cursor-ns-resize bg-gradient-to-t from-gray-200 to-transparent hover:from-primary-200 transition group"
            onMouseDown={(e) => {
              setIsResizingCanvas(true)
              const startY = e.clientY
              const startHeight = canvasSize.height
              
              const handleMouseMove = (e) => {
                const deltaY = (e.clientY - startY) / scale
                const newHeight = Math.max(500, Math.min(20000, startHeight + deltaY))
                setCanvasSize(prev => ({ ...prev, height: Math.round(newHeight) }))
              }
              
              const handleMouseUp = () => {
                setIsResizingCanvas(false)
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            <div className="w-16 h-1 bg-gray-400 rounded-full group-hover:bg-primary-500 transition" />
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50 min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button onClick={() => { handleCopy(); setContextMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            <Copy size={16} /> კოპირება
          </button>
          <button onClick={() => { handleDuplicate(); setContextMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            <Copy size={16} /> დუბლირება
          </button>
          <button onClick={() => { handleToggleLock(); setContextMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
            {selectedElement?.locked ? <Unlock size={16} /> : <Lock size={16} />} {selectedElement?.locked ? 'განბლოკვა' : 'დაბლოკვა'}
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button onClick={() => { handleDeleteElement(selectedElement.id); setContextMenu(null); }} className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2">
            <Trash2 size={16} /> წაშლა
          </button>
        </div>
      )}
    </div>
  )
}

export default BuilderCanvas