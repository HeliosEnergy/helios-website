import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Construction, ArrowLeft, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';

const pageTitles: Record<string, string> = {
  'cloud-infrastructure': 'Cloud & Infrastructure Partners',
  'consulting-services': 'Consulting & Services Partners',
  'technology-partners': 'Technology Partners',
  'become-partner': 'Become a Partner',
  'default': 'This Page'
};

const ComingSoonPage = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 'default';
  const title = pageTitles[page] || pageTitles['default'];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center"
          >
            <Construction className="w-12 h-12 text-[#FF6B35]" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-sm font-mono uppercase tracking-wider text-white/60">Under Development</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-6"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-white/50 font-light leading-relaxed mb-12 max-w-lg mx-auto"
          >
            We're building something great. This page will be available soon.
            In the meantime, feel free to reach out to us directly.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact?service=partnership">
              <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 py-6 text-base font-medium hover:scale-105 transition-all duration-300">
                <Bell className="w-4 h-4 mr-2" />
                Contact Us Instead
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 px-8 py-6 text-base font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-24 flex items-center justify-center gap-4"
          >
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/30">Helios Partners</span>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#FF6B35]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Footer />
    </div>
  );
};

export default ComingSoonPage;
