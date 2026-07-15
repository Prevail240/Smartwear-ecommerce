export type ProductCategory = 'shoes' | 'apparel' | 'watches';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  inStock: boolean;
  estimatedDelivery: string;
}

export const products: Product[] = [
  // --- ORIGINAL PRODUCTS ---
  {
    id: 'p1',
    name: 'Obsidian Run X1',
    category: 'shoes',
    brand: 'Nike',
    price: 120.00,
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'High-performance running shoes with adaptive cushioning and premium breathable mesh. Designed for both speed and comfort.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 'p2',
    name: 'AeroKnit Tech Tee',
    category: 'apparel',
    brand: 'Under Armour',
    price: 45.00,
    rating: 4.6,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Seamless construction and moisture-wicking technology keep you cool and dry during intense workouts.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 'p3',
    name: 'Chronos Smart V2',
    category: 'watches',
    brand: 'Garmin',
    price: 299.99,
    rating: 4.9,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Advanced fitness tracking, heart rate monitoring, and GPS in a sleek obsidian aerospace-grade aluminum casing.',
    sizes: ['One Size'],
    inStock: true,
    estimatedDelivery: 'Next Day Delivery'
  },
  {
    id: 'p4',
    name: 'Stealth Jogger Pants',
    category: 'apparel',
    brand: 'Lululemon',
    price: 65.00,
    rating: 4.5,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Tapered fit joggers with four-way stretch and secure zip pockets. Perfect for training or casual wear.',
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    estimatedDelivery: '3-5 Business Days'
  },
  {
    id: 'p5',
    name: 'Velocity Track Jacket',
    category: 'apparel',
    brand: 'Adidas',
    price: 85.00,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Lightweight, wind-resistant track jacket with reflective details for low-light visibility.',
    sizes: ['S', 'M', 'L'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 'p6',
    name: 'Titanium Sport Band',
    category: 'watches',
    brand: 'Garmin',
    price: 49.99,
    rating: 4.4,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Durable and breathable replacement band for your Chronos Smart watch. Secure fit for intense activities.',
    sizes: ['S/M', 'M/L'],
    inStock: true,
    estimatedDelivery: 'Standard Delivery'
  },

  // --- NEW GENERATED SHOES ---
  {
    id: 's1',
    name: 'Neon Sprint 360',
    category: 'shoes',
    brand: 'Nike',
    price: 135.00,
    rating: 4.7,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Neon accented sprint shoes designed for track athletes. Features an ultra-light carbon fiber sole.',
    sizes: ['7', '8', '9', '10', '11'],
    inStock: true,
    estimatedDelivery: '2-4 Business Days'
  },
  {
    id: 's2',
    name: 'Urban Glide Canvas',
    category: 'shoes',
    brand: 'Vans',
    price: 85.00,
    rating: 4.3,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Casual streetwear canvas shoes with memory foam insoles for all-day city walking.',
    sizes: ['8', '9', '10', '11', '12'],
    inStock: true,
    estimatedDelivery: '3-5 Business Days'
  },
  {
    id: 's3',
    name: 'Terra Hike Pro',
    category: 'shoes',
    brand: 'Salomon',
    price: 155.00,
    rating: 4.9,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Waterproof hiking boots with aggressive tread patterns for ultimate grip on rugged terrain.',
    sizes: ['9', '10', '11', '12', '13'],
    inStock: false,
    estimatedDelivery: 'Out of Stock'
  },
  {
    id: 's4',
    name: 'Court Ace Classics',
    category: 'shoes',
    brand: 'Adidas',
    price: 95.00,
    rating: 4.6,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Timeless white leather tennis shoes that pair perfectly with any athletic or casual outfit.',
    sizes: ['6', '7', '8', '9', '10'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 's5',
    name: 'Aura Cloud Sneakers',
    category: 'shoes',
    brand: 'Allbirds',
    price: 110.00,
    rating: 4.8,
    reviews: 425,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Feather-light slip-on sneakers with a knitted upper and maximum energy-return foam.',
    sizes: ['7', '8', '9', '10', '11'],
    inStock: true,
    estimatedDelivery: 'Next Day Delivery'
  },

  // --- NEW GENERATED APPAREL ---
  {
    id: 'a1',
    name: 'HyperFlex Leggings',
    category: 'apparel',
    brand: 'Lululemon',
    price: 55.00,
    rating: 4.8,
    reviews: 560,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Squat-proof, high-waisted leggings engineered with compression zones for muscle support.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 'a2',
    name: 'Core Essential Hoodie',
    category: 'apparel',
    brand: 'Nike',
    price: 75.00,
    rating: 4.5,
    reviews: 230,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Heavyweight cotton-blend hoodie with a minimalist logo and brushed fleece interior.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    estimatedDelivery: '3-5 Business Days'
  },
  {
    id: 'a3',
    name: 'Breeze Running Shorts',
    category: 'apparel',
    brand: 'Under Armour',
    price: 35.00,
    rating: 4.4,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Ultra-lightweight split shorts featuring a built-in liner and hidden key pocket.',
    sizes: ['S', 'M', 'L'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 'a4',
    name: 'Thermal Base Layer',
    category: 'apparel',
    brand: 'Patagonia',
    price: 48.00,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Long-sleeve thermal top designed to trap heat during winter training sessions.',
    sizes: ['M', 'L', 'XL'],
    inStock: false,
    estimatedDelivery: 'Out of Stock'
  },
  {
    id: 'a5',
    name: 'Reflect Windbreaker',
    category: 'apparel',
    brand: 'The North Face',
    price: 95.00,
    rating: 4.6,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1559551409-dadc959f76b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'A 360-degree reflective jacket that shields against rain and keeps you visible at night.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    estimatedDelivery: 'Next Day Delivery'
  },

  // --- NEW GENERATED WATCHES ---
  {
    id: 'w1',
    name: 'Apex Diver Pro',
    category: 'watches',
    brand: 'Rolex',
    price: 450.00,
    rating: 4.9,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Professional dive watch rated for 500m depth with a luminous dial and rotating ceramic bezel.',
    sizes: ['One Size'],
    inStock: true,
    estimatedDelivery: 'Next Day Delivery'
  },
  {
    id: 'w2',
    name: 'Vanguard Chronograph',
    category: 'watches',
    brand: 'Omega',
    price: 275.00,
    rating: 4.7,
    reviews: 154,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Classic three-dial chronograph featuring a genuine leather strap and sapphire crystal glass.',
    sizes: ['One Size'],
    inStock: true,
    estimatedDelivery: '3-5 Business Days'
  },
  {
    id: 'w3',
    name: 'Pulse Fitness Band',
    category: 'watches',
    brand: 'Fitbit',
    price: 85.00,
    rating: 4.3,
    reviews: 410,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Slim, discreet fitness tracker focused purely on step counting, sleep tracking, and basic notifications.',
    sizes: ['One Size'],
    inStock: true,
    estimatedDelivery: '2-3 Business Days'
  },
  {
    id: 'w4',
    name: 'Eclipse Solar Watch',
    category: 'watches',
    brand: 'Seiko',
    price: 195.00,
    rating: 4.8,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Never change a battery again. This sleek analog watch recharges infinitely using ambient light.',
    sizes: ['One Size'],
    inStock: false,
    estimatedDelivery: 'Out of Stock'
  },
  {
    id: 'w5',
    name: 'Horizon GMT',
    category: 'watches',
    brand: 'Tudor',
    price: 320.00,
    rating: 4.6,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    description: 'Designed for global travelers, tracking two time zones simultaneously on a striking blue dial.',
    sizes: ['One Size'],
    inStock: true,
    estimatedDelivery: '2-4 Business Days'
  }
];
