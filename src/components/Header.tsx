"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSidebar } from '@/context/SidebarContext';
import { products, Product } from '@/data/products';
import styles from './Header.module.css';

function SearchBar({ isMobile = false }: { isMobile?: boolean }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 0) {
      const lowerQuery = value.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${productId}`);
  };

  return (
    <div 
      ref={containerRef} 
      className={isMobile ? styles.searchContainerMobile : styles.searchContainerDesktop}
    >
      <Search size={20} className={styles.searchIcon} />
      <input 
        type="text" 
        value={query}
        onChange={handleSearch}
        onFocus={() => { if (query.length > 0) setIsOpen(true) }}
        placeholder={isMobile ? "Search premium gear..." : "Search brands, categories..."} 
        className={styles.searchInput}
      />

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {results.length > 0 ? (
            results.slice(0, 5).map(product => (
              <button 
                key={product.id} 
                className={styles.dropdownItem}
                onClick={() => handleSelect(product.id)}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <img src={product.images[0]} alt={product.name} className={styles.dropdownImg} />
                <div className={styles.dropdownInfo}>
                  <span className={styles.dropdownName}>{product.name}</span>
                  <span className={styles.dropdownBrand}>{product.brand} &bull; {product.category}</span>
                </div>
              </button>
            ))
          ) : (
            <div className={styles.dropdownEmpty}>
              No results found for "{query}".<br />
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Please check if your spelling is correct.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { cartCount } = useCart();
  const { openSidebar } = useSidebar();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <button className={styles.iconBtnMobile} onClick={openSidebar} data-tooltip="Menu" data-tooltip-bottom>
          <Menu size={24} />
        </button>
        <Link href="/" className={styles.logoWrapper}>
          <Image src="/logo.jpg" alt="Smartwear Logo" width={32} height={32} className={styles.logoImg} />
          <span className={styles.logo}>SMARTWEAR</span>
        </Link>
        <nav className={styles.desktopNav}>
          <Link href="/category/all" className={styles.navLink}>Shop</Link>
          <Link href="/category/shoes" className={styles.navLink}>Shoes</Link>
          <Link href="/category/apparel" className={styles.navLink}>Apparel</Link>
          <Link href="/category/watches" className={styles.navLink}>Watches</Link>
        </nav>
        <div className={styles.actions}>
          <SearchBar />
          <Link href="/cart" className={styles.iconBtn} data-tooltip="View Cart" data-tooltip-bottom>
            <div className={styles.cartIconWrapper}>
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.searchRowMobile}>
        <SearchBar isMobile={true} />
      </div>
    </header>
  );
}
