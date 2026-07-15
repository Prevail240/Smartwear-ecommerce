export type OrderStatus = 'PROCESSING' | 'AVAILABLE FOR PICKUP' | 'EN-ROUTE' | 'DELIVERED' | 'CANCELED' | 'RETURNED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  status: OrderStatus;
  deliveryEstimate: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  paymentDetails: {
    itemsTotal: number;
    deliveryFees: number;
  };
  deliveryMethod: string;
  deliveryAddress: {
    name: string;
    address: string;
    hours?: string;
  };
  shippingDetails: string[];
}

export const mockOrders: Order[] = [
  {
    id: '1624381746',
    date: '07-07-2026',
    total: 15060,
    items: [
      {
        id: 'i1',
        productId: 'p2',
        name: 'AeroKnit Tech Tee',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        size: 'M',
        quantity: 1,
        price: 45.00,
        originalPrice: 55.00,
        status: 'AVAILABLE FOR PICKUP',
        deliveryEstimate: 'Delivered between Tuesday 14 July and Wednesday 15 July'
      },
      {
        id: 'i2',
        productId: 'p4',
        name: 'Stealth Jogger Pants',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        size: 'L',
        quantity: 1,
        price: 65.00,
        originalPrice: 80.00,
        status: 'PROCESSING',
        deliveryEstimate: 'Delivered between Monday 13 July and Tuesday 14 July'
      }
    ],
    paymentMethod: 'Go Cashless: Pay on Delivery via bank transfer',
    paymentDetails: {
      itemsTotal: 110.00,
      deliveryFees: 15.00
    },
    deliveryMethod: 'Pick-up Station',
    deliveryAddress: {
      name: 'Jumia Pickup Station Ilorin-Offa Garage',
      address: 'Shop A15 M & J Shopping complex, Beside Esteem G supermarket, Offa garage Road, Ilorin Kwara State',
      hours: 'Mon-Fri 8am - 7pm; Sat 8am - 6pm'
    },
    shippingDetails: [
      'Shipment 1: Pickup Station. Fulfilled by Smartwear. Delivery between 13 July and 14 July.',
      'Shipment 2: Pickup Station. Fulfilled by Cosmetic Hub. Delivery between 14 July and 15 July.'
    ]
  },
  {
    id: '1624381747',
    date: '05-07-2026',
    total: 299.99,
    items: [
      {
        id: 'i3',
        productId: 'p3',
        name: 'Chronos Smart V2',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        size: 'One Size',
        quantity: 1,
        price: 299.99,
        status: 'DELIVERED',
        deliveryEstimate: 'Delivered on 06 July'
      }
    ],
    paymentMethod: 'Credit / Debit Card',
    paymentDetails: {
      itemsTotal: 299.99,
      deliveryFees: 0.00
    },
    deliveryMethod: 'Home Delivery',
    deliveryAddress: {
      name: 'John Doe',
      address: '12 Victoria Island, Lagos, Nigeria'
    },
    shippingDetails: [
      'Shipment 1: Home Delivery. Fulfilled by Smartwear. Delivered on 06 July.'
    ]
  }
];
