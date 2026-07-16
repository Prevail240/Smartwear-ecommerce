"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, Package, Inbox, User, X, ChevronDown, ChevronUp, ShoppingBag, LogOut } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useInbox } from '@/context/InboxContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef } from 'react';
import styles from './DashboardSidebar.module.css';

export default function DashboardSidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const { unreadCount } = useInbox();
  const { user, profile, logout } = useAuth();
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Swipe to close logic
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    
    // If swiped left by more than 50px, close sidebar
    if (diff > 50) {
      closeSidebar();
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      <aside 
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.header}>
          <Link href="/" className={styles.logoWrapper} onClick={closeSidebar}>
            <Image src="/logo.jpg" alt="Smartwear Logo" width={32} height={32} className={styles.logoImg} />
            <span className={styles.logo}>SMARTWEAR</span>
          </Link>
          <button className={styles.closeBtn} onClick={closeSidebar} data-tooltip="Close menu" data-tooltip-bottom>
            <X size={24} />
          </button>
        </div>

        {user && profile ? (
          <div className={styles.profileSection}>
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{profile.name ? profile.name.split(' ')[0] : 'User'}</div>
            </div>
          </div>
        ) : (
          <div className={styles.profileSection}>
            <Link href="/auth/signin" className={styles.signInBtn} onClick={closeSidebar}>
              Sign In / Sign Up
            </Link>
          </div>
        )}

        <nav className={styles.nav}>
          <h3 className={styles.navLabel}>DASHBOARD</h3>
          
          <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`} onClick={closeSidebar}>
            <Home size={20} />
            <span>Home</span>
          </Link>

          <div className={styles.navGroup}>
            <button 
              className={`${styles.navItem} ${pathname.includes('/category') ? styles.active : ''}`}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              data-tooltip="Toggle Categories"
            >
              <Grid size={20} />
              <span>Categories</span>
              {categoriesOpen ? <ChevronUp size={16} className={styles.chevron} /> : <ChevronDown size={16} className={styles.chevron} />}
            </button>
            
            <div className={`${styles.subMenuContainer} ${categoriesOpen ? styles.open : ''}`}>
              <div className={styles.subMenu}>
                <div className={styles.subMenuInner}>
                  <Link href="/category/all" className={styles.subItem} onClick={closeSidebar}>All Products</Link>
                  <Link href="/category/shoes" className={styles.subItem} onClick={closeSidebar}>Shoes</Link>
                  <Link href="/category/apparel" className={styles.subItem} onClick={closeSidebar}>Apparel</Link>
                  <Link href="/category/watches" className={styles.subItem} onClick={closeSidebar}>Watches</Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/inbox" className={`${styles.navItem} ${pathname.includes('/inbox') ? styles.active : ''}`} onClick={closeSidebar}>
            <Inbox size={20} />
            <span>Inbox</span>
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>

          <Link href="/orders" className={`${styles.navItem} ${pathname.includes('/orders') ? styles.active : ''}`} onClick={closeSidebar}>
            <Package size={20} />
            <span>Orders</span>
          </Link>

          <Link href="/wishlist" className={`${styles.navItem} ${pathname.includes('/wishlist') ? styles.active : ''}`} onClick={closeSidebar}>
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>

          <Link href="/cart" className={`${styles.navItem} ${pathname.includes('/cart') ? styles.active : ''}`} onClick={closeSidebar}>
            <ShoppingBag size={20} />
            <span>Cart</span>
          </Link>

          <div className={styles.divider}></div>

          {user ? (
            <>
              <Link href="/account" className={`${styles.navItem} ${pathname.includes('/account') ? styles.active : ''}`} onClick={closeSidebar}>
                <User size={20} />
                <span>Account</span>
              </Link>
              <button 
                className={styles.navItem} 
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className={`${styles.navItem} ${pathname.includes('/auth') ? styles.active : ''}`} onClick={closeSidebar}>
              <User size={20} />
              <span>Sign In</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
