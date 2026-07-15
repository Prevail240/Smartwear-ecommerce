import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

export default function Home() {
  const newArrivals = products.slice(0, 4); // Just mock data

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
          <h1 className={styles.heroTitle}>THE OBSIDIAN<br/>COLLECTION</h1>
          <p className={styles.heroSub}>Engineered for elite performance.</p>
          <Link href="/category/all" className={styles.heroBtn}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Shoes Category */}
      <section className={styles.section}>
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
      <section className={styles.section}>
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
      <section className={styles.section}>
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
