"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { verifyPayment } from '@/app/actions/payment';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { Order, OrderItem } from '@/data/orders';
import { useAuth } from '@/context/AuthContext';
import { useInbox } from '@/context/InboxContext';
import { sendOrderConfirmationEmail } from '@/app/actions/sendEmail';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './page.module.css';

function PaymentVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addMessage } = useInbox();
  const { user, profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const tx_ref = searchParams.get('tx_ref');
    const status = searchParams.get('status');

    if (!tx_ref) {
      setError('No transaction reference found.');
      setTimeout(() => router.push('/cart'), 3000);
      return;
    }

    if (status !== 'successful') {
      setError('Payment was not successful. Please try again.');
      setTimeout(() => router.push('/account/checkout?error=payment_failed'), 3000);
      return;
    }

    const verify = async () => {
      try {
        if (!user) {
          setError('You must be logged in to verify payment.');
          return;
        }

        const result = await verifyPayment({
          tx_ref: tx_ref,
          userId: user.uid
        });
        if (result.success && result.orderId) {
          
          // Construct order object from cart
          const newOrderItems: OrderItem[] = cart.filter(c => c.selected).map((c, i) => ({
            id: `item-${Date.now()}-${i}`,
            productId: c.product.id,
            name: c.product.name,
            image: c.product.image,
            size: c.selectedSize,
            quantity: c.quantity,
            price: c.product.price,
            status: 'PROCESSING',
            deliveryEstimate: 'Processing for delivery',
          }));

          const FINAL_TOTAL = cartTotal + 15.00; // Mock delivery fee

          const newOrder: Order = {
            id: result.orderId.replace('ORD-', ''),
            date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
            total: FINAL_TOTAL,
            items: newOrderItems,
            paymentMethod: 'Credit / Debit Card (Simulated)',
            paymentDetails: {
              itemsTotal: cartTotal,
              deliveryFees: 15.00
            },
            deliveryMethod: 'Home Delivery',
            deliveryAddress: {
              name: 'Customer', // Would be from form in real app
              address: 'Checkout Address'
            },
            shippingDetails: [
              'Shipment 1: Home Delivery. Processing.'
            ]
          };

          addOrder(newOrder);

          if (user?.uid) {
            try {
              await setDoc(doc(db, 'users', user.uid, 'orders', newOrder.id), newOrder);
            } catch (err) {
              console.error('Error saving order to Firestore:', err);
            }
          }

          // 1. Send the real email via Server Action
          const orderCode = `SMS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
          if (profile?.email) {
            sendOrderConfirmationEmail({
              email: profile.email,
              customerName: profile.name || 'Customer',
              orderId: newOrder.id,
              orderCode: orderCode,
              total: FINAL_TOTAL,
              items: newOrderItems.map(i => ({ name: i.name, price: i.price, image: i.image })),
              userId: user.uid
            });
          }

          // 2. Add message to in-app Inbox
          addMessage({
            title: 'Order Successful',
            content: `Your order #${newOrder.id} has been placed successfully! Your pickup code is ${orderCode}.`,
            date: new Date().toISOString(),
            actionLink: `/orders/${newOrder.id}`,
            actionText: 'View Order'
          });

          // Success! Clear the cart and redirect to success page
          clearCart();
          router.push(`/account/checkout?success=true&order_id=${result.orderId}`);
        } else {
          setError(result.error || 'Verification failed');
          setTimeout(() => router.push('/account/checkout?error=verification_failed'), 3000);
        }
      } catch {
        setError('An error occurred during verification.');
        setTimeout(() => router.push('/account/checkout?error=server_error'), 3000);
      }
    };

    verify();
  }, [searchParams, router, clearCart]);

  if (error) {
    return (
      <div className={styles.verifyContainer}>
        <div className={styles.errorBox}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Verification Failed</h2>
          <p className={styles.errorText}>{error}</p>
          <p className={styles.redirectText}>Redirecting you back to checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.loadingBox}>
        <Loader2 size={48} className={styles.spinner} />
        <h2 className={styles.loadingTitle}>Verifying Payment...</h2>
        <p className={styles.loadingText}>Please do not close or refresh this page. We are securely verifying your transaction.</p>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div style={{padding: '4rem', textAlign: 'center'}}>Verifying...</div>}>
      <PaymentVerifyContent />
    </Suspense>
  );
}
