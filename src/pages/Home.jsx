import Hero from '../components/Hero'
import TemplateCard from '../components/TemplateCard'
import { Zap, Shield, Sparkles, Code, Palette, Rocket, Star, TrendingUp, Users } from 'lucide-react'

const Home = () => {
  const templates = [
    {
      name: 'E-Commerce Store',
      description: 'სრული ონლაინ მაღაზია პროდუქტებით',
      icon: '🛍️',
      category: 'E-Commerce',
      pages: 5,
      features: 12
    },
    {
      name: 'Portfolio Website',
      description: 'პერსონალური პორტფოლიო კრეატიულებისთვის',
      icon: '🎨',
      category: 'Portfolio',
      pages: 4,
      features: 8
    },
    {
      name: 'Business Landing',
      description: 'ბიზნეს landing page კონვერსიებით',
      icon: '💼',
      category: 'Business',
      pages: 3,
      features: 10
    },
    {
      name: 'Blog Platform',
      description: 'თანამედროვე ბლოგ პლატფორმა',
      icon: '📝',
      category: 'Blog',
      pages: 6,
      features: 15
    },
    {
      name: 'Restaurant Menu',
      description: 'დიჯიტალური მენიუ რესტორნებისთვის',
      icon: '🍽️',
      category: 'Restaurant',
      pages: 4,
      features: 9
    },
    {
      name: 'SaaS Platform',
      description: 'SaaS აპლიკაციის ინტერფეისი',
      icon: '⚡',
      category: 'SaaS',
      pages: 8,
      features: 20
    }
  ]

  const features = [
    {
      icon: <Zap className="w-12 h-12 text-primary-600" />,
      title: 'სწრაფი გენერაცია',
      description: 'AI ქმნის სრულ ვებსაიტს 30-60 წამში'
    },
    {
      icon: <Code className="w-12 h-12 text-primary-600" />,
      title: 'Clean Code',
      description: 'პროფესიონალური React + Tailwind კოდი'
    },
    {
      icon: <Palette className="w-12 h-12 text-primary-600" />,
      title: 'Custom Design',
      description: 'შენი ბრენდის ფერები და სტილი'
    },
    {
      icon: <Shield className="w-12 h-12 text-primary-600" />,
      title: 'უსაფრთხოება',
      description: 'დაცული ავტორიზაცია და მონაცემები'
    },
    {
      icon: <Rocket className="w-12 h-12 text-primary-600" />,
      title: 'Production Ready',
      description: 'მზადაა დაუყოვნებლივ გასაშვებად'
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary-600" />,
      title: 'AI ოპტიმიზაცია',
      description: 'ავტომატური SEO და Performance'
    }
  ]

  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              რატომ <span className="text-gradient">AI Builder?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ყველაფერი რაც გჭირდება პროფესიონალური ვებსაიტის შესაქმნელად
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:border-primary-200 border border-transparent transition-all">
                <div className="mb-4 inline-block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50" id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              პოპულარული <span className="text-gradient">თემფლეითები</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ნახე რა საიტები შექმნეს სხვა მომხმარებლებმა
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <TemplateCard key={index} template={template} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary-400 mb-2">1000+</div>
              <div className="text-gray-400">შექმნილი საიტი</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary-400 mb-2">500+</div>
              <div className="text-gray-400">მომხმარებელი</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary-400 mb-2">99%</div>
              <div className="text-gray-400">კმაყოფილება</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-gray-400">მხარდაჭერა</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            მზად ხარ შექმნა შენი ვებსაიტი?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            დაიწყე უფასოდ და გადააქციე შენი იდეა რეალობად
          </p>
          <a href="/generate" className="btn-primary text-lg px-8 py-4 inline-block">
            <Sparkles className="inline mr-2" size={20} />
            შექმენი საიტი ახლავე
          </a>
        </div>
      </section>
    </div>
  )
}

export default Home
