import { Link } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineDownload, HiOutlineLockClosed, HiOutlineBell } from 'react-icons/hi';

const features = [
  { icon: HiOutlineClipboardList, title: 'Easy Order Form', desc: 'Simple form to submit your T-shirt size and details' },
  { icon: HiOutlineShieldCheck, title: 'Payment Tracking', desc: 'Real-time payment status updates and verification' },
  { icon: HiOutlineUserGroup, title: 'Branch Management', desc: 'Each branch has a dedicated admin (POC)' },
  { icon: HiOutlineDownload, title: 'Excel Export', desc: 'One-click export of all orders for dispatch' },
  { icon: HiOutlineLockClosed, title: 'Form Lock', desc: 'Admin can permanently lock form at deadline' },
  { icon: HiOutlineBell, title: 'Real-time Updates', desc: 'Live notifications for admins on new submissions' },
];

const branches = ['CSE', 'ECE', 'EE', 'Civil', 'Meta', 'Mech', 'Chem'];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 left-1/3 w-40 h-40 bg-primary-400/5 rounded-full blur-2xl animate-pulse-slow" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="text-xl">👕</span>
                <span className="text-sm text-primary-200 font-medium">MNIT Jaipur · Batch 2024</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                T-Shirt Order
                <span className="block bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
                  Portal
                </span>
              </h1>

              <p className="text-lg text-primary-200 mb-8 max-w-lg leading-relaxed">
                Centralized ordering system for MNIT batch T-shirts. Submit your size, 
                track payment status, and get your merch — all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/order" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                  <span>Order Now</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/admin/login" className="btn-secondary text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Admin Login
                </Link>
              </div>

              {/* Branch pills */}
              <div className="mt-10 flex flex-wrap gap-2">
                {branches.map(b => (
                  <span key={b} className="bg-white/10 text-primary-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - T-Shirt Visual */}
            <div className="hidden md:flex justify-center animate-fade-in">
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-primary-600/30 to-accent-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float shadow-2xl">
                  <span className="text-[120px]">👕</span>
                </div>
                {/* Floating stats */}
                <div className="absolute -top-4 -right-4 glass-card px-4 py-3 animate-slide-down" style={{ animationDelay: '0.5s' }}>
                  <p className="text-xs text-surface-500 font-medium">Total Orders</p>
                  <p className="text-xl font-bold text-primary-700">300+</p>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3 animate-slide-up" style={{ animationDelay: '1s' }}>
                  <p className="text-xs text-surface-500 font-medium">7 Branches</p>
                  <p className="text-xl font-bold text-accent-600">MNIT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">How It Works</h2>
            <p className="text-surface-500 max-w-2xl mx-auto">
              A simple 3-step process: Fill the form, pay your branch POC, and get your T-shirt!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="card group cursor-default animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Fill the form now and secure your batch T-shirt. Don't miss the deadline!
          </p>
          <Link to="/order" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-lg">
            <span>Fill Order Form</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-950 text-surface-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2024 MNIT Jaipur T-Shirt Order Portal · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
