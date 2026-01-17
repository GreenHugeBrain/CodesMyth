// src/components/Builder/BuilderElement.jsx
import { useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Trash2, Star, Play, Phone, Mail, MapPin, Check, Circle } from 'lucide-react'

const BuilderElement = ({ element, isSelected, onClick, onUpdate, onDelete, snapToGrid = false, gridSize = 10 }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const elementRef = useRef(null)
  const startPos = useRef({ x: 0, y: 0 })
  const startSize = useRef({ width: 0, height: 0 })

  const [{ opacity }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: () => {
      setIsDragging(true)
      return element
    },
    end: () => setIsDragging(false),
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  }), [element])

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return
    
    e.stopPropagation()
    const parentRect = elementRef.current.parentElement.getBoundingClientRect()
    startPos.current = { x: e.clientX - element.x, y: e.clientY - element.y }

    const handleMouseMove = (e) => {
      const parentRect = elementRef.current.parentElement.getBoundingClientRect()
      
      let newX = e.clientX - startPos.current.x
      let newY = e.clientY - startPos.current.y
      
      // Snap to grid
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize
        newY = Math.round(newY / gridSize) * gridSize
      }
      
      newX = Math.max(0, Math.min(newX, parentRect.width - element.width))
      newY = Math.max(0, Math.min(newY, parentRect.height - element.height))
      
      onUpdate({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation()
    setIsResizing(true)
    
    const parentRect = elementRef.current.parentElement.getBoundingClientRect()
    startPos.current = { x: e.clientX, y: e.clientY }
    startSize.current = { width: element.width, height: element.height }

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      let newWidth = startSize.current.width
      let newHeight = startSize.current.height
      let newX = element.x
      let newY = element.y

      if (direction.includes('e')) {
        newWidth = Math.max(50, startSize.current.width + deltaX)
      }
      if (direction.includes('s')) {
        newHeight = Math.max(50, startSize.current.height + deltaY)
      }
      if (direction.includes('w')) {
        const proposedWidth = Math.max(50, startSize.current.width - deltaX)
        const proposedX = element.x + (startSize.current.width - proposedWidth)
        
        if (proposedX >= 0) {
          newWidth = proposedWidth
          newX = proposedX
        }
      }
      if (direction.includes('n')) {
        const proposedHeight = Math.max(50, startSize.current.height - deltaY)
        const proposedY = element.y + (startSize.current.height - proposedHeight)
        
        if (proposedY >= 0) {
          newHeight = proposedHeight
          newY = proposedY
        }
      }

      if (newX + newWidth > parentRect.width) {
        newWidth = parentRect.width - newX
      }

      if (newY + newHeight > parentRect.height) {
        newHeight = parentRect.height - newY
      }

      onUpdate({ 
        width: newWidth, 
        height: newHeight,
        x: newX,
        y: newY 
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const renderContent = () => {
    const content = element.content || {}
    const styles = element.styles || {}

    switch (element.type) {
      case 'text':
        return (
          <div
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: { ...content, text: e.target.innerText } })}
            className="w-full h-full outline-none p-2"
            style={{
              fontSize: styles.fontSize || '16px',
              color: styles.color || '#000',
              fontWeight: styles.fontWeight || 'normal',
              textAlign: styles.textAlign || 'left',
              lineHeight: styles.lineHeight || '1.5'
            }}
          >
            {content.text || 'ტექსტი'}
          </div>
        )
      
      case 'heading':
        const HeadingTag = content.level || 'h2'
        return (
          <HeadingTag
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: { ...content, text: e.target.innerText } })}
            className="w-full h-full outline-none p-2 font-bold"
            style={{
              fontSize: styles.fontSize || '32px',
              color: styles.color || '#000',
              textAlign: styles.textAlign || 'left'
            }}
          >
            {content.text || 'სათაური'}
          </HeadingTag>
        )

      case 'button':
        return (
          <button
            className="w-full h-full outline-none"
            style={{
              backgroundColor: styles.backgroundColor || '#3B82F6',
              color: styles.color || '#fff',
              borderRadius: styles.borderRadius || '8px',
              fontSize: styles.fontSize || '16px',
              fontWeight: styles.fontWeight || '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {content.text || 'ღილაკი'}
          </button>
        )

      case 'image':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden" style={{ borderRadius: styles.borderRadius || '8px' }}>
            {content.src ? (
              <img src={content.src} alt={content.alt} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🖼️</span>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center overflow-hidden" style={{ borderRadius: styles.borderRadius || '8px' }}>
            {content.url ? (
              <iframe 
                src={content.url} 
                className="w-full h-full" 
                allowFullScreen
              />
            ) : (
              <Play size={48} className="text-white" />
            )}
          </div>
        )

      case 'icon':
        const iconSize = content.size || 48
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ color: styles.color || '#3B82F6' }}>
            {content.iconType === 'star' && <Star size={iconSize} fill="currentColor" />}
            {content.iconType === 'phone' && <Phone size={iconSize} />}
            {content.iconType === 'mail' && <Mail size={iconSize} />}
            {content.iconType === 'map' && <MapPin size={iconSize} />}
          </div>
        )

      case 'divider':
        return <div className="w-full h-full" style={{ backgroundColor: styles.backgroundColor || '#e5e7eb' }} />

      case 'container':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '12px',
              border: styles.border || '1px solid #e5e7eb',
              padding: styles.padding || '24px',
              boxShadow: styles.boxShadow || '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div className="text-center text-gray-400 text-sm">კონტეინერი</div>
          </div>
        )

      case 'section':
        return (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: styles.backgroundColor || '#f9fafb',
              padding: styles.padding || '48px 24px'
            }}
          >
            <div className="text-center text-gray-400">სექცია</div>
          </div>
        )

      case 'header':
        return (
          <div
            className="w-full h-full flex items-center justify-between px-8"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderBottom: styles.borderBottom || '1px solid #e5e7eb',
              boxShadow: styles.boxShadow || '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div className="font-bold text-xl" style={{ color: styles.color || '#000' }}>
              {content.logo || 'ლოგო'}
            </div>
            <div className="flex gap-6">
              {(content.menuItems || ['მთავარი', 'შესახებ', 'კონტაქტი']).map((item, i) => (
                <a key={i} href="#" className="hover:text-primary-600 transition" style={{ color: styles.color || '#000' }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        )

      case 'footer':
        return (
          <div
            className="w-full h-full p-8"
            style={{
              backgroundColor: styles.backgroundColor || '#1f2937',
              color: styles.color || '#ffffff'
            }}
          >
            <div className="grid grid-cols-3 gap-8 mb-6">
              {(content.columns || []).map((col, i) => (
                <div key={i}>
                  <h4 className="font-bold mb-3">{col.title}</h4>
                  <ul className="space-y-2 text-sm opacity-80">
                    {col.links.map((link, j) => (
                      <li key={j}><a href="#" className="hover:underline">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-gray-600 flex justify-between items-center">
              <div className="text-sm opacity-60">
                {content.copyright || '© 2024 ყველა უფლება დაცულია'}
              </div>
              {content.socials && (
                <div className="flex gap-4 text-sm">
                  {content.socials.map((social, i) => (
                    <a key={i} href={social.url} className="hover:underline">{social.name}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 'navbar':
        return (
          <div
            className="w-full h-full flex items-center justify-between px-8"
            style={{
              backgroundColor: styles.backgroundColor || '#3B82F6',
              color: styles.color || '#ffffff'
            }}
          >
            <div className="font-bold text-xl">{content.brand || 'ბრენდი'}</div>
            <div className="flex gap-6 items-center">
              {(content.items || ['მთავარი', 'პროდუქტები']).map((item, i) => (
                <a key={i} href="#" className="hover:opacity-80 transition">
                  {item}
                </a>
              ))}
              <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                {content.ctaText || 'დაიწყე'}
              </button>
            </div>
          </div>
        )

      case 'hero':
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center p-12"
            style={{
              backgroundColor: styles.backgroundColor || '#f3f4f6',
              color: styles.color || '#000'
            }}
          >
            <h1 className="text-5xl font-bold mb-4">
              {content.title || 'შენი შესანიშნავი სათაური'}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {content.subtitle || 'აღწერე რას აკეთებს შენი პროდუქტი'}
            </p>
            <div className="flex gap-4">
              <button className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition">
                {content.ctaText || 'დაიწყე ახლავე'}
              </button>
              {content.secondaryCtaText && (
                <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition border-2 border-gray-300">
                  {content.secondaryCtaText}
                </button>
              )}
            </div>
          </div>
        )

      case 'card':
        return (
          <div
            className="w-full h-full flex flex-col overflow-hidden"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '12px',
              boxShadow: styles.boxShadow || '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center text-4xl relative">
              {content.image ? (
                <img src={content.image} alt="" className="w-full h-full object-cover" />
              ) : (
                '🖼️'
              )}
              {content.badge && (
                <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {content.badge}
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              {content.price && (
                <div className="text-2xl font-bold text-primary-600 mb-2">{content.price}</div>
              )}
              <h3 className="text-xl font-bold mb-2">{content.title || 'ბარათის სათაური'}</h3>
              <p className="text-gray-600 mb-4 flex-1 text-sm">{content.description || 'აღწერა აქ...'}</p>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition w-full">
                {content.buttonText || 'გაიგე მეტი'}
              </button>
            </div>
          </div>
        )

      case 'grid':
        const columns = content.columns || 3
        return (
          <div
            className="w-full h-full overflow-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${content.gap || 20}px`,
              padding: '24px'
            }}
          >
            {(content.items || []).map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                {item.icon && <div className="text-4xl mb-3">{item.icon}</div>}
                <h4 className="font-bold mb-2 text-lg">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        )

      case 'testimonial':
        return (
          <div
            className="w-full h-full p-8 flex flex-col justify-center"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '12px',
              boxShadow: styles.boxShadow || '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex mb-4">
              {[...Array(content.rating || 5)].map((_, i) => (
                <Star key={i} size={20} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <p className="text-lg italic mb-6 text-gray-700">"{content.quote}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                {content.avatar ? <img src={content.avatar} className="w-full h-full rounded-full object-cover" /> : '👤'}
              </div>
              <div>
                <div className="font-bold">{content.author}</div>
                <div className="text-sm text-gray-600">{content.role}</div>
              </div>
            </div>
          </div>
        )

      case 'pricing':
        return (
          <div
            className="w-full h-full p-8 flex flex-col"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '12px',
              boxShadow: styles.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
              border: content.popular ? '2px solid #3B82F6' : styles.border || '2px solid transparent'
            }}
          >
            {content.popular && (
              <div className="bg-primary-600 text-white text-center py-2 -mx-8 -mt-8 mb-6 rounded-t-xl font-semibold">
                პოპულარული
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4 text-center">{content.title}</h3>
            <div className="text-center mb-6">
              <span className="text-5xl font-bold">{content.price}</span>
              <span className="text-2xl">{content.currency || '₾'}</span>
              <span className="text-gray-600">{content.period || '/თვე'}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {(content.features || []).map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={20} className="text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition w-full">
              {content.buttonText || 'აირჩიე გეგმა'}
            </button>
          </div>
        )

      case 'team':
        return (
          <div
            className="w-full h-full overflow-hidden"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '12px',
              boxShadow: styles.boxShadow || '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="h-64 bg-gray-200 flex items-center justify-center text-6xl">
              {content.image ? (
                <img src={content.image} className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{content.name}</h3>
              <p className="text-primary-600 font-medium mb-3">{content.role}</p>
              <p className="text-sm text-gray-600 mb-4">{content.bio}</p>
              {content.social && (
                <div className="flex gap-3">
                  {content.social.linkedin && <a href={content.social.linkedin} className="text-gray-600 hover:text-primary-600">LinkedIn</a>}
                  {content.social.twitter && <a href={content.social.twitter} className="text-gray-600 hover:text-primary-600">Twitter</a>}
                  {content.social.email && <a href={`mailto:${content.social.email}`} className="text-gray-600 hover:text-primary-600">Email</a>}
                </div>
              )}
            </div>
          </div>
        )

      case 'cta':
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center p-12"
            style={{
              backgroundColor: styles.backgroundColor || '#3B82F6',
              color: styles.color || '#ffffff',
              borderRadius: styles.borderRadius || '16px'
            }}
          >
            <h2 className="text-4xl font-bold mb-4">{content.title || 'მზად ხარ დაიწყო?'}</h2>
            <p className="text-xl mb-8 opacity-90">{content.subtitle}</p>
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
              {content.buttonText || 'დაიწყე უფასოდ'}
            </button>
            {content.secondaryText && (
              <p className="text-sm mt-4 opacity-75">{content.secondaryText}</p>
            )}
          </div>
        )

      case 'contact':
        return (
          <div
            className="w-full h-full p-8"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '12px',
              boxShadow: styles.boxShadow || '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h3 className="text-2xl font-bold mb-6">{content.title || 'დაგვიკავშირდით'}</h3>
            <div className="space-y-4">
              {(content.items || []).map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.icon === 'phone' && <Phone size={20} className="text-primary-600" />}
                    {item.icon === 'mail' && <Mail size={20} className="text-primary-600" />}
                    {item.icon === 'map' && <MapPin size={20} className="text-primary-600" />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.label}</div>
                    <div className="text-gray-600">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'stats':
        return (
          <div
            className="w-full h-full p-8"
            style={{
              backgroundColor: styles.backgroundColor || '#f9fafb'
            }}
          >
            <div className="grid grid-cols-4 gap-8 h-full">
              {(content.items || []).map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-bold text-primary-600 mb-2">{item.number}</div>
                  <div className="text-gray-600 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'features':
        return (
          <div
            className="w-full h-full p-8"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff'
            }}
          >
            {content.title && <h2 className="text-3xl font-bold text-center mb-3">{content.title}</h2>}
            {content.subtitle && <p className="text-gray-600 text-center mb-8">{content.subtitle}</p>}
            <div className="grid grid-cols-3 gap-8">
              {(content.items || []).map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'list':
        return (
          <div
            className="w-full h-full p-6"
            style={{
              backgroundColor: styles.backgroundColor || '#ffffff',
              borderRadius: styles.borderRadius || '8px'
            }}
          >
            {content.title && <h3 className="font-bold text-xl mb-4">{content.title}</h3>}
            <ul className="space-y-2">
              {(content.items || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {content.style === 'bullet' && <span className="text-primary-600 mt-1">•</span>}
                  {content.style === 'number' && <span className="text-primary-600 font-semibold">{i + 1}.</span>}
                  {content.style === 'check' && <Check size={20} className="text-green-500 mt-0.5" />}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )

      default:
        return <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">{element.type}</div>
    }
  }

  return (
    <div
      ref={(node) => {
        elementRef.current = node
        drag(node)
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 1000 : element.zIndex || 1
      }}
      className={`
        ${isSelected ? 'ring-2 ring-primary-500' : ''}
        ${isDragging ? 'shadow-2xl' : ''}
        transition-shadow
      `}
    >
      {renderContent()}

      {isSelected && (
        <>
          <div className="absolute -top-10 left-0 bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-2 shadow-lg z-50">
            <span>{element.type}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 hover:bg-primary-700 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(direction => (
            <div
              key={direction}
              className={`resize-handle absolute w-3 h-3 bg-white border-2 border-primary-500 rounded-full cursor-${direction}-resize z-50`}
              onMouseDown={(e) => handleResizeMouseDown(e, direction)}
              style={{
                ...(direction.includes('n') && { top: -6 }),
                ...(direction.includes('s') && { bottom: -6 }),
                ...(direction.includes('w') && { left: -6 }),
                ...(direction.includes('e') && { right: -6 }),
                ...(direction === 'n' || direction === 's') && { left: '50%', transform: 'translateX(-50%)' },
                ...(direction === 'w' || direction === 'e') && { top: '50%', transform: 'translateY(-50%)' }
              }}
            />
          ))}

          <div className="absolute -bottom-6 right-0 bg-gray-800 text-white px-2 py-1 rounded text-xs z-50">
            {Math.round(element.width)} × {Math.round(element.height)}
          </div>
        </>
      )}
    </div>
  )
}

export default BuilderElement 