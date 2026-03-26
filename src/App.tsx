/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ChevronRight, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Search, 
  Menu as MenuIcon, 
  X,
  Clock,
  MapPin,
  Phone,
  PlayCircle,
  Star,
  Flame,
  Soup,
  Wind,
  Beer,
  Mountain,
  FlameKindling,
  Zap,
  IceCream,
  Utensils,
  GlassWater,
  LayoutDashboard,
  User as UserIcon,
  ChefHat
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  setDoc,
  getDoc,
  getDocs,
  writeBatch,
  getDocFromServer,
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { formatPrice } from './utils';
import { CATEGORIES as INITIAL_CATEGORIES, DISHES as INITIAL_DISHES, Dish, Category, Settings, UserProfile } from './types';
import AdminDashboard from './components/AdminDashboard';
import CyberLanding from './components/CyberLanding';

// --- Components ---

const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
  const [scale, setScale] = useState(1);
  const baseWidth = 1280;
  const baseHeight = 800;

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / baseWidth;
      const scaleY = windowHeight / baseHeight;
      // Use the smaller scale to ensure the entire content fits
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    const timer = setTimeout(handleResize, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden touch-none">
      <div 
        style={{ 
          width: baseWidth * scale, 
          height: baseHeight * scale,
          flexShrink: 0
        }}
        className="relative overflow-hidden shadow-2xl bg-[#050505]"
      >
        <div 
          style={{ 
            width: baseWidth, 
            height: baseHeight, 
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="absolute inset-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const VideoModal = ({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white hover:text-gold transition-colors z-[120]"
      >
        <X size={32} />
      </button>
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
        <video 
          src={videoUrl} 
          autoPlay 
          controls 
          className="w-full h-full object-contain"
        />
      </div>
    </motion.div>
  );
};

const DishDetailModal = ({ dish, onAdd, onPlayVideo, onClose, bgColor }: { dish: Dish; onAdd: (d: Dish) => void; onPlayVideo: (url: string) => void; onClose: () => void; bgColor: string }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`relative w-full max-w-4xl ${bgColor} border border-gold/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors duration-1000`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-gold transition-colors z-10 p-2 bg-black/20 rounded-full backdrop-blur-sm"
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img 
            src={dish.image} 
            alt={dish.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {dish.videoUrl && (
            <button 
              onClick={() => onPlayVideo(dish.videoUrl!)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all group"
            >
              <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center group-hover:border-gold group-hover:scale-110 transition-all">
                <PlayCircle size={48} className="text-white group-hover:text-gold" strokeWidth={1} />
              </div>
            </button>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gold/20 text-gold text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm border border-gold/30">菜品详情</span>
              <div className="h-[1px] flex-1 bg-gold/20" />
            </div>
            <h2 className="font-serif text-3xl text-white mb-4 tracking-wide">{dish.name}</h2>
            <p className="text-gold font-serif text-2xl mb-8">{formatPrice(dish.price)}</p>
            <div className="space-y-6">
              <div>
                <h4 className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-2">特色描述</h4>
                <p className="text-white/80 font-light leading-relaxed italic">"{dish.description}"</p>
              </div>
              <div>
                <h4 className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-2">匠心工艺</h4>
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  传承巫山古法，精选上等食材，经由主厨亲自掌勺，炭火慢烤，锁住鲜美汤汁，每一口都是对味蕾的极致宠溺。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <button 
              onClick={() => {
                onAdd(dish);
                onClose();
              }}
              className="flex-1 py-4 bg-gold text-black font-serif text-lg hover:bg-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span>加入点餐单</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryCover = ({ category, bgColor }: { category: Category; bgColor: string }) => {
  return (
    <motion.div 
      className="relative w-full h-[60vh] md:h-[80vh] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background with Ken Burns effect to simulate video */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.8, 0.7]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <img 
          src={category.coverImage} 
          alt={category.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80`} />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-gold font-serif text-xl tracking-[0.5em] mb-4">
            巫山烤全鱼
          </h2>
          <div className="w-12 h-[1px] bg-gold/50 mx-auto mb-8" />
          <h1 className="text-6xl md:text-8xl font-serif tracking-widest mb-6">
            {category.name}
          </h1>
          <p className="text-white/60 font-serif italic tracking-widest text-lg">
            {category.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface DishCardProps {
  key?: string | number;
  dish: Dish;
  onAdd: (d: Dish) => void;
  onPlayVideo: (url: string | null) => void;
  onShowDetail: (d: Dish) => void;
  bgColor: string;
}

const DishCardHero = ({ dish, onAdd, onPlayVideo, onShowDetail, bgColor }: DishCardProps) => {
  const bgGradientColor = bgColor.replace('bg-', '');
  return (
    <div 
      onClick={() => onShowDetail(dish)}
      className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-xl border border-gold/10 group cursor-pointer"
    >
      <img 
        src={dish.image} 
        alt={dish.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-${bgGradientColor} via-${bgGradientColor}/20 to-transparent transition-colors duration-1000`} />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-gold text-black text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm">主厨推荐</span>
            <div className="h-[1px] w-12 bg-gold/50" />
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase">Chef's Signature</span>
          </div>
          <h3 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight tracking-wide">{dish.name}</h3>
          <p className="text-white/60 text-sm md:text-lg mb-8 font-light leading-relaxed max-w-xl italic">
            "{dish.description}"
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gold font-serif text-3xl md:text-4xl">{formatPrice(dish.price)}</span>
            {dish.videoUrl && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayVideo(dish.videoUrl!);
                }}
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-all group/btn"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-gold group-hover/btn:bg-gold/10 transition-all">
                  <PlayCircle size={24} strokeWidth={1} />
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase font-medium">观看视频</span>
              </button>
            )}
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd(dish);
          }}
          className="px-10 py-4 bg-gold text-black font-serif text-lg hover:bg-white transition-all shadow-[0_10px_30px_rgba(197,160,89,0.3)] active:scale-95"
        >
          立即品鉴
        </button>
      </div>
    </div>
  );
};

