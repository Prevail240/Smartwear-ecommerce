"use client";

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { OrderItem } from '@/data/orders';
import { useOrders } from '@/context/OrderContext';
import styles from './page.module.css';

export default function OrdersPage() {
  const { orders, cancelItem } = useOrders();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'canceled'>('ongoing');
  const [cancelPrompt, setCancelPrompt] = useState<{ orderId: string, itemId: string } | null>(null);

  const confirmCancel = () => {
    if (cancelPrompt) {
      cancelItem(cancelPrompt.orderId, cancelPrompt.itemId);
      setCancelPrompt(null);
    }
  };

  const getFilteredItems = () => {
    let items: { orderId: string; item: OrderItem }[] = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        const isOngoingOrDelivered = ['PROCESSING', 'AVAILABLE FOR PICKUP', 'EN-ROUTE', 'DELIVERED'].includes(item.status);
        if (activeTab === 'ongoing' && isOngoingOrDelivered) {
          items.push({ orderId: order.id, item });
        } else if (activeTab === 'canceled' && !isOngoingOrDelivered) {
          items.push({ orderId: order.id, item });
        }
      });
    });
    return items;
  };

  const displayedItems = getFilteredItems();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING': return styles.statusProcessing;
      case 'AVAILABLE FOR PICKUP': return styles.statusPickup;
      case 'EN-ROUTE': return styles.statusEnRoute;
      case 'DELIVERED': return styles.statusDelivered;
      case 'CANCELED': return styles.statusCanceled;
      default: return styles.statusDefault;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Orders</h1>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'ongoing' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          ONGOING/DELIVERED (2)
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'canceled' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('canceled')}
        >
          CANCELED/RETURNED (0)
        </button>
      </div>

      <div className={styles.ordersList}>
        {displayedItems.length === 0 ? (
          <div className={styles.emptyState}>No orders found in this category.</div>
        ) : (
          displayedItems.map(({ orderId, item }) => (
            <div key={`${orderId}-${item.id}`} className={styles.orderCard}>
              <div className={styles.cardLeft}>
                <img src={item.image} alt={item.name} className={styles.productImage} />
              </div>
              
              <div className={styles.cardMid}>
                <h3 className={styles.productName}>{item.name}</h3>
                <p className={styles.orderNo}>Order {orderId}</p>
                <p className={styles.size}>Size: {item.size}</p>
                
                <div className={`${styles.statusBadge} ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
                
                <p className={styles.deliveryEstimate}>{item.deliveryEstimate}</p>
              </div>

              <div className={styles.cardRight}>
                <Link href={`/orders/${orderId}`} className={styles.detailsLink}>
                  See details
                </Link>
                {item.status === 'PROCESSING' && (
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => setCancelPrompt({ orderId, itemId: item.id })}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {cancelPrompt && (
        <div className={styles.promptOverlay}>
          <div className={styles.promptBox}>
            <button className={styles.closePromptBtn} onClick={() => setCancelPrompt(null)}>
              <X size={20} />
            </button>
            <h3 className={styles.promptTitle}>Cancel Order</h3>
            <p className={styles.promptText}>
              Are you sure you want to cancel this order? It will not be processed and will be moved to your canceled items.
            </p>
            <button className={styles.promptActionBtn} onClick={confirmCancel}>
              Yes, cancel order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
