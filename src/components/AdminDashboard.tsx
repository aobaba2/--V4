import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  UtensilsCrossed, 
  Palette, 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  Clock, 
  ChefHat,
  LogOut,
  Image as ImageIcon,
  Video,
  Bell,
  HelpCircle
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { formatPrice } from '../utils';
import { Settings, Category, Dish, Order, OrderItem, CATEGORIES as INITIAL_CATEGORIES, DISHES as INITIAL_DISHES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { writeBatch, getDocs, getDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'site' | 'dishes' | 'beauty' | 'orders'>('site');
  const [isSyncing, setIsSyncing] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    siteName: '巫山烤鱼',
    siteDescription: '地道风味，匠心烤制',
    cartEnabled: true,
    themeTemplate: 'default',
    fontFamily: 'sans',
    primaryColor: '#FF4B2B'
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditingDish, setIsEditingDish] = useState<Dish | null>(null);
  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);

  // Real-time data fetching
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data() as Settings);
    });

    const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('order', 'asc')), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category)));
    });

    const unsubDishes = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      setDishes(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Dish)));
    });

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
    });

    return () => {
      unsubSettings();
      unsubCategories();
      unsubDishes();
      unsubOrders();
    };
  }, []);

  const handleSaveSettings = async () => {
    await setDoc(doc(db, 'settings', 'global'), settings);
    alert('设置已保存');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
  };

  const handleDeleteDish = async (id: string) => {
    if (confirm('确定要删除这个菜品吗？')) {
      await deleteDoc(doc(db, 'dishes', id));
    }
  };

  const handleSaveDish = async (dish: Partial<Dish>) => {
    if (dish.id) {
      await updateDoc(doc(db, 'dishes', dish.id), dish);
    } else {
      const newDish = { ...dish, id: Date.now().toString() };
      await setDoc(doc(db, 'dishes', newDish.id), newDish);
    }
    setIsEditingDish(null);
  };

  const handleSaveCategory = async (category: Partial<Category>) => {
    if (category.id) {
      await updateDoc(doc(db, 'categories', category.id), category);
    } else {
      const newCategory = { ...category, id: Date.now().toString() };
      await setDoc(doc(db, 'categories', newCategory.id), newCategory);
    }
    setIsEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('确定要删除这个分类吗？删除分类可能会导致该分类下的菜品无法显示。')) {
      await deleteDoc(doc(db, 'categories', id));
    }
  };

  const handleSyncInitialData = async () => {
    if (!confirm('这将导入预设的分类和菜品到数据库。如果数据库已有数据，将不会重复导入。是否继续？')) return;
    
    setIsSyncing(true);
    try {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const dishesSnap = await getDocs(collection(db, 'dishes'));

      if (categoriesSnap.empty) {
        const batch = writeBatch(db);
        INITIAL_CATEGORIES.forEach((cat, index) => {
          const catRef = doc(db, 'categories', cat.id);
          batch.set(catRef, { ...cat, order: index });
        });
        await batch.commit();
      }

      if (dishesSnap.empty) {
        const batch = writeBatch(db);
        INITIAL_DISHES.forEach((dish) => {
          const dishRef = doc(db, 'dishes', dish.id);
          batch.set(dishRef, dish);
        });
        await batch.commit();
      }

      alert('数据同步成功！');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('同步失败，请检查网络或权限。');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="text-orange-500" />
            后台管理系统
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('site')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'site' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <SettingsIcon size={20} />
            <span>全站管理</span>
          </button>
          <button 
            onClick={() => setActiveTab('dishes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dishes' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <UtensilsCrossed size={20} />
            <span>菜品管理</span>
          </button>
          <button 
            onClick={() => setActiveTab('beauty')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'beauty' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Palette size={20} />
            <span>全站美化</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ClipboardList size={20} />
            <span>点餐管理</span>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'site' && (
            <motion.div 
              key="site"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl space-y-8"
            >
              <header>
                <h2 className="text-2xl font-bold text-gray-800">全站管理</h2>
                <p className="text-gray-500">修改主页基本参数和全局开关</p>
              </header>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">餐厅名称</label>
                    <input 
                      type="text" 
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">购物车开关</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSettings({ ...settings, cartEnabled: !settings.cartEnabled })}
                        className={`w-14 h-8 rounded-full transition-all relative ${settings.cartEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.cartEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                      <span className="text-sm text-gray-600">{settings.cartEnabled ? '已开启' : '已关闭'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">餐厅描述</label>
                  <textarea 
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-32"
                  />
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-gray-800">数据初始化</h3>
                    <p className="text-xs text-gray-500">如果您的后台没有看到菜品，可以点击下方按钮从预设模板导入。</p>
                    <button 
                      onClick={handleSyncInitialData}
                      disabled={isSyncing}
                      className="mt-2 w-fit bg-gray-100 text-gray-700 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                      {isSyncing ? '同步中...' : '同步预设菜品数据'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSaveSettings}
                  className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"
                >
                  <Save size={20} />
                  保存设置
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'dishes' && (
            <motion.div 
              key="dishes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Category Management */}
              <section className="space-y-6">
                <header className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">分类管理</h2>
                    <p className="text-gray-500">管理菜单的展示分类和顺序</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingCategory({ id: '', name: '', icon: 'Utensils', order: categories.length })}
                    className="bg-orange-50 text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-100 transition-all flex items-center gap-2"
                  >
                    <Plus size={20} />
                    添加分类
                  </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-orange-200 transition-all">
                      <div 
                        onClick={() => {
                          const element = document.getElementById(`dish-category-${cat.id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-all flex-1"
                        title="点击跳转到该分类菜品"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${cat.iconBg || 'bg-orange-500'}`}>
                          <ChefHat size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
                          <p className="text-xs text-gray-400">排序: {cat.order}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => { e.stopPropagation(); setIsEditingCategory(cat); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="编辑分类"><Edit size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="删除分类"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}

                  {/* Uncategorized Shortcut */}
                  {dishes.filter(d => !categories.find(c => c.id === d.category)).length > 0 && (
                    <div 
                      onClick={() => {
                        const element = document.getElementById('dish-category-uncategorized');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-all group"
                      title="点击跳转到未分类菜品"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-400 flex items-center justify-center text-white">
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-600 text-sm">未分类</h3>
                        <p className="text-xs text-gray-400">
                          {dishes.filter(d => !categories.find(c => c.id === d.category)).length} 个菜品
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Dish Management */}
              <section className="space-y-10">
                <header className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">菜品管理</h2>
                    <p className="text-gray-500">按分类管理具体菜品内容</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingDish({ id: '', name: '', price: 0, image: '', description: '', category: categories[0]?.id || '' })}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"
                  >
                    <Plus size={20} />
                    添加菜品
                  </button>
                </header>

                <div className="space-y-12">
                  {categories.map(cat => {
                    const categoryDishes = dishes.filter(d => d.category === cat.id);
                    if (categoryDishes.length === 0) return null;

                    return (
                      <div key={cat.id} id={`dish-category-${cat.id}`} className="space-y-6 scroll-mt-24">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs ${cat.iconBg || 'bg-orange-500'}`}>
                            <ChefHat size={16} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-medium">
                            {categoryDishes.length} 个菜品
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryDishes.map(dish => (
                            <div key={dish.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                              <div className="relative h-48">
                                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                  <button 
                                    onClick={() => setIsEditingDish(dish)}
                                    className="p-2 bg-white rounded-full text-blue-600 shadow-lg hover:scale-110 transition-all"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteDish(dish.id)}
                                    className="p-2 bg-white rounded-full text-red-600 shadow-lg hover:scale-110 transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                  {dish.isHero && <span className="bg-gold text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">招牌</span>}
                                  {dish.isFeatured && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">推荐</span>}
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-gray-800">{dish.name}</h3>
                                  <span className="text-orange-500 font-bold">{formatPrice(dish.price)}</span>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2">{dish.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Uncategorized dishes */}
                  {dishes.filter(d => !categories.find(c => c.id === d.category)).length > 0 && (
                    <div id="dish-category-uncategorized" className="space-y-6 scroll-mt-24">
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-gray-400 flex items-center justify-center text-white text-xs">
                          <HelpCircle size={16} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">未分类菜品</h3>
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-medium">
                          {dishes.filter(d => !categories.find(c => c.id === d.category)).length} 个菜品
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dishes.filter(d => !categories.find(c => c.id === d.category)).map(dish => (
                          <div key={dish.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                            <div className="relative h-48">
                              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => setIsEditingDish(dish)}
                                  className="p-2 bg-white rounded-full text-blue-600 shadow-lg hover:scale-110 transition-all"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteDish(dish.id)}
                                  className="p-2 bg-white rounded-full text-red-600 shadow-lg hover:scale-110 transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="absolute bottom-4 left-4 flex gap-2">
                                {dish.isHero && <span className="bg-gold text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">招牌</span>}
                                {dish.isFeatured && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">推荐</span>}
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-800">{dish.name}</h3>
                                <span className="text-orange-500 font-bold">{formatPrice(dish.price)}</span>
                              </div>
                              <p className="text-gray-500 text-sm line-clamp-2">{dish.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'beauty' && (
            <motion.div 
              key="beauty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl space-y-8"
            >
              <header>
                <h2 className="text-2xl font-bold text-gray-800">全站美化</h2>
                <p className="text-gray-500">自定义主页模板、字体和配色</p>
              </header>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">主页模板</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['default', 'modern', 'minimal'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setSettings({ ...settings, themeTemplate: t })}
                        className={`p-4 border-2 rounded-2xl transition-all text-center ${settings.themeTemplate === t ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="h-24 bg-gray-200 rounded-lg mb-2" />
                        <span className="text-sm font-medium capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">全局字体</label>
                    <select 
                      value={settings.fontFamily}
                      onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      <option value="sans">系统默认 (Sans-serif)</option>
                      <option value="serif">优雅衬线 (Serif)</option>
                      <option value="mono">现代等宽 (Monospace)</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">主题色</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-none"
                      />
                      <span className="text-sm font-mono text-gray-500 uppercase">{settings.primaryColor}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveSettings}
                  className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2"
                >
                  <Save size={20} />
                  应用美化设置
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">点餐管理</h2>
                  <p className="text-gray-500">实时监控餐厅各桌点餐状态</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Bell size={18} className="animate-bounce" />
                    <span className="text-sm font-bold">实时同步中</span>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {orders.map(order => (
                  <div key={order.id} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${
                    order.status === 'pending' ? 'border-l-red-500' : 
                    order.status === 'preparing' ? 'border-l-orange-500' : 
                    order.status === 'served' ? 'border-l-blue-500' : 'border-l-green-500'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-800">{order.tableId}号桌</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'pending' ? 'bg-red-50 text-red-600' : 
                            order.status === 'preparing' ? 'bg-orange-50 text-orange-600' : 
                            order.status === 'served' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {order.status === 'pending' ? '待处理' : 
                             order.status === 'preparing' ? '制作中' : 
                             order.status === 'served' ? '已上菜' : '已结账'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(order.createdAt?.toDate()).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">总计</p>
                        <p className="text-xl font-bold text-orange-500">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{item.name} x {item.quantity}</span>
                          <span className="text-gray-400">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-50">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all"
                        >
                          开始制作
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'served')}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                        >
                          完成上菜
                        </button>
                      )}
                      {order.status === 'served' && (
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                          className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-all"
                        >
                          结账完成
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dish Edit Modal */}
      <AnimatePresence>
        {isEditingDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingDish(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <header className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">{isEditingDish.id ? '编辑菜品' : '添加新菜品'}</h3>
                  <button onClick={() => setIsEditingDish(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">菜品名称</label>
                    <input 
                      type="text" 
                      value={isEditingDish.name}
                      onChange={(e) => setIsEditingDish({ ...isEditingDish, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">价格 (₩)</label>
                    <input 
                      type="number" 
                      value={isEditingDish.price}
                      onChange={(e) => setIsEditingDish({ ...isEditingDish, price: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <p className="text-xs text-orange-500 font-medium">预览: {formatPrice(isEditingDish.price)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">所属分类</label>
                    <select 
                      value={isEditingDish.category}
                      onChange={(e) => setIsEditingDish({ ...isEditingDish, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">图片链接</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <ImageIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input 
                          type="text" 
                          value={isEditingDish.image}
                          onChange={(e) => setIsEditingDish({ ...isEditingDish, image: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <button 
                      onClick={() => setIsEditingDish({ ...isEditingDish, isHero: !isEditingDish.isHero })}
                      className={`w-12 h-6 rounded-full transition-all relative ${isEditingDish.isHero ? 'bg-gold' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEditingDish.isHero ? 'left-7' : 'left-1'}`} />
                    </button>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">设为招牌菜</span>
                      <span className="text-[10px] text-gray-400">在首页顶部大图展示</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <button 
                      onClick={() => setIsEditingDish({ ...isEditingDish, isFeatured: !isEditingDish.isFeatured })}
                      className={`w-12 h-6 rounded-full transition-all relative ${isEditingDish.isFeatured ? 'bg-orange-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEditingDish.isFeatured ? 'left-7' : 'left-1'}`} />
                    </button>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">设为推荐菜</span>
                      <span className="text-[10px] text-gray-400">在首页推荐栏展示</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">视频链接 (可选)</label>
                  <div className="relative">
                    <Video size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      value={isEditingDish.videoUrl || ''}
                      onChange={(e) => setIsEditingDish({ ...isEditingDish, videoUrl: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">菜品描述</label>
                  <textarea 
                    value={isEditingDish.description}
                    onChange={(e) => setIsEditingDish({ ...isEditingDish, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsEditingDish(null)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => handleSaveDish(isEditingDish)}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    保存菜品
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Category Edit Modal */}
      <AnimatePresence>
        {isEditingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <header className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">{isEditingCategory.id ? '编辑分类' : '添加新分类'}</h3>
                  <button onClick={() => setIsEditingCategory(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </header>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">分类名称</label>
                    <input 
                      type="text" 
                      value={isEditingCategory.name}
                      onChange={(e) => setIsEditingCategory({ ...isEditingCategory, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">排序权重 (越小越靠前)</label>
                    <input 
                      type="number" 
                      value={isEditingCategory.order}
                      onChange={(e) => setIsEditingCategory({ ...isEditingCategory, order: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">图标标识 (Lucide Icon Name)</label>
                    <input 
                      type="text" 
                      value={isEditingCategory.icon}
                      onChange={(e) => setIsEditingCategory({ ...isEditingCategory, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="e.g. Utensils, Beer, IceCream"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsEditingCategory(null)}
                    className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => handleSaveCategory(isEditingCategory)}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    保存分类
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
