"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, CreditCard, LogOut, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { products } from '@/data/products';
import styles from './page.module.css';

export default function AccountPage() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    successfulDeliveries: 0,
    favoriteCategory: 'N/A',
    mostViewedCategory: 'N/A',
    mostViewedProduct: 'N/A'
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (user?.uid && isAnalyticsExpanded) {
      const fetchAnalytics = async () => {
        setLoadingAnalytics(true);
        try {
          // 1. Fetch Orders to calculate Total Orders, Deliveries, and Favorite Category
          const ordersRef = collection(db, 'users', user.uid, 'orders');
          const ordersSnap = await getDocs(ordersRef);
          
          let totalOrders = ordersSnap.size;
          let successfulDeliveries = totalOrders; // Simulated as all successful
          
          const categoryCounts: Record<string, number> = {};
          
          ordersSnap.forEach((docSnap) => {
            const orderData = docSnap.data();
            if (orderData.items && Array.isArray(orderData.items)) {
              orderData.items.forEach((item: any) => {
                // We need to look up the category from the product ID
                const prod = products.find(p => p.id === item.productId);
                if (prod) {
                  categoryCounts[prod.category] = (categoryCounts[prod.category] || 0) + item.quantity;
                }
              });
            }
          });

          let favoriteCategory = 'N/A';
          let maxCatCount = 0;
          for (const [cat, count] of Object.entries(categoryCounts)) {
            if (count > maxCatCount) {
              maxCatCount = count;
              favoriteCategory = cat;
            }
          }

          // 2. Fetch View Analytics
          const viewsRef = doc(db, 'users', user.uid, 'analytics', 'views');
          const viewsSnap = await getDoc(viewsRef);
          
          let mostViewedCategory = 'N/A';
          let mostViewedProduct = 'N/A';

          if (viewsSnap.exists()) {
            const data = viewsSnap.data();
            
            // Calculate Most Viewed Category
            if (data.categoryViews) {
              let maxViewCat = 0;
              for (const [cat, count] of Object.entries(data.categoryViews)) {
                if ((count as number) > maxViewCat) {
                  maxViewCat = count as number;
                  mostViewedCategory = cat;
                }
              }
            }

            // Calculate Most Viewed Product
            if (data.productViews) {
              let maxViewProd = 0;
              let topProdId = null;
              for (const [pId, count] of Object.entries(data.productViews)) {
                if ((count as number) > maxViewProd) {
                  maxViewProd = count as number;
                  topProdId = pId;
                }
              }
              if (topProdId) {
                const prod = products.find(p => p.id === topProdId);
                if (prod) mostViewedProduct = prod.name;
              }
            }
          }

          setAnalytics({
            totalOrders,
            successfulDeliveries,
            favoriteCategory,
            mostViewedCategory,
            mostViewedProduct
          });

        } catch (error) {
          console.error("Failed to load analytics", error);
        } finally {
          setLoadingAnalytics(false);
        }
      };

      fetchAnalytics();
    }
  }, [user?.uid, isAnalyticsExpanded]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/signin');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Account</h1>
      
      <div 
        className={styles.profileCard} 
        onClick={() => setIsAnalyticsExpanded(!isAnalyticsExpanded)}
        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
      >
        <div className={styles.avatar}>
          {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className={styles.userInfo} style={{ flex: 1 }}>
          <h2>{profile?.name || 'User'}</h2>
          <p>{profile?.email || 'No email provided'}</p>
        </div>
        <div>
          {isAnalyticsExpanded ? <ChevronUp size={24} color="var(--text-muted)" /> : <ChevronDown size={24} color="var(--text-muted)" />}
        </div>
      </div>

      {isAnalyticsExpanded && (
        <div className={styles.analyticsContainer}>
          <div className={styles.analyticsHeader}>
            <BarChart2 size={20} color="var(--accent-color)" />
            <h3>Your Analytics</h3>
          </div>
          
          {loadingAnalytics ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Calculating stats...</div>
          ) : (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Orders</span>
                <span className={styles.statValue}>{analytics.totalOrders}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Deliveries</span>
                <span className={styles.statValue}>{analytics.successfulDeliveries}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Favorite Category</span>
                <span className={styles.statValue}>{analytics.favoriteCategory}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Top-Viewed Category</span>
                <span className={styles.statValue}>{analytics.mostViewedCategory}</span>
              </div>
              <div className={`${styles.statCard} ${styles.fullWidth}`}>
                <span className={styles.statLabel}>Most Viewed Product</span>
                <span className={styles.statValue}>{analytics.mostViewedProduct}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.menuGrid}>
        <Link href="/orders" className={styles.menuItem}>
          <Package size={24} className={styles.icon} />
          <span>My Orders</span>
        </Link>
        <Link href="/wishlist" className={styles.menuItem}>
          <Heart size={24} className={styles.icon} />
          <span>Wishlist</span>
        </Link>
        <Link href="/account/checkout" className={styles.menuItem}>
          <CreditCard size={24} className={styles.icon} />
          <span>Checkout</span>
        </Link>
        <button className={styles.menuItem} onClick={handleLogout}>
          <LogOut size={24} className={styles.icon} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
