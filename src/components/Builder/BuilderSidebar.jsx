// src/components/Builder/BuilderSidebar.jsx
import { useDrag } from 'react-dnd'
import { 
  Type, 
  Heading1, 
  Square, 
  Image as ImageIcon, 
  MousePointer, 
  Layout,
  List,
  Table,
  Video,
  Code,
  Mail,
  Menu,
  Star,
  MessageCircle,
  Users,
  ShoppingCart,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Play,
  Award,
  CheckCircle,
  BarChart,
  Plus
} from 'lucide-react'

const DraggableComponent = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: component,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [component])

  return (
    <div
      ref={drag}
      className={`
        relative p-4 bg-white rounded-xl border-2 
        cursor-grab active:cursor-grabbing
        hover:border-primary-400 hover:shadow-xl hover:scale-105
        transition-all duration-200
        ${isDragging ? 'opacity-30 scale-90 rotate-3' : 'opacity-100'}
      `}
    >
      {/* Drag indicator */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-primary-600 rounded-full"></div>
        <div className="w-1 h-1 bg-primary-600 rounded-full ml-0.5"></div>
        <div className="w-1 h-1 bg-primary-600 rounded-full ml-0.5"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className={`text-gray-600 transition-transform ${isDragging ? '' : 'group-hover:scale-110'}`}>
          {component.icon}
        </div>
        <span className="text-sm font-semibold text-gray-700 text-center">{component.label}</span>
      </div>

      {/* Hover tooltip */}
      {!isDragging && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
            გადმოათრიე canvas-ზე
          </div>
        </div>
      )}
    </div>
  )
}

