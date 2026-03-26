import React from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Clock, ChevronRight, Zap, Flame, Star, Utensils } from 'lucide-react';

interface CyberLandingProps {
  onEnter: () => void;
  siteName: string;
  siteDescription: string;
}

const CyberLanding: React.FC<CyberLandingProps> = ({ onEnter, siteName, siteDescription }) => {
  const dishImages = [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
  ];

  return (
    <div className="relative h-full w-full bg-[#050505] text-white overflow-hidden font-sans p-6 md:p-8 flex flex-col gap-6">
      {/* Cyberpunk Background Image & Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://i.imgur.com/O4Pvsrx.jpeg" 
          alt="Cyber Background" 
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e1e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Gold Threads (SVG Lines) */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-20">
        <motion.path
          d="M -100 100 Q 400 300 1200 100 T 2000 500"
          stroke="#c5a059"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 2000 800 Q 1200 600 400 900 T -100 400"
          stroke="#c5a059"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </svg>

      {/* Header Section */}
      <header className="relative z-20 flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-1"
          >
            <span className="text-cyan-400 font-mono tracking-[0.4em] uppercase text-[10px]">Future Dining Protocol v2.0</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif tracking-[0.15em] relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-pink-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              {siteName}
            </span>
          </motion.h1>
        </div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-right"
        >
          <p className="text-white/40 font-serif italic text-lg tracking-widest">{siteDescription}</p>
        </motion.div>
      </header>

      {/* Main Bento Grid */}
      <main className="relative z-20 flex-1 grid grid-cols-12 grid-rows-6 gap-4 overflow-hidden">
        
        {/* Left Column: Intro & Features */}
        <div className="col-span-12 lg:col-span-4 row-span-6 flex flex-col gap-4">
          {/* About Box */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
            <h2 className="text-2xl font-serif mb-4 flex items-center gap-3">
              <Zap className="text-cyan-400" size={20} />
              <span>餐厅宗旨</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-gold/20 pl-4">
              "重塑传统，定义未来。我们将巫山传统的烤鱼技艺与赛博时代的先锋美学融合，每一口都是对经典的致敬，也是对未来的探索。"
            </p>
            <div className="mt-6 flex gap-6">
              <div>
                <span className="block text-gold font-serif text-xl">28年</span>
                <span className="text-[10px] text-white/30 uppercase tracking-widest">匠心传承</span>
              </div>
              <div>
                <span className="block text-pink-500 font-serif text-xl">100%</span>
                <span className="text-[10px] text-white/30 uppercase tracking-widest">极客品质</span>
              </div>
            </div>
          </motion.div>

          {/* Features Grid (Compact) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-[45%] bg-white/[0.03] border border-white/5 rounded-3xl p-6 grid grid-cols-2 gap-4"
          >
            {[
              { icon: Flame, title: "传统炭火", color: "text-orange-500" },
              { icon: Star, title: "星级服务", color: "text-gold" },
              { icon: Utensils, title: "匠心调味", color: "text-pink-500" },
              { icon: Clock, title: "全时供应", color: "text-blue-400" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all">
                <item.icon className={`${item.color} mb-2`} size={20} />
                <span className="text-xs font-serif tracking-wider">{item.title}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Center/Right Column: Visuals & Contact */}
        <div className="col-span-12 lg:col-span-8 row-span-6 grid grid-cols-8 grid-rows-6 gap-4">
          
          {/* Visual Showcase (Large) */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-8 row-span-4 bg-white/[0.03] border border-white/5 rounded-3xl relative overflow-hidden group shadow-2xl"
          >
            <img 
              src={dishImages[0]} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[5s]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-400 text-[10px] tracking-[0.3em] uppercase mb-3">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping" />
                Live Kitchen
              </div>
              <h3 className="text-3xl font-serif tracking-tighter">视觉与味觉的 <span className="text-gold italic">双重盛宴</span></h3>
            </div>
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-scan" />
          </motion.div>

          {/* Contact Box */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="col-span-5 row-span-2 bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="block text-[10px] text-white/30 uppercase tracking-widest">订餐电话</span>
                  <span className="text-lg font-serif">023-6688-9999</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="block text-[10px] text-white/30 uppercase tracking-widest">餐厅地址</span>
                  <span className="text-sm font-serif leading-tight">巫山县滨江路<br/>赛博广场2077</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/40 text-[10px] tracking-[0.2em] uppercase border-t border-white/5 pt-4">
              <Clock size={14} />
              <span>Mon-Sun: 10:00 - 04:00</span>
            </div>
          </motion.div>

          {/* Enter Button Box */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="col-span-3 row-span-2"
          >
            <button
              onClick={onEnter}
              className="w-full h-full bg-orange-500 hover:bg-white text-black rounded-3xl flex flex-col items-center justify-center gap-2 transition-all group shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              <span className="text-2xl font-serif tracking-[0.2em]">进入菜单</span>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 group-hover:translate-x-2 transition-transform">
                Start Order <ChevronRight size={14} />
              </div>
            </button>
          </motion.div>

        </div>
      </main>

      {/* Footer Micro-details */}
      <footer className="relative z-20 flex justify-between items-center text-[8px] text-white/20 tracking-[0.4em] uppercase">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-gold/30 rounded-full flex items-center justify-center text-gold/50">巫</div>
          <span>© 2026 Wushan Cyber Roast</span>
        </div>
        <div className="flex gap-6">
          <span>System Status: Optimal</span>
          <span>Security: Encrypted</span>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CyberLanding;
