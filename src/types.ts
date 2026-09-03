export interface MenuItem {
  id: string;
  name: string;
  category: 'Cool Cakes' | 'Normal Cakes' | 'Special Items' | 'Theme Cakes' | 'PhotoPrint Cakes' | 'Puffs' | 'Rolls' | 'Biscuits' | 'Special Snacks';
  subCategory?: string;
  price: number;
  description: string;
  imageUrl: string;
  inStock: number;
  isSeasonal?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: string;
  customMessage?: string;
}

export type OrderStatus = 'Received' | 'Ready' | 'Out Of Stock';

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  loyaltyPointsSpent: number;
  loyaltyPointsEarned: number;
  isCustomThemeCake?: boolean;
  customThemeDetails?: {
    flavour: string;
    sponge: string;
    weight: string;
    message: string;
    color: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  loyaltyPoints: number;
  savedFavorites: string[]; // List of MenuItem ids
}

export interface StoreSettings {
  openingHours: {
    weekdays: string;
    weekends: string;
  };
  contactPhone: string;
  address: string;
  lowStockThreshold: number;
}