const BuilderSidebar = ({ onQuickAdd }) => {
  const components = [
    // Basic Elements
    {
      id: 'text',
      label: 'ტექსტი',
      icon: <Type size={24} />,
      componentType: 'text',
      defaultWidth: 300,
      defaultHeight: 60,
      defaultContent: { text: 'ტექსტი აქ...' },
      defaultStyles: { fontSize: '16px', color: '#000', lineHeight: '1.5' }
    },
    {
      id: 'heading',
      label: 'სათაური',
      icon: <Heading1 size={24} />,
      componentType: 'heading',
      defaultWidth: 400,
      defaultHeight: 80,
      defaultContent: { text: 'სათაური', level: 'h2' },
      defaultStyles: { fontSize: '32px', color: '#000', fontWeight: 'bold' }
    },
    {
      id: 'button',
      label: 'ღილაკი',
      icon: <MousePointer size={24} />,
      componentType: 'button',
      defaultWidth: 150,
      defaultHeight: 50,
      defaultContent: { text: 'ღილაკი', link: '#' },
      defaultStyles: { 
        backgroundColor: '#3B82F6', 
        color: '#fff',
        borderRadius: '8px',
        fontWeight: '600'
      }
    },
    {
      id: 'image',
      label: 'სურათი',
      icon: <ImageIcon size={24} />,
      componentType: 'image',
      defaultWidth: 300,
      defaultHeight: 200,
      defaultContent: { src: '', alt: 'სურათი' },
      defaultStyles: { borderRadius: '8px' }
    },
    {
      id: 'video',
      label: 'ვიდეო',
      icon: <Video size={24} />,
      componentType: 'video',
      defaultWidth: 560,
      defaultHeight: 315,
      defaultContent: { url: '', autoplay: false },
      defaultStyles: { borderRadius: '8px' }
    },
    {
      id: 'icon',
      label: 'აიქონი',
      icon: <Star size={24} />,
      componentType: 'icon',
      defaultWidth: 80,
      defaultHeight: 80,
      defaultContent: { iconType: 'star', size: 48 },
      defaultStyles: { color: '#3B82F6' }
    },
    
    // Layout Components
    {
      id: 'container',
      label: 'კონტეინერი',
      icon: <Square size={24} />,
      componentType: 'container',
      defaultWidth: 600,
      defaultHeight: 300,
      defaultContent: {},
      defaultStyles: { 
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'section',
      label: 'სექცია',
      icon: <Layout size={24} />,
      componentType: 'section',
      defaultWidth: 1200,
      defaultHeight: 500,
      defaultContent: {},
      defaultStyles: { 
        backgroundColor: '#f9fafb',
        padding: '48px 24px'
      }
    },
    {
      id: 'divider',
      label: 'გამყოფი',
      icon: <Layout size={24} />,
      componentType: 'divider',
      defaultWidth: 800,
      defaultHeight: 2,
      defaultContent: {},
      defaultStyles: { 
        backgroundColor: '#e5e7eb',
        margin: '32px 0'
      }
    },
    
    // Pre-built Components
    {
      id: 'header',
      label: 'ჰედერი',
      icon: <Layout size={24} />,
      componentType: 'header',
      defaultWidth: 1200,
      defaultHeight: 80,
      defaultContent: { 
        logo: 'ლოგო',
        menuItems: ['მთავარი', 'ჩვენ შესახებ', 'სერვისები', 'კონტაქტი']
      },
      defaultStyles: { 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'footer',
      label: 'ფუტერი',
      icon: <Layout size={24} />,
      componentType: 'footer',
      defaultWidth: 1200,
      defaultHeight: 300,
      defaultContent: { 
        copyright: '© 2024 ყველა უფლება დაცულია',
        columns: [
          { title: 'კომპანია', links: ['ჩვენ შესახებ', 'კარიერა', 'კონტაქტი'] },
          { title: 'სერვისები', links: ['პროდუქტები', 'ფასები', 'მხარდაჭერა'] },
          { title: 'რესურსები', links: ['ბლოგი', 'დოკუმენტაცია', 'FAQ'] }
        ],
        socials: [
          { name: 'Facebook', url: '#' },
          { name: 'Twitter', url: '#' },
          { name: 'LinkedIn', url: '#' }
        ]
      },
      defaultStyles: { 
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px'
      }
    },
    {
      id: 'navbar',
      label: 'ნავბარი',
      icon: <Menu size={24} />,
      componentType: 'navbar',
      defaultWidth: 1200,
      defaultHeight: 70,
      defaultContent: { 
        brand: 'ბრენდი',
        items: ['მთავარი', 'პროდუქტები', 'ბლოგი', 'კონტაქტი'],
        ctaText: 'დაიწყე'
      },
      defaultStyles: { 
        backgroundColor: '#3B82F6',
        color: '#ffffff',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    {
      id: 'hero',
      label: 'ჰეროუ',
      icon: <Layout size={24} />,
      componentType: 'hero',
      defaultWidth: 1200,
      defaultHeight: 500,
      defaultContent: { 
        title: 'შენი შესანიშნავი სათაური',
        subtitle: 'აღწერე რას აკეთებს შენი პროდუქტი და რატომ უნდა აირჩიონ შენი სერვისი',
        ctaText: 'დაიწყე ახლავე',
        secondaryCtaText: 'გაიგე მეტი',
        imageUrl: ''
      },
      defaultStyles: { 
        backgroundColor: '#f3f4f6',
        padding: '80px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }
    },
    {
      id: 'card',
      label: 'ბარათი',
      icon: <Square size={24} />,
      componentType: 'card',
      defaultWidth: 350,
      defaultHeight: 450,
      defaultContent: { 
        image: '',
        title: 'ბარათის სათაური',
        description: 'ბარათის აღწერა რომელიც შეიძლება იყოს რამდენიმე ხაზი და დეტალური ინფორმაცია',
        buttonText: 'გაიგე მეტი',
        badge: '',
        price: ''
      },
      defaultStyles: { 
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }
    },
    {
      id: 'grid',
      label: 'გრიდი',
      icon: <Table size={24} />,
      componentType: 'grid',
      defaultWidth: 1000,
      defaultHeight: 400,
      defaultContent: { 
        columns: 3,
        gap: 20,
        items: [
          { title: 'Item 1', text: 'Description 1', icon: '🚀' },
          { title: 'Item 2', text: 'Description 2', icon: '⚡' },
          { title: 'Item 3', text: 'Description 3', icon: '🎯' },
          { title: 'Item 4', text: 'Description 4', icon: '💎' },
          { title: 'Item 5', text: 'Description 5', icon: '🔥' },
          { title: 'Item 6', text: 'Description 6', icon: '✨' }
        ]
      },
      defaultStyles: { 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        padding: '24px'
      }
    },
    
    // Feature Components
    {
      id: 'testimonial',
      label: 'მიმოხილვა',
      icon: <MessageCircle size={24} />,
      componentType: 'testimonial',
      defaultWidth: 600,
      defaultHeight: 250,
      defaultContent: {
        quote: 'ეს პროდუქტი შეცვალა ჩემი ბიზნესი! შესანიშნავი სერვისი და მხარდაჭერა.',
        author: 'გიორგი გიორგაძე',
        role: 'CEO, კომპანია',
        avatar: '',
        rating: 5
      },
      defaultStyles: {
        backgroundColor: '#ffffff',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'pricing',
      label: 'ფასი',
      icon: <ShoppingCart size={24} />,
      componentType: 'pricing',
      defaultWidth: 350,
      defaultHeight: 500,
      defaultContent: {
        title: 'პროფესიონალი',
        price: '99',
        currency: '₾',
        period: '/თვე',
        features: [
          'უფასო დომენი',
          'უსაზღვრო bandwidth',
          '24/7 მხარდაჭერა',
          'SSL სერთიფიკატი',
          'დღიური backup'
        ],
        buttonText: 'აირჩიე გეგმა',
        popular: false
      },
      defaultStyles: {
        backgroundColor: '#ffffff',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '2px solid transparent'
      }
    },
    {
      id: 'team',
      label: 'გუნდი',
      icon: <Users size={24} />,
      componentType: 'team',
      defaultWidth: 300,
      defaultHeight: 400,
      defaultContent: {
        image: '',
        name: 'გიორგი გელაშვილი',
        role: 'CEO & Founder',
        bio: 'პროფესიონალი 10+ წლიანი გამოცდილებით',
        social: {
          linkedin: '#',
          twitter: '#',
          email: 'email@example.com'
        }
      },
      defaultStyles: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'cta',
      label: 'CTA სექცია',
      icon: <Award size={24} />,
      componentType: 'cta',
      defaultWidth: 1000,
      defaultHeight: 300,
      defaultContent: {
        title: 'მზად ხარ დაიწყო?',
        subtitle: 'შემოგვიერთდი ათასობით კმაყოფილ მომხმარებელს',
        buttonText: 'დაიწყე უფასოდ',
        secondaryText: 'არ არის საჭირო საკრედიტო ბარათი'
      },
      defaultStyles: {
        backgroundColor: '#3B82F6',
        color: '#ffffff',
        padding: '64px 48px',
        borderRadius: '16px',
        textAlign: 'center'
      }
    },
    {
      id: 'contact',
      label: 'კონტაქტი',
      icon: <Phone size={24} />,
      componentType: 'contact',
      defaultWidth: 500,
      defaultHeight: 400,
      defaultContent: {
        title: 'დაგვიკავშირდით',
        items: [
          { icon: 'phone', label: 'ტელეფონი', value: '+995 555 123 456' },
          { icon: 'mail', label: 'ელ-ფოსტა', value: 'info@example.com' },
          { icon: 'map', label: 'მისამართი', value: 'თბილისი, საქართველო' }
        ]
      },
      defaultStyles: {
        backgroundColor: '#ffffff',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'stats',
      label: 'სტატისტიკა',
      icon: <BarChart size={24} />,
      componentType: 'stats',
      defaultWidth: 1000,
      defaultHeight: 200,
      defaultContent: {
        items: [
          { number: '10K+', label: 'მომხმარებელი' },
          { number: '500+', label: 'პროექტი' },
          { number: '99%', label: 'კმაყოფილება' },
          { number: '24/7', label: 'მხარდაჭერა' }
        ]
      },
      defaultStyles: {
        backgroundColor: '#f9fafb',
        padding: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px'
      }
    },
    {
      id: 'features',
      label: 'ფუნქციები',
      icon: <CheckCircle size={24} />,
      componentType: 'features',
      defaultWidth: 1000,
      defaultHeight: 400,
      defaultContent: {
        title: 'ძირითადი ფუნქციები',
        subtitle: 'ყველაფერი რაც გჭირდება წარმატებისთვის',
        items: [
          { icon: '⚡', title: 'სწრაფი', description: 'მაქსიმალური სიჩქარე' },
          { icon: '🔒', title: 'უსაფრთხო', description: 'დაცული მონაცემები' },
          { icon: '📱', title: 'რესპონსიული', description: 'ყველა მოწყობილობაზე' }
        ]
      },
      defaultStyles: {
        padding: '48px',
        backgroundColor: '#ffffff'
      }
    },
    {
      id: 'list',
      label: 'სია',
      icon: <List size={24} />,
      componentType: 'list',
      defaultWidth: 400,
      defaultHeight: 300,
      defaultContent: {
        title: 'სია',
        items: [
          'პირველი პუნქტი',
          'მეორე პუნქტი',
          'მესამე პუნქტი',
          'მეოთხე პუნქტი'
        ],
        style: 'bullet' // bullet, number, check
      },
      defaultStyles: {
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '8px'
      }
    }
  ]

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 overflow-y-auto shadow-lg">
      <div className="p-6">
        {/* Enhanced Header */}
        <div className="mb-6 pb-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Layout size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">კომპონენტები</h2>
              <p className="text-xs text-gray-600">გადმოათრიე canvas-ზე</p>
            </div>
          </div>
          
          {/* Quick tip */}
          <div className="bg-gradient-to-r from-primary-50 to-cyan-50 rounded-lg p-3 border border-primary-200">
            <p className="text-xs text-primary-800">
              <span className="font-bold">💡 რჩევა:</span> დააჭირე და გადმოათრიე ნებისმიერი კომპონენტი
            </p>
          </div>
        </div>

        {/* Basic Components */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            ძირითადი
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {components.slice(0, 6).map(component => (
              <DraggableComponent key={component.id} component={component} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </div>

        {/* Layout Components */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            განლაგება
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {components.slice(6, 9).map(component => (
              <DraggableComponent key={component.id} component={component} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </div>

        {/* Pre-built Components */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            გამზადებული
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {components.slice(9, 13).map(component => (
              <DraggableComponent key={component.id} component={component} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </div>

        {/* Advanced Components */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            დამატებითი
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {components.slice(13, 19).map(component => (
              <DraggableComponent key={component.id} component={component} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </div>

        {/* Feature Components */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            სპეციალური
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {components.slice(19).map(component => (
              <DraggableComponent key={component.id} component={component} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-cyan-50 rounded-lg border border-primary-200">
          <h4 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
            <Play size={16} />
            🚀 მალე დაემატება
          </h4>
          <div className="space-y-2 text-sm text-primary-700">
            <div>• ფორმები და Input ველები</div>
            <div>• სლაიდერი / კარუსელი</div>
            <div>• Modal / Popup</div>
            <div>• Accordion / Tabs</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderSidebar