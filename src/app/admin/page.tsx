"use client";

import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Welcome to the control center.</p>
        
        <div className={styles.grid}>
          <Link href="/admin/products" className={styles.card}>
            <h3>Products</h3>
            <p>Manage inventory, add new items.</p>
          </Link>
          <Link href="/admin/orders" className={styles.card}>
            <h3>Orders</h3>
            <p>View and update customer orders.</p>
          </Link>
        </div>
      </div>
    </AdminRoute>
  );
}
