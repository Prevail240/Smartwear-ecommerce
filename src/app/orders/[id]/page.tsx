"use client";

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useCurrency } from '@/context/CurrencyContext';
import styles from './page.module.css';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { orders } = useOrders();
  const { formatPrice } = useCurrency();
  const order = orders.find(o => o.id === params.id);

  if (!order) {
    notFound();
  }

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
      <header className={styles.header}>
        <Link href="/orders" className={styles.backBtn}>
          <ArrowLeft size={24} />
          <span>Order Details</span>
        </Link>
      </header>

      <div className={styles.orderSummaryHeader}>
        <h2 className={styles.orderNo}>Order n° {order.id}</h2>
        <p className={styles.headerSub}>{order.items.length} Items</p>
        <p className={styles.headerSub}>Placed on {order.date}</p>
        <p className={styles.headerTotal}>Total: {formatPrice(order.total)}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ITEMS IN YOUR ORDER</h3>
        <div className={styles.itemsList}>
          {order.items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div className={`${styles.statusBadge} ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
                <p className={styles.deliveryEstimate}>{item.deliveryEstimate}</p>
              </div>
              
              <div className={styles.itemBody}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <p className={styles.itemSub}>Size: {item.size}</p>
                  <p className={styles.itemSub}>QTY: {item.quantity}</p>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(item.price)}</span>
                    {item.originalPrice && (
                      <span className={styles.originalPrice}>{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>
                </div>
                <div className={styles.itemAction}>
                  <button className={styles.trackBtn}>Track My Item</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h3 className={styles.sectionTitle}>PAYMENT INFORMATION</h3>
          
          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Payment Method</h4>
            <p className={styles.infoText}>{order.paymentMethod}</p>
          </div>

          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Payment Details</h4>
            <div className={styles.costRow}>
              <span>Items total:</span>
              <span>{formatPrice(order.paymentDetails.itemsTotal)}</span>
            </div>
            <div className={styles.costRow}>
              <span>Delivery Fees:</span>
              <span>{formatPrice(order.paymentDetails.deliveryFees)}</span>
            </div>
            <div className={`${styles.costRow} ${styles.costTotal}`}>
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.sectionTitle}>DELIVERY INFORMATION</h3>
          
          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Delivery Method</h4>
            <p className={styles.infoText}>{order.deliveryMethod}</p>
          </div>

          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Delivery Address</h4>
            <p className={styles.infoText}>{order.deliveryAddress.name}</p>
            <p className={styles.infoText}>{order.deliveryAddress.address}</p>
            {order.deliveryAddress.hours && (
              <p className={styles.infoSubText}>Opening Hours: {order.deliveryAddress.hours}</p>
            )}
          </div>

          <div className={styles.infoBlock}>
            <h4 className={styles.infoTitle}>Shipping Details</h4>
            {order.shippingDetails.map((detail, idx) => (
              <p key={idx} className={styles.infoText}>{detail}</p>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
