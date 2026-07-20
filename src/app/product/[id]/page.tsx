"use client";

import { useState, use, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ChevronLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './page.module.css';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products, loading } = useProducts();
  const unwrappedParams = use(params);
  const product = products.find(p => p.id === unwrappedParams.id);
  
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const activeImageIndex = 0;
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'One Size');

  useEffect(() => {
    if (product && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  // Track product view in Firestore for real-time analytics
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

  if (loading) {
    return (
      <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product...</p>
      </div>
    );
  }

  if (!product && !loading) {
    notFound();
  }

  // TypeScript needs this explicit return because it doesn't know notFound() throws
  if (!product) {
    return null;
  }

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
      </header>

      {/* Image Gallery (Swipeable implementation via CSS scroll snap) */}
      <div className={styles.galleryContainer}>
        <div className={styles.galleryScroll}>
          {product.images.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`${product.name} - ${idx + 1}`} 
              className={styles.galleryImage} 
            />
          ))}
        </div>
        {product.images.length > 1 && (
          <div className={styles.dots}>
            {product.images.map((_, idx) => (
              <div 
                key={idx} 
                className={`${styles.dot} ${idx === activeImageIndex ? styles.activeDot : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{product.name}</h1>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>
        
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            <Star size={16} fill="#FFC107" color="#FFC107" />
            <span className={styles.ratingNum}>{product.rating}</span>
            <span className={styles.reviews}>({product.reviews} reviews)</span>
          </div>
          <span className={styles.stockStatus}>In Stock</span>
        </div>

        <p className={styles.description}>{product.description}</p>

        {/* Trust Elements */}
        <div className={styles.trustBanner}>
          <div className={styles.trustItem}>
            <Truck size={20} className={styles.trustIcon} />
            <div className={styles.trustText}>
              <span className={styles.trustTitle}>Delivery</span>
              <span className={styles.trustSub}>{product.estimatedDelivery}</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <ShieldCheck size={20} className={styles.trustIcon} />
            <div className={styles.trustText}>
              <span className={styles.trustTitle}>Authentic</span>
              <span className={styles.trustSub}>100% Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div className={styles.sizeSection}>
          <div className={styles.sizeHeader}>
            <h3 className={styles.sizeTitle}>Select Size</h3>
            <button className={styles.sizeChartBtn}>Size Guide</button>
          </div>
          <div className={styles.sizeGrid}>
            {product.sizes.map(size => (
              <button 
                key={size}
                className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className={styles.stickyCta}>
        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
          Add to Cart - {formatPrice(product.price)}
        </button>
      </div>
    </div>
  );
}
