"use client";

import { useState, use, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, ChevronDown, MapPin } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/* ──────────────────────────────────────────
   Color Swatch Data
   Add your real color variants here
   ────────────────────────────────────────── */
const colorSwatches = [
  { name: 'Black', hex: '#000000' },
  { name: 'Navy', hex: '#1a1a5e' },
  { name: 'Dark Blue', hex: '#0d47a1' },
  { name: 'Forest Green', hex: '#0e6e3a' },
];

/* ──────────────────────────────────────────
   Product Detail Page
   Matches the 45XL design mockup (right screen)
   ────────────────────────────────────────── */
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products, loading } = useProducts();
  const unwrappedParams = use(params);
  const product = products.find(p => p.id === unwrappedParams.id);

  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'One Size');
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0].name);
  const [activeTab, setActiveTab] = useState<'details' | 'size-guide' | 'other'>('details');
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  /* Sync size when product loads */
  useEffect(() => {
    if (product && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  /* Track product view in Firestore for real-time analytics — preserved logic */
  useEffect(() => {
    if (user?.uid && product) {
      const trackView = async () => {
        try {
          const analyticsRef = doc(db, 'users', user.uid, 'analytics', 'views');
          const analyticsDoc = await getDoc(analyticsRef);

          if (!analyticsDoc.exists()) {
            await setDoc(analyticsRef, {
              productViews: { [product.id]: 1 },
              categoryViews: { [product.category]: 1 }
            });
          } else {
            await updateDoc(analyticsRef, {
              [`productViews.${product.id}`]: increment(1),
              [`categoryViews.${product.category}`]: increment(1)
            });
          }
        } catch (error) {
          console.error("Failed to track view in Firestore", error);
        }
      };

      trackView();
    }
  }, [user?.uid, product]);

  /* Loading state */
  if (loading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading product...</p>
      </div>
    );
  }

  if (!product && !loading) {
    notFound();
  }

  if (!product) {
    return null;
  }

  /* Existing add-to-cart handler — preserved */
  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    addToCart(product, 1, selectedSize);
    showToast(`Added ${product.name} to cart`, 'success');
    router.push('/cart');
  };

  /* Calculate a fake "original" price for the strikethrough (design shows $50 / $85) */
  const originalPrice = product.price * 1.7;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* ── Two-Column Layout ── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">

          {/* ── LEFT: Image Gallery ── */}
          <div className="md:w-[45%] shrink-0">
            {/* Main Product Image */}
            <div className="bg-gray-50 rounded-sm overflow-hidden aspect-[3/4] flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-sm overflow-hidden border-2 transition-colors
                      ${idx === activeImageIndex
                        ? 'border-[#4A0E8F]'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="md:w-[55%] flex flex-col gap-4">
            {/* Product Name */}
            <div>
              <h1 className="text-lg font-semibold text-black leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {product.description}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-black">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>

            {/* ── Size Selector ── */}
            <div className="flex items-center gap-2">
              <span className="bg-[#E67E22] text-white text-xs font-semibold px-4 py-1.5 rounded-sm">
                Size
              </span>
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="appearance-none bg-[#350A6E] text-white text-xs font-medium pl-3 pr-7 py-1.5 rounded-sm cursor-pointer outline-none"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>

            {/* ── Detail Tabs ── */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'details' as const, label: 'product details' },
                { key: 'size-guide' as const, label: 'Size guide' },
                { key: 'other' as const, label: 'other details' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors
                    ${activeTab === tab.key
                      ? 'border-black text-black font-medium'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Add to Cart + Wishlist Row ── */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAddToCart}
                className="bg-[#E67E22] hover:bg-[#D35400] text-white text-sm font-semibold px-5 py-2.5 rounded-sm flex items-center gap-2 transition-colors"
              >
                <ShoppingCart size={16} />
                add to cart
              </button>
              {/* Wishlist / Save button — wire your existing wishlist logic here */}
              <button
                className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center hover:border-gray-500 transition-colors"
                /* onClick={() => toggleWishlist(product)} */
              >
                <MapPin size={18} className="text-gray-600" />
              </button>
            </div>

            {/* ── Color Swatches ── */}
            <div>
              <h3 className="text-sm font-medium text-black mb-2">Colors</h3>
              <div className="flex items-center gap-2">
                {colorSwatches.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all
                      ${selectedColor === color.name
                        ? 'border-[#E67E22] scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                      }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* ── Delivery Details (Expandable) ── */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-black"
              >
                <span className="italic">delivery details</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isDeliveryOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDeliveryOpen && (
                <div className="mt-2 text-xs text-gray-600 leading-relaxed space-y-0.5">
                  <p>Standard Lagos Delivery $1.99</p>
                  <p>Free for orders over $100.00. Order today, to receive on or before</p>
                  <p>Saturday, 25th July.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
