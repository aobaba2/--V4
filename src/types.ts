import { LucideIcon } from 'lucide-react';

export interface Settings {
  siteName: string;
  siteDescription: string;
  cartEnabled: boolean;
  themeTemplate: string;
  fontFamily: string;
  primaryColor: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'admin' | 'user';
}

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'served' | 'completed';
  createdAt: any;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  image: string;
  videoUrl?: string;
  description?: string;
  category: string;
  isHero?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  enName?: string;
  coverImage?: string;
  coverVideo?: string;
  description?: string;
  icon: string;
  iconBg?: string;
  order?: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: '精选推荐',
    enName: 'Signature Selection',
    coverImage: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=1000',
    description: '匠心烤制 巫山风味',
    icon: 'Star',
    iconBg: 'bg-[#FF4B2B]' // Vibrant Red-Orange
  },
  {
    id: 'northeast',
    name: '东北菜',
    enName: 'Northeast Cuisine',
    coverImage: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=1000',
    description: '地道东北味 份大实惠',
    icon: 'Mountain',
    iconBg: 'bg-[#E52D27]' // Vibrant Red
  },
  {
    id: 'sichuan',
    name: '巴蜀川菜',
    enName: 'Sichuan Cuisine',
    coverImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000',
    description: '麻辣鲜香 蜀味无穷',
    icon: 'FlameKindling',
    iconBg: 'bg-[#FDC830]' // Vibrant Yellow
  },
  {
    id: 'bar-snacks',
    name: '火辣下酒菜',
    enName: 'Spicy Bar Snacks',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
    description: '火辣过瘾 绝佳下酒',
    icon: 'Zap',
    iconBg: 'bg-[#00B4DB]' // Vibrant Blue
  },
  {
    id: 'appetizers',
    name: '开胃凉菜',
    enName: 'Appetizers',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
    description: '清爽开胃 唤醒味蕾',
    icon: 'IceCream',
    iconBg: 'bg-[#00D2FF]' // Vibrant Cyan/Blue
  },
  {
    id: 'staple',
    name: '美味主食',
    enName: 'Delicious Staple',
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=1000',
    description: '饱腹之选 营养美味',
    icon: 'Utensils',
    iconBg: 'bg-[#FF9F43]' // Vibrant Orange
  },
  {
    id: 'drinks',
    name: '清爽饮品',
    enName: 'Refreshing Drinks',
    coverImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1000',
    description: '冰爽解辣 畅饮无限',
    icon: 'GlassWater',
    iconBg: 'bg-[#48DBFB]' // Vibrant Cyan
  }
];