const DishCardFeatured = ({ dish, onAdd, onPlayVideo, onShowDetail, bgColor }: DishCardProps) => {
  const bgClass = bgColor.replace('bg-', '');
  return (
    <div 
      onClick={() => onShowDetail(dish)}
      className="flex flex-col bg-white/[0.03] border border-white/5 rounded-lg overflow-hidden group hover:border-gold/20 transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={dish.image} 
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
          {dish.videoUrl && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlayVideo(dish.videoUrl!);
              }}
              className="text-white/0 group-hover:text-gold/90 transition-all transform scale-50 group-hover:scale-100 duration-500"
            >
              <PlayCircle size={48} strokeWidth={1} />
            </button>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd(dish);
            }}
            className={`w-10 h-10 rounded-full bg-${bgClass}/80 text-gold hover:bg-gold hover:text-black transition-all flex items-center justify-center backdrop-blur-md border border-gold/20`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-serif text-xl text-white group-hover:text-gold transition-colors">{dish.name}</h4>
          <span className="text-gold font-serif text-lg">{formatPrice(dish.price)}</span>
        </div>
        <p className="text-white/40 text-xs font-light leading-relaxed line-clamp-2">{dish.description}</p>
      </div>
    </div>
  );
};

const LandscapeDishCardHero = ({ dish, onAdd, onPlayVideo, onShowDetail, bgColor }: DishCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex h-full w-full items-stretch bg-black/20 backdrop-blur-sm"
      onClick={() => onShowDetail(dish)}
    >
      {/* Left: Text Content */}
      <div className="w-[45%] p-12 md:p-24 flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-gold text-black text-xs font-bold tracking-[0.3em] uppercase rounded-sm shadow-[0_5px_15px_rgba(197,160,89,0.4)]">
              {dish.isHero ? '主厨推荐' : '精选推荐'}
            </span>
            <div className="h-[1px] w-16 bg-gold/40" />
            <span className="text-gold text-xs tracking-[0.4em] uppercase font-light">Signature Selection</span>
          </div>
          <h3 className="font-serif text-5xl md:text-7xl text-white mb-10 leading-tight tracking-wide drop-shadow-2xl">{dish.name}</h3>
          <div className="space-y-8 mb-16">
            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed italic border-l-4 border-gold/40 pl-8 max-w-xl">
              "{dish.description}"
            </p>
            <div className="flex items-center gap-6 text-white/30 text-sm tracking-[0.5em] uppercase font-serif">
              <span>CRAFTSMANSHIP</span>
              <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
              <span>AUTHENTIC</span>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-gold/60 text-[10px] tracking-[0.5em] uppercase mb-1">Price</span>
              <span className="text-gold font-serif text-5xl">{formatPrice(dish.price)}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(dish);
              }}
              className="px-16 py-6 bg-gold text-black font-serif text-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(197,160,89,0.5)] active:scale-95 rounded-full flex items-center gap-3"
            >
              <Plus size={24} />
              <span>立即品鉴</span>
            </button>
          </div>
          {dish.videoUrl && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlayVideo(dish.videoUrl!);
              }}
              className="mt-16 flex items-center gap-5 text-white/40 hover:text-gold transition-all group/btn"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:border-gold group-hover/btn:bg-gold/10 transition-all shadow-xl">
                <PlayCircle size={32} strokeWidth={1} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-white/20">Watch Video</span>
                <span className="text-xs tracking-[0.2em] uppercase font-medium">观看制作视频</span>
              </div>
            </button>
          )}
        </motion.div>
      </div>

      {/* Right: Large Image */}
      <div className="w-[55%] relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, filter: 'blur(10px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: "easeOut" }}
          src={dish.image} 
          alt={dish.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Decorative elements */}
        <div className="absolute top-16 right-16 vertical-text text-white/10 text-base tracking-[1.5em] font-serif uppercase">
          Wushan Traditional Roasted Fish
        </div>
        
        <div className="absolute bottom-16 right-16 flex items-center gap-4">
          <div className="w-20 h-[1px] bg-white/20" />
          <span className="text-white/20 text-[10px] tracking-[0.5em] uppercase font-serif">Est. 1998</span>
        </div>
      </div>
    </motion.div>
  );
};

