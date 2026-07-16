"use client";

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const unwrappedParams = use(params);
  const category = unwrappedParams.slug;
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  
  const { products, loading } = useProducts();

  // Basic validation
  if (!['all', 'shoes', 'apparel', 'watches'].includes(category)) {
    notFound();
  }

  if (loading) {
    return (
      <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading category...</p>
      </div>
    );
  }

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
          <SlidersHorizontal size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className={styles.productGrid} ref={animationParent}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Filter Drawer Overlay */}
      {isFilterOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsFilterOpen(false)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>Filters</h2>
              <button className={styles.closeBtn} onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.filterSection}>
              <h3 className={styles.filterLabel}>Size</h3>
              <div className={styles.pillGroup}>
                {['S', 'M', 'L', 'XL', '7', '8', '9', '10'].map(size => (
                  <button key={size} className={styles.pill}>{size}</button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterLabel}>Price Range</h3>
              <input type="range" className={styles.rangeInput} min="0" max="500" />
              <div className={styles.rangeLabels}>
                <span>$0</span>
                <span>$500+</span>
              </div>
            </div>

            <div className={styles.filterSection}>
              <h3 className={styles.filterLabel}>Brand</h3>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} defaultChecked />
                  Obsidian
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} defaultChecked />
                  Chronos
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} defaultChecked />
                  AeroKnit
                </label>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button className={styles.resetBtn}>Reset</button>
              <button className={styles.applyBtn} onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