export const DISHES: Dish[] = [
  // 招牌烤鱼 -> 东北菜
  {
    id: '1',
    name: '巫山麻辣烤全鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-professional-kitchen-41624-large.mp4',
    description: '选用三斤以上鲜活草鱼，秘制麻辣底料，炭火慢烤，皮脆肉嫩。',
    category: 'northeast',
    isHero: true,
    isFeatured: true
  },
  {
    id: '2',
    name: '黄金蒜香烤全鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-being-chopped-on-a-wooden-board-41626-large.mp4',
    description: '浓郁蒜香，不辣星人的最爱，蒜泥金黄诱人，鱼肉鲜甜。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: '3',
    name: '秘制豆豉烤全鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-frying-meat-in-a-pan-41625-large.mp4',
    description: '精选优质豆豉，醇厚咸鲜，风味独特，回味悠长。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'f1',
    name: '招牌红烧肉',
    price: 68,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000',
    description: '肥而不腻，入口即化，色泽红亮，经典本帮风味。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'f2',
    name: '清蒸大闸蟹',
    price: 88,
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&q=80&w=1000',
    description: '鲜美无比，膏红肉满，搭配秘制姜醋汁。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'f3',
    name: '松鼠桂鱼',
    price: 158,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000',
    description: '外脆内嫩，酸甜适口，造型优美，宴请首选。',
    category: 'northeast',
    isFeatured: true
  },
  // 配菜 -> 巴蜀川菜
  {
    id: '4',
    name: '黄金腐竹',
    price: 12,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1000',
    description: '吸满烤鱼汤汁的腐竹，口感筋道，豆香浓郁。',
    category: 'sichuan',
    isFeatured: true
  },
  {
    id: '5',
    name: '爽脆黑木耳',
    price: 10,
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=1000',
    description: '清爽解腻，口感爽脆，是烤鱼的绝佳伴侣。',
    category: 'sichuan'
  },
  {
    id: '6',
    name: '鲜嫩魔芋',
    price: 15,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    description: 'Q弹爽滑，低脂健康，吸收汤汁后极其入味。',
    category: 'sichuan'
  },
  {
    id: 'f4',
    name: '麻婆豆腐',
    price: 28,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=1000',
    description: '麻辣烫鲜香酥嫩，川菜经典，下饭神器。',
    category: 'sichuan',
    isFeatured: true
  },
  // 凉菜 -> 火辣下酒菜
  {
    id: '7',
    name: '口水鸡',
    price: 38,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-professional-kitchen-41624-large.mp4',
    description: '皮爽肉滑，麻辣鲜香，红油透亮，让人食欲大增。',
    category: 'bar-snacks',
    isHero: true,
    isFeatured: true
  },
  {
    id: '8',
    name: '拍黄瓜',
    price: 18,
    image: 'https://images.unsplash.com/photo-1563117504-715df33d3f2a?auto=format&fit=crop&q=80&w=600',
    description: '清脆爽口，酸辣适中，解辣神器。',
    category: 'bar-snacks',
    isFeatured: true
  },
  {
    id: 'f5',
    name: '夫妻肺片',
    price: 48,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
    description: '质嫩味鲜，麻辣浓香，色泽红亮。',
    category: 'bar-snacks',
    isFeatured: true
  },
  // 凉菜 -> 开胃凉菜
  {
    id: '9',
    name: '酸梅汤',
    price: 15,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=600',
    description: '古法熬制，冰镇口感，生津止渴，解辣必备。',
    category: 'appetizers',
    isFeatured: true
  },
  {
    id: '10',
    name: '冰镇啤酒',
    price: 12,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
    description: '清爽麦香，冰凉入心，烤鱼的最佳拍档。',
    category: 'appetizers'
  },
  // 美味主食
  {
    id: '11',
    name: '黄金蛋炒饭',
    price: 22,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600',
    description: '粒粒分明，蛋香浓郁，火候十足。',
    category: 'staple',
    isFeatured: true
  },
  {
    id: '12',
    name: '手工水饺',
    price: 28,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600',
    description: '皮薄馅大，鲜嫩多汁，纯手工制作。',
    category: 'staple'
  },
  // 清爽饮品
  {
    id: '13',
    name: '鲜榨西瓜汁',
    price: 18,
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=600',
    description: '新鲜西瓜现榨，清甜解渴。',
    category: 'drinks',
    isFeatured: true
  },
  {
    id: '14',
    name: '柠檬红茶',
    price: 12,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600',
    description: '酸甜适口，冰爽怡人。',
    category: 'drinks'
  },
  // 更多火锅类菜品用于精选推荐 3x2 网格
  {
    id: 'h1',
    name: '捞派毛肚',
    price: 80,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1000',
    description: '推荐麻辣锅，口感爽脆。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h2',
    name: '藤椒味千丝牛肉',
    price: 52,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000',
    description: '牛肉新吃法，您可以试试。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h3',
    name: '呼伦贝尔草原肥牛',
    price: 68,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000',
    description: '源自呼伦贝尔大草原的美味。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h4',
    name: '火锅牛排',
    price: 30,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000',
    description: '口感细嫩有嚼劲。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h5',
    name: '内蒙古草原羔羊肉',
    price: 29,
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=1000',
    description: '肉香味美，肥瘦适中。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h6',
    name: '捞派肥牛',
    price: 67,
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=1000',
    description: '肉质鲜嫩，久煮不老。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h7',
    name: '鲜嫩虾滑',
    price: 48,
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&q=80&w=1000',
    description: '纯手工打制，Q弹爽滑。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h8',
    name: '脆爽黄喉',
    price: 35,
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=1000',
    description: '口感极佳，火锅必点。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h9',
    name: '精品鸭肠',
    price: 28,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000',
    description: '七上八下，脆嫩爽口。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h10',
    name: '手打牛肉丸',
    price: 32,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=1000',
    description: '爆汁口感，劲道十足。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h11',
    name: '鲜切羊肉',
    price: 58,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000',
    description: '现切现卖，新鲜看得见。',
    category: 'northeast',
    isFeatured: true
  },
  {
    id: 'h12',
    name: '深海鱼片',
    price: 42,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000',
    description: '肉质洁白，入口即化。',
    category: 'northeast',
    isFeatured: true
  }
];