const LandscapeDishCardGrid = ({ dishes, onAdd, onPlayVideo, onShowDetail, bgColor }: { dishes: Dish[]; onAdd: (d: Dish) => void; onPlayVideo: (url: string) => void; onShowDetail: (d: Dish) => void; bgColor: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="grid grid-cols-2 h-full w-full p-16 gap-16 bg-black/10 backdrop-blur-sm"
    >
      {dishes.map((dish, idx) => (
        <motion.div 
          key={dish.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => onShowDetail(dish)}
          className="relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] hover:border-gold/40 transition-all duration-700 shadow-2xl"
        >
          <div className="h-[60%] overflow-hidden relative">
            <img 
              src={dish.image} 
              alt={dish.name}
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
              {dish.videoUrl && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayVideo(dish.videoUrl!);
                  }}
                  className="text-white/0 group-hover:text-gold/90 transition-all transform scale-50 group-hover:scale-100 duration-500"
                >
                  <PlayCircle size={64} strokeWidth={1} />
                </button>
              )}
            </div>
            <div className="absolute top-8 right-8">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(dish);
                }}
                className="w-14 h-14 rounded-full bg-gold text-black hover:bg-white transition-all flex items-center justify-center shadow-[0_10px_20px_rgba(197,160,89,0.4)] active:scale-90"
              >
                <Plus size={28} />
              </button>
            </div>
          </div>
          <div className="h-[40%] p-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-serif text-3xl text-white group-hover:text-gold transition-colors tracking-wide">{dish.name}</h4>
                <span className="text-gold font-serif text-3xl">{formatPrice(dish.price)}</span>
              </div>
              <p className="text-white/50 text-base font-light leading-relaxed line-clamp-2 italic border-l-2 border-gold/20 pl-4">
                "{dish.description}"
              </p>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <div className="h-[1px] flex-1 bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] tracking-[0.4em] text-white/20 uppercase group-hover:text-gold/40 transition-colors">
                <span>View Details</span>
                <ChevronRight size={12} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const LandscapeDishCardCompactGrid = ({ dishes, onAdd, onPlayVideo, onShowDetail, bgColor }: { dishes: Dish[]; onAdd: (d: Dish) => void; onPlayVideo: (url: string) => void; onShowDetail: (d: Dish) => void; bgColor: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="grid grid-cols-3 grid-rows-2 h-full w-full p-8 gap-6 bg-black/20 backdrop-blur-sm"
    >
      {dishes.map((dish, idx) => (
        <motion.div 
          key={dish.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onShowDetail(dish)}
          className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] hover:border-gold/40 transition-all duration-500 shadow-xl flex flex-col"
        >
          <div className="h-[55%] overflow-hidden relative">
            <img 
              src={dish.image} 
              alt={dish.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {/* Tag like in the image */}
            <div className="absolute top-2 left-2 bg-white/90 text-black px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
              椒麻入味
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          </div>
          <div className="h-[45%] p-4 flex flex-col justify-between">
            <div>
              <h4 className="font-serif text-base text-white group-hover:text-gold transition-colors truncate">{dish.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-white/40 text-[10px] font-light line-clamp-1 italic">"{dish.description}"</p>
                <span className="text-white/20 text-[9px] border border-white/10 px-1 rounded">10-15秒</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <span className="text-gold font-serif text-lg">{formatPrice(dish.price)}</span>
                <span className="text-white/20 text-[8px] uppercase tracking-tighter">Per Portion</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(dish);
                }}
                className="w-8 h-8 rounded-full border border-white/20 text-white/60 hover:bg-gold hover:text-black hover:border-gold transition-all flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// --- Main App ---

const CATEGORY_ICONS: Record<string, any> = {
  'Star': Star,
  'Flame': Flame,
  'Soup': Soup,
  'Wind': Wind,
  'Beer': Beer,
  'Mountain': Mountain,
  'FlameKindling': FlameKindling,
  'Zap': Zap,
  'IceCream': IceCream,
  'Utensils': Utensils,
  'GlassWater': GlassWater
};

export default function App() {
  // Scale Wrapper Component to maintain aspect ratio across devices
  const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
    const [scale, setScale] = useState(1);
    const baseWidth = 1280;
    const baseHeight = 800;

    useEffect(() => {
      const handleResize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scaleX = windowWidth / baseWidth;
        const scaleY = windowHeight / baseHeight;
        const newScale = Math.min(scaleX, scaleY);
        setScale(newScale);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
        <div 
          style={{ 
            width: baseWidth, 
            height: baseHeight, 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            flexShrink: 0
          }}
          className="relative shadow-2xl"
        >
          {children}
        </div>
      </div>
    );
  };

  const [isAdminView, setIsAdminView] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Settings>({
    siteName: '巫山烤鱼',
    siteDescription: '地道风味，匠心烤制',
    cartEnabled: true,
    themeTemplate: 'default',
    fontFamily: 'sans',
    primaryColor: '#FF4B2B'
  });
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<{ dish: Dish; count: number }[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group dishes into pages for landscape view
  const pages = useMemo(() => {
    const filtered = activeCategory === 'all' 
      ? dishes.filter(d => d.isFeatured)
      : dishes.filter(d => d.category === activeCategory);
    
    const result: { type: 'cover' | 'hero' | 'grid' | 'compact-grid'; data: any }[] = [];
    
    // Always start with a cover page
    const category = categories.find(c => c.id === activeCategory);
    if (category) {
      result.push({ type: 'cover', data: category });
    }

    // Hero dishes get their own page
    const heroes = filtered.filter(d => d.isHero);
    heroes.forEach(h => result.push({ type: 'hero', data: h }));

    // Regular dishes are grouped by 2 or 6
    const others = filtered.filter(d => !d.isHero);
    
    if (activeCategory === 'all') {
      // Special logic for "Featured Recommendations"
      // Build pages 1-5 (after cover) as hero or grid
      // Page 0: Cover
      // Page 1-N: Heroes
      // Then Grids of 2 until we reach page 6
      
      let currentOthersIdx = 0;
      
      // We already added heroes. Let's see how many pages we have.
      while (result.length < 6 && currentOthersIdx < others.length) {
        result.push({ type: 'grid', data: others.slice(currentOthersIdx, currentOthersIdx + 2) });
        currentOthersIdx += 2;
      }
      
      // From page 6 onwards, use 3x2 (6 dishes)
      while (currentOthersIdx < others.length) {
        result.push({ type: 'compact-grid', data: others.slice(currentOthersIdx, currentOthersIdx + 6) });
        currentOthersIdx += 6;
      }
    } else {
      // Regular categories use 2-dish grids
      for (let i = 0; i < others.length; i += 2) {
        result.push({ type: 'grid', data: others.slice(i, i + 2) });
      }
    }

    return result;
  }, [dishes, activeCategory, categories]);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory]);

  // Auth & Real-time Data
  useEffect(() => {
    const initData = async () => {
      try {
        const categoriesSnap = await getDocs(collection(db, 'categories'));
        const dishesSnap = await getDocs(collection(db, 'dishes'));
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));

        if (categoriesSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_CATEGORIES.forEach((cat, index) => {
            const catRef = doc(db, 'categories', cat.id);
            batch.set(catRef, { ...cat, order: index });
          });
          await batch.commit();
          console.log('Categories initialized');
        }

        if (dishesSnap.empty) {
          const batch = writeBatch(db);
          INITIAL_DISHES.forEach((dish) => {
            const dishRef = doc(db, 'dishes', dish.id);
            batch.set(dishRef, dish);
          });
          await batch.commit();
          console.log('Dishes initialized');
        }

        if (!settingsSnap.exists()) {
          await setDoc(doc(db, 'settings', 'global'), {
            siteName: '巫山烤鱼',
            siteDescription: '地道风味，匠心烤制',
            cartEnabled: true,
            themeTemplate: 'default',
            fontFamily: 'sans',
            primaryColor: '#FF4B2B'
          });
          console.log('Settings initialized');
        }
      } catch (error) {
        // Only log if it's not a permission error, or if we want to debug
        if (error instanceof Error && !error.message.includes('permission')) {
          console.error('Error initializing data:', error);
        }
      }
    };

    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };

    testConnection();

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email === 'yujianfei2016@gmail.com';
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: isAdmin ? 'admin' : 'user'
        });
        
        // Only attempt initialization if the user is an admin
        if (isAdmin) {
          initData();
        }
      } else {
        setUser(null);
      }
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data() as Settings);
    });

    const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('order', 'asc')), (snapshot) => {
      if (!snapshot.empty) {
        setCategories(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category)));
      }
    });

    const unsubDishes = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      if (!snapshot.empty) {
        setDishes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Dish)));
      }
    });

    return () => {
      unsubAuth();
      unsubSettings();
      unsubCategories();
      unsubDishes();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminView(false);
  };

  const confirmOrder = async () => {
    if (!tableNumber) {
      alert("请选择或输入桌号");
      return;
    }
    if (cart.length === 0) return;

    setIsOrdering(true);
    try {
      const orderData = {
        tableId: tableNumber,
        items: cart.map(item => ({
          dishId: item.dish.id,
          name: item.dish.name,
          price: item.dish.price,
          quantity: item.count
        })),
        total: totalAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      alert("下单成功！请稍候，美味即将上桌。");
      setCart([]);
      setIsCartOpen(false);
      setTableNumber("");
    } catch (error) {
      console.error("Order failed:", error);
      alert("下单失败，请重试。");
    } finally {
      setIsOrdering(false);
    }
  };

  const CATEGORY_BG_COLORS: Record<string, string> = {
    'all': 'bg-deep-purple',
    'northeast': 'bg-deep-red',
    'sichuan': 'bg-deep-yellow',
    'bar-snacks': 'bg-deep-blue',
    'appetizers': 'bg-deep-green',
    'staple': 'bg-deep-purple',
    'drinks': 'bg-deep-blue',
  };

  const currentBgColor = CATEGORY_BG_COLORS[activeCategory] || 'bg-deep-purple';

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item => 
          item.dish.id === dish.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { dish, count: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dishId);
      if (existing && existing.count > 1) {
        return prev.map(item => 
          item.dish.id === dishId ? { ...item, count: item.count - 1 } : item
        );
      }
      return prev.filter(item => item.dish.id !== dishId);
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.dish.price * item.count, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);

  const filteredDishes = dishes.filter(d => d.category === activeCategory);
  const heroDish = filteredDishes.find(d => d.isHero);
  const featuredDishes = filteredDishes.filter(d => d.isFeatured);
  const regularDishes = filteredDishes.filter(d => !d.isHero && !d.isFeatured);

  if (isAdminView && user?.role === 'admin') {
    return (
      <ScaleWrapper>
        <AdminDashboard onLogout={handleLogout} />
      </ScaleWrapper>
    );
  }

  const paginate = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
      setDirection(newDirection);
      setCurrentPage(newPage);
    }
  };

  if (showLanding) {
    return (
      <ScaleWrapper>
        <CyberLanding 
          onEnter={() => setShowLanding(false)} 
          siteName={settings.siteName} 
          siteDescription={settings.siteDescription} 
        />
      </ScaleWrapper>
    );
  }

  return (
    <ScaleWrapper>
      <div className={`flex flex-col h-full w-full overflow-hidden ${currentBgColor} transition-colors duration-1000 selection:bg-gold/30 font-${settings.fontFamily}`}>
        <style>{`
          :root {
            --primary-color: ${settings.primaryColor};
          }
        `}</style>

        {/* Top Navigation Bar - Landscape Optimized */}
        <header className="h-28 px-10 grid grid-cols-[1fr_auto_1fr] items-center glass-panel border-b border-gold/20 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Left: Logo */}
        <div 
          onClick={() => setShowLanding(true)}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 border-2 border-gold rounded-full flex items-center justify-center text-gold font-serif text-3xl shadow-[0_0_20px_rgba(197,160,89,0.4)] bg-black/40 group-hover:scale-110 transition-transform">
            巫
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-gold uppercase drop-shadow-lg group-hover:text-white transition-colors">{settings.siteName}</h1>
            <span className="text-[10px] tracking-[0.5em] text-white/50 uppercase font-light">{settings.siteDescription}</span>
          </div>
        </div>
        
        {/* Center: Horizontal Category List */}
        <nav className="flex items-center justify-center gap-4 overflow-x-auto no-scrollbar max-w-4xl py-2 px-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group relative px-8 py-3 rounded-xl text-base tracking-[0.2em] transition-all duration-500 whitespace-nowrap overflow-hidden flex items-center justify-center ${
                activeCategory === cat.id 
                ? 'text-black font-bold' 
                : 'text-white/70 hover:text-white'
              }`}
            >
              {/* Background Layer */}
              <div className={`absolute inset-0 transition-transform duration-500 ${
                activeCategory === cat.id ? 'translate-y-0' : 'translate-y-full'
              } bg-gradient-to-br from-gold via-gold/90 to-gold/80`} />
              
              {/* Hover Layer */}
              <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {cat.id === 'all' && <Star size={16} className={activeCategory === 'all' ? 'text-black' : 'text-gold'} />}
                <span className="font-serif">{cat.name}</span>
              </span>

              {/* Bottom Border for non-active */}
              {activeCategory !== cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-8">
          <button 
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-2xl text-gold transition-all active:scale-95 group"
          >
            <ChefHat size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm tracking-[0.2em] font-serif">返回封面</span>
          </button>

          {user?.role === 'admin' && (
            <button 
              onClick={() => setIsAdminView(true)}
              className="p-4 text-white/50 hover:text-gold transition-all bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10"
            >
              <LayoutDashboard size={24} />
            </button>
          )}
          {!user ? (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm tracking-[0.2em] text-white/70 transition-all active:scale-95"
            >
              <UserIcon size={18} />
              <span>登录</span>
            </button>
          ) : (
            <div className="flex items-center gap-4 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <img src={auth.currentUser?.photoURL || ''} className="w-8 h-8 rounded-full border-2 border-gold/30" alt="User" />
              <div className="flex flex-col">
                <span className="text-xs text-white/80 tracking-wider font-medium">{auth.currentUser?.displayName}</span>
                <span className="text-[8px] text-gold/60 tracking-[0.2em] uppercase">Member</span>
              </div>
            </div>
          )}
          
          {settings.cartEnabled && (
            <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-2xl transition-all group shadow-lg">
              <ShoppingCart className="text-gold group-hover:scale-110 transition-transform" size={26} />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-black shadow-[0_0_15px_rgba(197,160,89,0.5)]">
                  {totalCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content - Horizontal Paging */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${activeCategory}-${currentPage}`}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              const threshold = 30; // Reduced threshold for easier swiping on tablets
              if (swipe < -threshold) {
                paginate(1);
              } else if (swipe > threshold) {
                paginate(-1);
              }
            }}
            initial={{ 
              opacity: 0, 
              x: direction > 0 ? 300 : -300,
              scale: 0.95,
              rotateY: direction > 0 ? 15 : -15
            }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: 1,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              x: direction > 0 ? -300 : 300,
              scale: 0.95,
              rotateY: direction > 0 ? -15 : 15
            }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 150,
              mass: 1
            }}
            className="absolute inset-0 preserve-3d cursor-grab active:cursor-grabbing"
          >
            {pages[currentPage]?.type === 'cover' && (
              <CategoryCover category={pages[currentPage].data} bgColor={currentBgColor} />
            )}
            {pages[currentPage]?.type === 'hero' && (
              <LandscapeDishCardHero 
                dish={pages[currentPage].data} 
                onAdd={addToCart} 
                onPlayVideo={setActiveVideo} 
                onShowDetail={setSelectedDish} 
                bgColor={currentBgColor} 
              />
            )}
            {pages[currentPage]?.type === 'grid' && (
              <LandscapeDishCardGrid 
                dishes={pages[currentPage].data} 
                onAdd={addToCart} 
                onPlayVideo={setActiveVideo} 
                onShowDetail={setSelectedDish} 
                bgColor={currentBgColor} 
              />
            )}
            {pages[currentPage]?.type === 'compact-grid' && (
              <LandscapeDishCardCompactGrid 
                dishes={pages[currentPage].data} 
                onAdd={addToCart} 
                onPlayVideo={setActiveVideo} 
                onShowDetail={setSelectedDish} 
                bgColor={currentBgColor} 
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentPage > 0 && (
          <button 
            onClick={() => paginate(-1)}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold transition-all z-40 backdrop-blur-sm"
          >
            <ChevronRight size={32} className="rotate-180" />
          </button>
        )}
        {currentPage < pages.length - 1 && (
          <button 
            onClick={() => paginate(1)}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold transition-all z-40 backdrop-blur-sm"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Back to Start Button (Top Right) */}
        {currentPage > 0 && (
          <button 
            onClick={() => {
              setDirection(-1);
              setCurrentPage(0);
            }}
            className="absolute top-8 right-8 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs tracking-widest text-white/60 transition-all z-50 border border-white/5 backdrop-blur-sm"
          >
            <X size={16} className="rotate-45" />
            <span>返回封面</span>
          </button>
        )}
        {/* Page Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentPage ? 1 : -1);
                setCurrentPage(idx);
              }}
              className={`transition-all duration-500 rounded-full ${
                currentPage === idx 
                ? 'w-10 h-2 bg-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]' 
                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal 
            videoUrl={activeVideo} 
            onClose={() => setActiveVideo(null)} 
          />
        )}
      </AnimatePresence>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <DishDetailModal 
            dish={selectedDish} 
            onAdd={addToCart}
            onPlayVideo={setActiveVideo}
            onClose={() => setSelectedDish(null)}
            bgColor={currentBgColor}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md ${currentBgColor} border-l border-white/10 flex flex-col transition-colors duration-1000`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-2xl font-serif">我的点餐</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Table Selection */}
                <div className="mb-8 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                  <label className="block text-gold text-[10px] tracking-[0.3em] uppercase mb-3">选择桌号 Table Number</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["01", "02", "03", "05", "06", "08", "09", "10"].map(num => (
                      <button
                        key={num}
                        onClick={() => setTableNumber(num)}
                        className={`py-2 rounded border transition-all text-sm font-serif ${tableNumber === num ? 'bg-gold text-black border-gold' : 'border-white/10 text-white/40 hover:border-gold/50'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="或输入桌号..."
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full mt-4 bg-transparent border-b border-white/10 py-2 text-white focus:border-gold outline-none transition-all text-sm"
                  />
                </div>

                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4 py-12">
                    <ShoppingCart size={48} />
                    <p className="tracking-widest">尚未选择菜品</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.dish.id} className="flex gap-4 items-center">
                      <img src={item.dish.image} className="w-16 h-16 object-cover rounded-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-serif">{item.dish.name}</h4>
                        <p className="text-gold">{formatPrice(item.dish.price)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(item.dish.id)} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:border-gold">
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center">{item.count}</span>
                        <button onClick={() => addToCart(item.dish)} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:border-gold">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-white/40 tracking-widest">合计金额</span>
                  <span className="text-3xl font-serif text-gold">{formatPrice(totalAmount)}</span>
                </div>
                <button 
                  onClick={confirmOrder}
                  disabled={cart.length === 0 || isOrdering}
                  className="w-full py-4 bg-gold text-black font-bold tracking-[0.2em] hover:bg-white transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isOrdering ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    "确认下单"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className={`fixed inset-0 z-[100] ${currentBgColor} transition-colors duration-1000 bg-opacity-95 md:hidden flex flex-col items-center justify-center gap-12`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-8 right-8"
            >
              <X size={32} />
            </button>
            <div className="grid grid-cols-2 gap-x-12 gap-y-16">
              {categories.map(cat => {
                const IconComponent = CATEGORY_ICONS[cat.icon];
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsSidebarOpen(false);
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex flex-col items-center gap-3"
                  >
                    <motion.div 
                      className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl ${cat.iconBg || 'bg-orange-500'} ${
                        activeCategory === cat.id ? 'ring-4 ring-gold/40' : ''
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {IconComponent && <IconComponent size={40} className="text-white" strokeWidth={2.5} />}
                    </motion.div>
                    <span className={`text-sm font-medium tracking-widest ${activeCategory === cat.id ? 'text-gold' : 'text-white/60'}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ScaleWrapper>
  );
}
