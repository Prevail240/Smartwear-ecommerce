"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Product } from '@/data/products';
import { Heart } from 'lucide-react';
import styles from './page.module.css';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [animationParent] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  if (!user) return null;

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1, product.sizes?.[0] || 'One Size');
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const handleRemove = (product: Product) => {
    removeFromWishlist(product.id);
    showToast(`Removed ${product.name} from wishlist`, 'info');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wishlist ({wishlist.length})</h1>
      
      {wishlist.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Heart size={64} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
          <p className={styles.emptyDesc}>Save your favorite items here to review them later.</p>
          <Link href="/category/all" className={styles.shopBtn}>
            Discover Products
          </Link>
        </div>
      ) : (
        <div className={styles.listContainer} ref={animationParent}>
          {wishlist.map(product => (
            <div className={styles.listItem} key={product.id}>
              <Link href={`/product/${product.id}`} className={styles.imageContainer}>
                <img src={product.image} alt={product.name} className={styles.image} />
              </Link>
              <div className={styles.itemDetails}>
                <div className={styles.info}>
                  <Link href={`/product/${product.id}`} className={styles.name}>
                    {product.name}
                  </Link>
                  <div className={styles.price}>${product.price.toFixed(2)}</div>
                </div>
                <div className={styles.actions}>
                  <button 
                    className={styles.removeBtn} 
                    onClick={() => handleRemove(product)}
                  >
                    Remove
                  </button>
                  <button 
                    className={styles.addToCartBtn} 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
