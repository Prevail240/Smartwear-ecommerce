"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, ShoppingCart, User, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSidebar } from '@/context/SidebarContext';
import { Product } from '@/data/products';
import { useProducts } from '@/context/ProductContext';

/* ──────────────────────────────────────────
   SearchBar — Preserves all existing search logic
   ────────────────────────────────────────── */
function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { products } = useProducts();

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
    <div ref={containerRef} className="relative flex-1 mx-3">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60" />
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onFocus={() => { if (query.length > 0) setIsOpen(true); }}
        placeholder="search"
        className="w-full bg-white/15 text-white placeholder-white/50 rounded-sm pl-8 pr-3 py-1.5 text-xs border border-white/20 focus:border-white/40 focus:bg-white/20 transition-colors outline-none"
      />

      {/* Search Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[60]">
          {results.length > 0 ? (
            results.slice(0, 5).map(product => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
              >
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  <span className="text-xs text-gray-500">{product.brand} &bull; {product.category}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   Header45XL — Deep purple 45XL navigation bar
   Shared across all pages via layout.tsx
   ────────────────────────────────────────── */
export default function Header45XL() {
  const { cartCount } = useCart();
  const { openSidebar } = useSidebar();

  /* Category links — update hrefs to match your routing */
  const categories = [
    { label: 'SHOES', href: '/category/shoes' },
    { label: 'SHIRTS', href: '/category/apparel' },
    { label: 'SHORTS', href: '/category/all' },
    { label: 'JACKETS', href: '/category/watches' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* ── Top Navigation Bar ── */}
      <div className="bg-[#4A0E8F] px-4 py-2.5 flex items-center gap-3 w-full">
        {/* Hamburger Menu */}
        <button
          onClick={openSidebar}
          className="text-white hover:text-white/80 transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* 45XL Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <div className="relative">
            <Tag size={22} className="text-white fill-white/20 -rotate-45" />
          </div>
          <span className="text-white font-extrabold text-base tracking-tight leading-none">
            45<sup className="text-[8px] font-normal -top-1.5 relative">com</sup>XL
          </span>
        </Link>

        {/* Search Bar (Desktop only — shown inline) */}
        <SearchBar />

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* User / Account Icon */}
          <Link
            href="/account"
            className="w-7 h-7 rounded-full bg-[#E67E22] flex items-center justify-center hover:bg-[#D35400] transition-colors"
          >
            <User size={15} className="text-white" />
          </Link>

          {/* Shopping Cart Icon */}
          <Link href="/cart" className="relative">
            <div className="w-7 h-7 rounded-full bg-[#E67E22] flex items-center justify-center hover:bg-[#D35400] transition-colors">
              <ShoppingCart size={15} className="text-white" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── Category Navigation Sub-bar ── */}
      <nav className="bg-[#350A6E] flex items-center justify-center gap-6 md:gap-12 py-2 px-4 w-full">
        {categories.map(cat => (
          <Link
            key={cat.label}
            href={cat.href}
            className="text-[#E67E22] text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap hover:text-orange-300 transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
