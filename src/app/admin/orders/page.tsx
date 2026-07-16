"use client";

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Order, OrderStatus } from '@/data/orders';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationParent] = useAutoAnimate<HTMLTableSectionElement>();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const fetchedOrders: Order[] = [];
      snapshot.forEach(doc => fetchedOrders.push({ id: doc.id, ...doc.data() } as Order));
      fetchedOrders.sort((a, b) => b.id.localeCompare(a.id));
      setOrders(fetchedOrders);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, itemId: string, newStatus: OrderStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedItems = order.items.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      );

      await updateDoc(doc(db, 'orders', orderId), { items: updatedItems });
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, items: updatedItems } : o));
      showToast('Status updated', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) return <AdminRoute><div className={styles.container}>Loading orders...</div></AdminRoute>;

  return (
    <AdminRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Customer Orders</h1>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items & Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody ref={animationParent}>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    {order.deliveryAddress.name}<br/>
                    <small style={{ color: 'var(--text-muted)' }}>
                      {(order as any).userId || 'Guest'}
                    </small>
                  </td>
                  <td>
                    <div className={styles.orderItems}>
                      {order.items.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                          <img src={item.image} alt={item.name} className={styles.itemImg} />
                          <div className={styles.itemName}>
                            {item.quantity}x {item.name} ({item.size})
                          </div>
                          <select 
                            className={styles.statusSelect}
                            value={item.status}
                            onChange={(e) => handleStatusChange(order.id, item.id, e.target.value as OrderStatus)}
                          >
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="AVAILABLE FOR PICKUP">AVAILABLE FOR PICKUP</option>
                            <option value="EN-ROUTE">EN-ROUTE</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="RETURNED">RETURNED</option>
                            <option value="CANCELED">CANCELED</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminRoute>
  );
}
