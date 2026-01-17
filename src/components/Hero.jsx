import { Link } from 'react-router-dom'
import { Sparkles, Zap, ArrowRight, Stars } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative gradient-bg hero-pattern py-24 md:py-32 overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-primary-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-block mb-8 animate-slide-up">
            <div className="glass-effect px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center space-x-2">
                <Stars className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-gray-700">AI-ით შექმნილი ვებსაიტები</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            შექმენი{' '}
            <span className="text-gradient animate-slide-up">შენი ოცნების</span>
            <br />
            <span className="relative inline-block animate-slide-up" style={{animationDelay: '0.2s'}}>
              ვებსაიტი
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C75 2, 225 2, 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#57bcd9"/>
                    <stop offset="50%" stopColor="#85cee3"/>
                    <stop offset="100%" stopColor="#57bcd9"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.3s'}}>
            ხელოვნური ინტელექტის დახმარებით შექმენი პროფესიონალური, 
            <br className="hidden md:block" />
            <span className="font-semibold text-primary-700"> მოდერნული და სრულად რესპონსიული</span> ვებსაიტი
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Link to="/generate" className="btn-primary text-lg px-10 py-4 group">
              <Zap className="inline mr-2 group-hover:rotate-12 transition-transform" size={22} />
              დაიწყე უფასოდ
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={22} />
            </Link>
            <a href="#features" className="btn-secondary text-lg px-10 py-4 group">
              <Sparkles className="inline mr-2 group-hover:scale-110 transition-transform" size={22} />
              გაიგე მეტი
            </a>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-gray-700 animate-slide-up" style={{animationDelay: '0.5s'}}>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-1 group-hover:scale-110 transition-transform">1000+</div>
              <div className="text-sm md:text-base opacity-80">შექმნილი საიტი</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-primary-300 to-transparent"></div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-1 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm md:text-base opacity-80">კმაყოფილი მომხმარებელი</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-primary-300 to-transparent"></div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-1 group-hover:scale-110 transition-transform">30 წმ</div>
              <div className="text-sm md:text-base opacity-80">საშუალო დრო</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" fillOpacity="0.8"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
