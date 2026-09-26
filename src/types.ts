export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'chai' | 'snacks' | 'cold' | 'combos';
  price: number; // in INR (₹)
  cadPrice?: number; // in CAD ($)
  image?: string;
  fallbackIcon?: string;
  description: string;
  tag?: string; // e.g. "Bestseller", "Chef's Pick", "Immunity", "Kadak Special", "Save 25%"
  isVeg: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Kadak' | 'Feisty';
  servingInfo?: string; // e.g. "Served in Kulhad", "2 Pieces + Dips", "350ml Tall Jar"
  calories?: string;
  customizable?: boolean;
}

export interface CartItemCustomization {
  milk?: string;
  sweetness?: string;
  spice?: string;
  addOns?: string[];
  notes?: string;
}

export interface CartItem {
  cartId: string;
  item: MenuItem;
  quantity: number;
  customization?: CartItemCustomization;
  pricePerUnit: number;
}

export interface CafeLocation {
  id: string;
  name: string;
  city: 'Mumbai' | 'Bengaluru' | 'Delhi NCR' | 'Pune';
  type: string; // e.g. "Flagship", "Work-Friendly", "Heritage Hub", "Garden Cafe"
  address: string;
  timing: string;
  phone: string;
  amenities: string[];
  isOpen: boolean;
  coords: { lat: number; lng: number; x: number; y: number };
  landmark?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  initials: string;
  role: string;
  branch: string;
  rating: number;
  date: string;
  text: string;
  itemsMentioned: string[];
  helpfulCount: number;
  verified: boolean;
  badge?: string;
}

export interface TableBooking {
  id: string;
  location: string;
  date: string;
  session: string;
  timeSlot: string;
  guests: number;
  zone: string;
  fullName: string;
  phone: string;
  email: string;
  occasion?: string;
  notes?: string;
  hasChaiFlight: boolean;
  timestamp: string;
}

export type PageType = 
  | 'home' 
  | 'menu' 
  | 'order' 
  | 'reviews' 
  | 'about' 
  | 'contact' 
  | 'book-table';
