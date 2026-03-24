import { LucideIcon } from 'lucide-react';

export interface Dish {
  id: string;
  name: string;
  price: number;
  image: string;
  videoUrl?: string;
  description?: string;
  category: string;
  isHero?: boolean; // Large display like in the images
  isFeatured?: boolean; // Medium display
}

export interface Category {
  id: string;
  name: string;
  enName: string;
  coverImage: string;
  coverVideo?: string;
  description?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: '精选推荐',
    enName: 'Signature Selection',
    coverImage: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=1000',
    description: '匠心烤制 巫山风味'
  },
  {
    id: 'roasted-fish',
    name: '招牌烤鱼',
    enName: 'Signature Roasted Fish',
    coverImage: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=1000',
    description: '外焦里嫩 鲜香四溢'
  },
  {
    id: 'side-dishes',
    name: '经典配菜',
    enName: 'Classic Sides',
    coverImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000',
    description: '荤素搭配 营养均衡'
  },
  {
    id: 'cold-dishes',
    name: '开胃凉菜',
    enName: 'Appetizers',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
    description: '清爽解腻 唤醒味蕾'
  },
  {
    id: 'drinks',
    name: '清爽饮品',
    enName: 'Refreshing Drinks',
    coverImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1000',
    description: '冰爽解辣 畅饮无限'
  }
];

export const DISHES: Dish[] = [
  // 招牌烤鱼
  {
    id: '1',
    name: '巫山麻辣烤全鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-professional-kitchen-41624-large.mp4',
    description: '选用三斤以上鲜活草鱼，秘制麻辣底料，炭火慢烤，皮脆肉嫩。',
    category: 'roasted-fish',
    isHero: true
  },
  {
    id: '2',
    name: '黄金蒜香烤全鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-being-chopped-on-a-wooden-board-41626-large.mp4',
    description: '浓郁蒜香，不辣星人的最爱，蒜泥金黄诱人，鱼肉鲜甜。',
    category: 'roasted-fish',
    isFeatured: true
  },
  {
    id: '3',
    name: '秘制豆豉烤全鱼',
    price: 128,
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-frying-meat-in-a-pan-41625-large.mp4',
    description: '精选优质豆豉，醇厚咸鲜，风味独特，回味悠长。',
    category: 'roasted-fish',
    isFeatured: true
  },
  // 配菜
  {
    id: '4',
    name: '黄金腐竹',
    price: 12,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1000',
    description: '吸满烤鱼汤汁的腐竹，口感筋道，豆香浓郁。',
    category: 'side-dishes'
  },
  {
    id: '5',
    name: '爽脆黑木耳',
    price: 10,
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=1000',
    description: '清爽解腻，口感爽脆，是烤鱼的绝佳伴侣。',
    category: 'side-dishes'
  },
  {
    id: '6',
    name: '鲜嫩魔芋',
    price: 15,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    description: 'Q弹爽滑，低脂健康，吸收汤汁后极其入味。',
    category: 'side-dishes'
  },
  // 凉菜
  {
    id: '7',
    name: '口水鸡',
    price: 38,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-professional-kitchen-41624-large.mp4',
    description: '皮爽肉滑，麻辣鲜香，红油透亮，让人食欲大增。',
    category: 'cold-dishes',
    isHero: true
  },
  {
    id: '8',
    name: '拍黄瓜',
    price: 18,
    image: 'https://images.unsplash.com/photo-1563117504-715df33d3f2a?auto=format&fit=crop&q=80&w=600',
    description: '清脆爽口，酸辣适中，解辣神器。',
    category: 'cold-dishes'
  },
  // 饮品
  {
    id: '9',
    name: '酸梅汤',
    price: 15,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=600',
    description: '古法熬制，冰镇口感，生津止渴，解辣必备。',
    category: 'drinks'
  },
  {
    id: '10',
    name: '冰镇啤酒',
    price: 12,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
    description: '清爽麦香，冰凉入心，烤鱼的最佳拍档。',
    category: 'drinks'
  }
];
