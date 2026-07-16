"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Product } from '@/data/products';
import styles from './page.module.css';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, toggleItemSelection, removeFromCart, cartTotal } = useCart();
  const { addToWishlist } = useWishlist();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  
  const [promptItem, setPromptItem] = useState<{ id: string, size: string, product: Product } | null>(null);

  const handleRemove = (id: string, size: string, product: Product) => {
    setPromptItem({ id, size, product });
  };

  const truncateDesc = (desc: string) => {
    const words = desc.split(' ');
    if (words.length > 7) {
      return words.slice(0, 7).join(' ') + '...';
    }
    return desc;
  };

  const SHIPPING_COST = cartTotal > 0 ? 22500 : 0;
  const FINAL_TOTAL = cartTotal + SHIPPING_COST;

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>🛍️</div>
        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
        <p className={styles.emptySub}>Explore our premium collection and find your perfect fit.</p>
        <Link href="/category/all" className={styles.shopBtn}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>

      <div className={styles.cartList} ref={animationParent}>
        {cart.map((item, idx) => (
          <div key={`${item.product.id}-${item.selectedSize}-${idx}`} className={styles.cartItem}>
            <div className={styles.checkboxWrapper}>
              <input 
                type="checkbox" 
                checked={item.selected} 
                onChange={() => toggleItemSelection(item.product.id, item.selectedSize)}
                className={styles.checkbox}
              />
            </div>
            
            <div className={styles.itemLeft}>
              <img src={item.product.image} alt={item.product.name} className={styles.itemImage} />
              <button 
                className={styles.deleteBtn}
                onClick={() => handleRemove(item.product.id, item.selectedSize, item.product)}
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>
            
            <div className={styles.itemMid}>
              <h3 className={styles.itemName}>{item.product.name}</h3>
              <p className={styles.itemDesc}>{truncateDesc(item.product.description)}</p>
              <span className={styles.itemPrice}>{formatPrice(item.product.price)}</span>
              <p className={styles.itemSize}>Size: {item.selectedSize}</p>
            </div>

            <div className={styles.itemRight}>
              <div className={styles.quantityControl}>
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => {
                    if (item.quantity === 1) {
                      handleRemove(item.product.id, item.selectedSize, item.product);
                    } else {
                      updateQuantity(item.product.id, item.selectedSize, item.quantity - 1);
                    }
                  }}
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button 
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal</span>
          <span className={styles.summaryValue}>{formatPrice(cartTotal)}</span>
        </div>
        
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Estimated Shipping</span>
          <span className={styles.summaryValue}>{formatPrice(SHIPPING_COST)}</span>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.summaryRowTotal}>
          <span>Total</span>
          <span>{formatPrice(FINAL_TOTAL)}</span>
        </div>

        <button 
          className={styles.checkoutBtn} 
          onClick={() => {
            if (!user) {
              router.push('/auth/signin');
            } else {
              router.push('/account/checkout');
            }
          }}
          disabled={cartTotal === 0}
        >
          Proceed to Checkout
        </button>
      </div>

      {promptItem && (
        <div className={styles.promptOverlay}>
          <div className={styles.promptBox}>
            <button className={styles.promptClose} onClick={() => setPromptItem(null)}>
              <X size={20} />
            </button>
            <p className={styles.promptText}>Do you want to save <strong>{promptItem.product.name}</strong> to your wishlist before removing?</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                className={styles.promptActionBtn} 
                style={{ flex: 1, background: '#FF8C00', color: '#fff', border: 'none' }}
                onClick={() => {
                   if (!user) {
                     router.push('/auth/signin');
                     return;
                   }
                   addToWishlist(promptItem.product);
                   removeFromCart(promptItem.id, promptItem.size);
                   showToast(`Moved to wishlist`, 'success');
                   setPromptItem(null);
                }}
              >
                Save to Wishlist
              </button>
              <button 
                className={styles.promptActionBtn} 
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none' }}
                onClick={() => {
                   removeFromCart(promptItem.id, promptItem.size);
                   showToast(`Removed from cart`, 'success');
                   setPromptItem(null);
                }}
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
