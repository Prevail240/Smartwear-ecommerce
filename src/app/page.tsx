"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { animate, inView, stagger } from 'motion';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default function Home() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading products...</p>
      </div>
    );
  }

  const newArrivals = products.slice(0, 4);

  useEffect(() => {
    // Hero Animations
    animate('.hero-animate', 
      { opacity: [0, 1], y: [20, 0] }, 
      { duration: 0.8, delay: stagger(0.2) }
    );

    // Scroll Animations
    inView('.section-animate', (info) => {
      animate(info.target, 
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.6, easing: [0.17, 0.55, 0.55, 1] }
      );
    });
  }, [loading]);

  return (
    <div className={styles.container}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Premium Activewear" 
          className={styles.heroImage} 
        />
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} hero-animate`} style={{opacity: 0}}>THE OBSIDIAN<br/>COLLECTION</h1>
          <p className={`${styles.heroSub} hero-animate`} style={{opacity: 0}}>Engineered for elite performance.</p>
          <Link href="/category/all" className={`${styles.heroBtn} hero-animate`} style={{opacity: 0}}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Shoes Category */}
      <section className={`${styles.section} section-animate`} style={{opacity: 0}}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Premium Shoes</h2>
          <Link href="/category/shoes" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {products.filter(p => p.category === 'shoes').slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Apparel Category */}
      <section className={`${styles.section} section-animate`} style={{opacity: 0}}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Performance Apparel</h2>
          <Link href="/category/apparel" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {products.filter(p => p.category === 'apparel').slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Watches Category */}
      <section className={`${styles.section} section-animate`} style={{opacity: 0}}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Smart Watches</h2>
          <Link href="/category/watches" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {products.filter(p => p.category === 'watches').slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
