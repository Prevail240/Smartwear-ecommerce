"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, X } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { OrderItem } from '@/data/orders';
import styles from './page.module.css';

export default function OrderReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { orders } = useOrders();
  const [queue, setQueue] = useState<OrderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const order = orders.find(o => o.id === params.id);
    if (order) {
      // Get all non-canceled items for review
      const itemsToReview = order.items.filter(i => i.status !== 'CANCELED');
      if (itemsToReview.length > 0) {
        setQueue(itemsToReview);
      } else {
        setIsFinished(true);
      }
    } else {
      router.push('/orders');
    }
  }, [orders, params.id, router]);

  const currentItem = queue[currentIndex];

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      // Reset form
      setName('');
      setReview('');
      setStars(0);
    } else {
      setIsFinished(true);
      setTimeout(() => router.push('/orders'), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) return alert('Please select a star rating.');
    
    // In a real app, send review data to backend here
    console.log(`Submitting review for ${currentItem.name}:`, { name, review, stars });
    
    handleNext();
  };

  if (isFinished) {
    return (
      <div className={styles.overlay}>
        <div className={styles.successBox}>
          <h2>Thank You!</h2>
          <p>Your feedback helps us improve our products.</p>
          <p className={styles.redirectText}>Redirecting you back to your orders...</p>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className={styles.overlay} onClick={(e) => {
      // If clicking exactly on the overlay background (not the modal), skip to next
      if (e.target === e.currentTarget) {
        handleNext();
      }
    }}>
      <div className={styles.reviewModal}>
        <button className={styles.closeBtn} onClick={handleNext}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>Review Your Product</h2>
        
        <div className={styles.productBox}>
          <img src={currentItem.image} alt={currentItem.name} className={styles.productImg} />
          <div className={styles.productInfo}>
            <h3>{currentItem.name}</h3>
            <p>Size: {currentItem.size}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Name (Public)</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name" 
              required
              className={styles.input}
            />
          </div>

          <div className={styles.starGroup}>
            <label>Rating</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={32}
                  className={`${styles.star} ${num <= (hoveredStar || stars) ? styles.starFilled : ''}`}
                  onMouseEnter={() => setHoveredStar(num)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setStars(num)}
                  fill={num <= (hoveredStar || stars) ? 'var(--accent-color)' : 'none'}
                />
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Your Review</label>
            <textarea 
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="What did you like or dislike?" 
              required
              rows={4}
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Submit Review
          </button>
        </form>

        <div className={styles.progressText}>
          Product {currentIndex + 1} of {queue.length}
        </div>
      </div>
    </div>
  );
}
