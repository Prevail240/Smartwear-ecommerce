"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { animate, inView } from 'motion';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/* ──────────────────────────────────────────
   Promo Grid Data
   Replace these with your actual promo images
   ────────────────────────────────────────── */
const promoCards = [
  {
    label: "WOMEN'S",
    href: '/category/apparel',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    labelPosition: 'bottom-left' as const,
  },
  {
    label: 'JUSTIN',
    href: '/category/all',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    labelPosition: 'bottom-right' as const,
  },
  {
    label: 'ACCESSORIES',
    href: '/category/watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
    labelPosition: 'bottom-left' as const,
  },
  {
    label: "MEN'S",
    href: '/category/shoes',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
    labelPosition: 'bottom-right' as const,
  },
];

/* ──────────────────────────────────────────
   Landing Page — 2×2 Promo Grid
   ────────────────────────────────────────── */
export default function Home() {
  /* Existing context hooks — preserved as-is */
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const router = useRouter();

  /* Existing shop-now handler */
  const handleShopNow = () => {
    if (user) {
      router.push('/category/all');
    } else {
      router.push('/auth/signin');
    }
  };

  /* Scroll-triggered animations */
  useEffect(() => {
    animate('.promo-card',
      { opacity: [0, 1], y: [40, 0] },
      { duration: 0.6, delay: 0.1 }
    );

    inView('.promo-card', (element) => {
      animate(element,
        { opacity: [0, 1], y: [30, 0] } as any,
        { duration: 0.5, ease: [0.17, 0.55, 0.55, 1] }
      );
    });
  }, [loading]);

  /* Loading State */
  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── 2×2 Promo Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 md:p-5">
        {promoCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="promo-card relative aspect-[4/3] overflow-hidden group"
            style={{ opacity: 0 }}
          >
            {/* Card Image */}
            <img
              src={card.image}
              alt={card.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />

            {/* Category Label */}
            <span
              className={`absolute text-white text-xs font-light tracking-[0.25em] uppercase
                ${card.labelPosition === 'bottom-left'
                  ? 'bottom-4 left-4'
                  : 'bottom-4 right-4'
                }`}
            >
              {card.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
