"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, User } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav}>
      <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
        <Home size={24} className={styles.icon} />
        <span>Home</span>
      </Link>
      <Link href="/category/all" className={`${styles.navItem} ${pathname.includes('/category') ? styles.active : ''}`}>
        <Grid size={24} className={styles.icon} />
        <span>Browse</span>
      </Link>
      <button className={styles.navItem}>
        <Heart size={24} className={styles.icon} />
        <span>Saved</span>
      </button>
      <button className={styles.navItem}>
        <User size={24} className={styles.icon} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
