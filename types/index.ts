export type ArtworkCategory =
  | 'pencil'
  | 'charcoal'
  | 'hyper_realistic'
  | 'couple'
  | 'family'
  | 'celebrity'
  | 'pet'
  | 'custom';

export type ArtworkMedium = 'pencil' | 'charcoal' | 'colour';

export interface Artwork {
  id: string;
  title: string;
  category: ArtworkCategory;
  medium: ArtworkMedium;
  description: string | null;
  size: string | null;
  price: number | null;
  year: number | null;
  image_url: string;
  featured: boolean;
  published: boolean;
  watermark: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images?: ArtworkImage[];
}

export interface ArtworkImage {
  id: string;
  artwork_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export type PricingRuleType =
  | 'base'
  | 'medium'
  | 'size'
  | 'framing'
  | 'extra_person'
  | 'add_on';

export interface PricingRule {
  id: string;
  type: PricingRuleType;
  key: string;
  label: string;
  numeric_value: number;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export type OrderStatus =
  | 'new'
  | 'payment_pending'
  | 'confirmed'
  | 'drawing_in_progress'
  | 'completed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export type DeadlineType = 'flexible' | 'preferred_date' | 'urgent';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  medium: string;
  size: string;
  people_count: number;
  framing: string;
  deadline_type: DeadlineType;
  deadline_date: string | null;
  special_instructions: string | null;
  estimated_price: number;
  final_price: number | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  images?: OrderImage[];
}

export interface OrderImage {
  id: string;
  order_id: string;
  image_url: string;
  storage_path: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  review: string;
  image_url: string | null;
  portrait_image_url: string | null;
  rating: number;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export type PricingRulesMap = Record<PricingRuleType, PricingRule[]>;

export interface PriceCalculation {
  base: number;
  mediumAdjustment: number;
  sizeAdjustment: number;
  extraPeople: number;
  framing: number;
  addOns: number;
  expressFee: number;
  total: number;
}

export interface PriceCalculatorInput {
  medium: string;
  size: string;
  peopleCount: number;
  framing: string;
  deadlineType: DeadlineType;
  addOns: string[];
}
