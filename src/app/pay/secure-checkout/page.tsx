"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck, CreditCard } from 'lucide-react';
import styles from './page.module.css';

export default function SecureCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const tx_ref = searchParams.get('tx_ref');
  const amount = searchParams.get('amount') || '0';
  const email = searchParams.get('email') || '';

  // If no transaction reference, something went wrong
  useEffect(() => {
    if (!tx_ref) {
      router.push('/cart');
    }
  }, [tx_ref, router]);

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network processing delay for the payment gateway
    setTimeout(() => {
      // Redirect back to our verification route with a successful status
      router.push(`/payment/verify?tx_ref=${tx_ref}&status=successful`);
    }, 2500);
  };

  if (!tx_ref) return null;

  return (
    <div className={styles.gatewayContainer}>
      <div className={styles.hostedBox}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <ShieldCheck size={28} className={styles.brandIcon} />
            <h2>SimulatedPay</h2>
          </div>
          <p className={styles.securityText}>
            <Lock size={14} /> 256-bit Secure Connection
          </p>
        </div>

        <div className={styles.orderSummary}>
          <p className={styles.merchantName}>Smartwear E-Commerce</p>
          <p className={styles.customerEmail}>{email}</p>
          <div className={styles.amountBox}>
            <span className={styles.currency}>₦</span>
            <span className={styles.amount}>{Number(amount).toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSimulatedPayment} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Card Number</label>
            <div className={styles.inputWrapper}>
              <CreditCard size={18} className={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                defaultValue="4242 4242 4242 4242"
                required 
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Valid Till</label>
              <input type="text" placeholder="MM/YY" defaultValue="12/28" required className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label>CVV</label>
              <input type="text" placeholder="123" defaultValue="123" required className={styles.input} />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.payBtn}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : `Pay ₦${Number(amount).toLocaleString()}`}
          </button>
        </form>

        <div className={styles.footer}>
          <p>This is a simulated payment gateway. No real money is processed.</p>
        </div>
      </div>
    </div>
  );
}
