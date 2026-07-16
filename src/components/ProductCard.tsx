"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  
  const inWishlist = isInWishlist(product.id);
  const [animatingWishlist, setAnimatingWishlist] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    addToCart(product, 1, product.sizes?.[0] || 'One Size');
    showToast('Added to cart', 'success');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast(`Removed from wishlist`, 'info');
    } else {
      addToWishlist(product);
      showToast(`Added ${product.name} to wishlist`, 'success');
      setAnimatingWishlist(true);
      setTimeout(() => setAnimatingWishlist(false), 300);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.images?.[0] || product.image} alt={product.name} className={styles.primaryImage} />
        {product.images?.length > 1 && (
          <img src={product.images[1]} alt={product.name} className={styles.secondaryImage} />
        )}
      </div>
      <div className={styles.quickActions}>
        <button 
          className={`${styles.actionBtn} ${inWishlist ? styles.activeWishlist : ''}`} 
          onClick={handleToggleWishlist}
          aria-label="Toggle Wishlist"
          data-tooltip={inWishlist ? "Remove from Wishlist" : "Quick Add to Wishlist"}
        >
          <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} className={animatingWishlist ? styles.iconPop : ''} />
        </button>
        <button 
          className={styles.actionBtn} 
          onClick={handleAddToCart}
          aria-label="Add to Cart"
          data-tooltip="Quick Add to Cart"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>
        <p className={styles.category}>{product.category}</p>
        <div className={styles.rating}>
          <Star size={14} className={styles.starIcon} fill="currentColor" />
          <span className={styles.ratingText}>{product.rating}</span>
          <span className={styles.reviewsText}>({product.reviews})</span>
        </div>
        <button 
          className={styles.fullWidthAddBtn} 
          onClick={handleAddToCart}
          aria-label="Add to Cart"
        >
          <ShoppingBag size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
}
