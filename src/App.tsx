/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  PlayCircle
} from 'lucide-react';
import { CATEGORIES, DISHES, Dish, Category } from './types';

// --- Components ---

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

const DishDetailModal = ({ dish, onAdd, onPlayVideo, onClose }: { dish: Dish; onAdd: (d: Dish) => void; onPlayVideo: (url: string) => void; onClose: () => void }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="relative w-full max-w-4xl bg-deep-red border border-gold/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
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
            <h2 className="font-serif text-4xl text-white mb-4 tracking-wide">{dish.name}</h2>
            <p className="text-gold font-serif text-3xl mb-8">¥{dish.price}</p>
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

const CategoryCover = ({ category }: { category: Category }) => {
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
        <div className="absolute inset-0 bg-gradient-to-b from-deep-red/60 via-transparent to-deep-red/80" />
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
}

const DishCardHero = ({ dish, onAdd, onPlayVideo, onShowDetail }: DishCardProps) => {
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
      <div className="absolute inset-0 bg-gradient-to-t from-deep-red via-deep-red/20 to-transparent" />
      
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
            <span className="text-gold font-serif text-3xl md:text-4xl">¥{dish.price}</span>
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

const DishCardFeatured = ({ dish, onAdd, onPlayVideo, onShowDetail }: DishCardProps) => {
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
            className="w-10 h-10 rounded-full bg-deep-red/80 text-gold hover:bg-gold hover:text-black transition-all flex items-center justify-center backdrop-blur-md border border-gold/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-serif text-2xl text-white group-hover:text-gold transition-colors">{dish.name}</h4>
          <span className="text-gold font-serif text-xl">¥{dish.price}</span>
        </div>
        <p className="text-white/40 text-xs font-light leading-relaxed line-clamp-2">{dish.description}</p>
      </div>
    </div>
  );
};

const DishCardSmall = ({ dish, onAdd, onPlayVideo, onShowDetail }: DishCardProps) => {
  return (
    <div 
      onClick={() => onShowDetail(dish)}
      className="flex gap-5 p-5 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-500 rounded-lg border border-white/5 group cursor-pointer"
    >
      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src={dish.image} 
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {dish.videoUrl && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPlayVideo(dish.videoUrl!);
            }}
            className="absolute inset-0 flex items-center justify-center text-white/0 group-hover:text-gold/90 transition-all bg-black/0 group-hover:bg-black/40"
          >
            <PlayCircle size={32} strokeWidth={1} />
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h5 className="font-serif text-xl mb-1 group-hover:text-gold transition-colors">{dish.name}</h5>
          <p className="text-white/30 text-[10px] tracking-wider mb-2 line-clamp-2 font-light">{dish.description || '匠心烹饪，地道风味'}</p>
          <span className="text-gold font-serif text-lg">¥{dish.price}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd(dish);
          }}
          className="self-end w-10 h-10 rounded-full bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all flex items-center justify-center border border-gold/20"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [cart, setCart] = useState<{ dish: Dish; count: number }[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [isOrdering, setIsOrdering] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const confirmOrder = async () => {
    if (!tableNumber) {
      alert("请选择或输入桌号");
      return;
    }
    if (cart.length === 0) return;

    setIsOrdering(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          items: cart.map(item => ({
            dishId: item.dish.id,
            name: item.dish.name,
            count: item.count,
            price: item.dish.price
          })),
          totalAmount
        })
      });

      if (response.ok) {
        alert("下单成功！请稍候，美味即将上桌。");
        setCart([]);
        setIsCartOpen(false);
        setTableNumber("");
      } else {
        alert("下单失败，请联系服务员。");
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("网络错误，请重试。");
    } finally {
      setIsOrdering(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.dish.price * item.count, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);

  const filteredDishes = DISHES.filter(d => d.category === activeCategory);
  const heroDish = filteredDishes.find(d => d.isHero);
  const featuredDishes = filteredDishes.filter(d => d.isFeatured);
  const regularDishes = filteredDishes.filter(d => !d.isHero && !d.isFeatured);

  return (
    <div className="flex h-screen overflow-hidden bg-deep-red selection:bg-gold/30">
      
      {/* Sidebar Navigation - Tablet/Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-24 md:w-32 bg-deep-red border-r border-white/5 flex flex-col items-center py-12 transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-16">
          <motion.div 
            className="w-16 h-16 border-2 border-gold rounded-full flex items-center justify-center text-gold font-serif text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)]"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            巫
          </motion.div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-8 w-full px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setIsSidebarOpen(false);
                scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative group flex flex-col items-center justify-center w-full aspect-square rounded-xl border transition-all duration-500 ${
                activeCategory === cat.id 
                ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                : 'bg-white/[0.02] border-white/10 hover:border-gold/50 hover:bg-white/[0.05]'
              }`}
            >
              {/* Decorative dot */}
              <div className={`absolute top-2 right-2 w-1 h-1 rounded-full transition-all duration-500 ${activeCategory === cat.id ? 'bg-gold scale-150' : 'bg-white/20'}`} />
              
              {/* Category Icon/Character */}
              <span className={`font-serif text-lg mb-1 transition-colors duration-500 ${activeCategory === cat.id ? 'text-gold' : 'text-white/40 group-hover:text-gold/70'}`}>
                {cat.name.charAt(0)}
              </span>
              
              {/* Category Name (Vertical but button-style) */}
              <span className={`text-[10px] tracking-[0.2em] transition-colors duration-500 ${activeCategory === cat.id ? 'text-gold' : 'text-white/30 group-hover:text-white/60'}`}>
                {cat.name}
              </span>

              {/* Active Indicator Line */}
              {activeCategory === cat.id && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -left-4 w-1 h-8 bg-gold rounded-r-full shadow-[0_0_10px_rgba(197,160,89,0.8)]"
                />
              )}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto flex flex-col gap-6 opacity-20">
          <Phone size={18} className="hover:text-gold transition-colors cursor-pointer" />
          <MapPin size={18} className="hover:text-gold transition-colors cursor-pointer" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        ref={scrollContainerRef}
        className="flex-1 ml-0 md:ml-32 overflow-y-auto scroll-smooth bg-deep-red"
      >
        {/* Persistent Header */}
        <header className="sticky top-0 left-0 right-0 z-40 h-24 px-6 md:px-12 flex items-center justify-between glass-panel border-b border-gold/10">
          <div className="flex items-center gap-6">
            <button className="md:hidden text-gold" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={28} />
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 border-2 border-gold rounded-full items-center justify-center text-gold font-serif text-2xl shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                巫
              </div>
              <div className="flex flex-col">
                <h1 className="font-serif text-2xl md:text-3xl tracking-[0.3em] text-gold uppercase drop-shadow-sm">巫山烤全鱼</h1>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-gold/30" />
                  <span className="text-[9px] tracking-[0.5em] text-white/50 uppercase font-medium">Wushan Roasted Fish</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button className="hidden lg:flex items-center gap-3 text-white/40 hover:text-gold transition-all group">
              <Search size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs tracking-[0.2em] font-light">搜索珍馐</span>
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-gold/5 hover:bg-gold/10 border border-gold/20 rounded-full transition-all group">
              <ShoppingCart className="text-gold group-hover:scale-110 transition-transform" size={22} />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-black text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-deep-red shadow-lg">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Category Cover Section */}
        <CategoryCover 
          category={CATEGORIES.find(c => c.id === activeCategory)!} 
        />

        {/* Dishes List Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-32">
          
          {activeCategory === 'all' ? (
            <>
              {/* Signature Section for Home */}
              <section>
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-16 h-[1px] bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                  <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-[0.3em] uppercase drop-shadow-sm">主厨珍藏 Signature</h2>
                </div>
                <div className="space-y-16">
                  {DISHES.filter(d => d.isHero).map(dish => (
                    <DishCardHero key={dish.id} dish={dish} onAdd={addToCart} onPlayVideo={(url) => setActiveVideo(url)} onShowDetail={setSelectedDish} />
                  ))}
                </div>
              </section>

              {/* Featured Grid */}
              <section>
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-16 h-[1px] bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                  <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-[0.3em] uppercase drop-shadow-sm">人气推荐 Featured</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {DISHES.filter(d => d.isFeatured).map(dish => (
                    <DishCardFeatured key={dish.id} dish={dish} onAdd={addToCart} onPlayVideo={(url) => setActiveVideo(url)} onShowDetail={setSelectedDish} />
                  ))}
                </div>
              </section>

              {/* All Dishes List */}
              <section>
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-16 h-[1px] bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
                  <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-[0.3em] uppercase drop-shadow-sm">全品菜单 All Dishes</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {DISHES.filter(d => !d.isHero && !d.isFeatured).map(dish => (
                    <DishCardSmall key={dish.id} dish={dish} onAdd={addToCart} onPlayVideo={(url) => setActiveVideo(url)} onShowDetail={setSelectedDish} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Category Header */}
              <div className="flex flex-col items-center text-center mb-24">
                <span className="text-gold text-xs tracking-[0.8em] uppercase mb-6 opacity-60">Category Selection</span>
                <h2 className="font-serif text-5xl md:text-8xl text-white tracking-[0.2em] mb-8 drop-shadow-lg">
                  {CATEGORIES.find(c => c.id === activeCategory)?.name}
                </h2>
                <div className="w-32 h-[1px] bg-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.2)]" />
              </div>

              {/* Category Dishes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredDishes.map(dish => (
                  <DishCardFeatured key={dish.id} dish={dish} onAdd={addToCart} onPlayVideo={(url) => setActiveVideo(url)} onShowDetail={setSelectedDish} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="py-24 px-12 border-t border-white/5 text-center opacity-20">
          <p className="text-sm tracking-[0.5em] mb-4 uppercase">Wushan Roasted Fish</p>
          <p className="text-xs tracking-widest">© 2026 巫山烤全鱼 · 匠心传承 · 烟火煨春秋</p>
        </footer>
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
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-deep-red border-l border-white/10 flex flex-col"
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
                        <p className="text-gold">¥{item.dish.price}</p>
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
                  <span className="text-3xl font-serif text-gold">¥{totalAmount}</span>
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
            className="fixed inset-0 z-[100] bg-deep-red/95 md:hidden flex flex-col items-center justify-center gap-12"
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
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setIsSidebarOpen(false);
                  scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-3xl font-serif tracking-widest ${activeCategory === cat.id ? 'text-gold' : 'text-white/40'}`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
