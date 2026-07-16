"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, CreditCard, Smartphone, Landmark, ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { initiatePayment } from '@/app/actions/payment';
import styles from './page.module.css';

const steps = ['Shipping', 'Payment', 'Review'];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ id: string } | null>(null);

  const SHIPPING_COST = 22500;
  const FINAL_TOTAL = cartTotal + SHIPPING_COST;

  useEffect(() => {
    const success = searchParams.get('success');
    const order_id = searchParams.get('order_id');
    if (success === 'true' && order_id) {
      setOrderConfirmed({ id: order_id });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  if (!user) return null;

  async function handleCheckout(formData: FormData) {
    setIsProcessing(true);
    try {
      const email = formData.get('email') as string || 'customer@example.com';
      const result = await initiatePayment(FINAL_TOTAL, email);
      if (result.success && result.paymentUrl) {
        router.push(result.paymentUrl);
      } else {
        alert('Failed to initiate payment');
      }
    } catch (e) {
      alert('Error initiating payment');
    } finally {
      setIsProcessing(false);
    }
  }



  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Checkout</h1>
        <div style={{width: 24}}></div> {/* spacer */}
      </header>

      {/* Multi-step progress indicator */}
      <div className={styles.progressContainer}>
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <div key={step} className={styles.stepWrapper}>
              <div className={`${styles.stepCircle} ${isActive ? styles.activeStep : ''} ${isCompleted ? styles.completedStep : ''}`}>
                {isCompleted ? <CheckCircle2 size={14} /> : stepNum}
              </div>
              <span className={`${styles.stepLabel} ${isActive ? styles.activeLabel : ''}`}>{step}</span>
              {idx < steps.length - 1 && <div className={`${styles.stepLine} ${isCompleted ? styles.completedLine : ''}`} />}
            </div>
          );
        })}
      </div>

      <form action={handleCheckout} className={styles.form}>
        
        {currentStep === 1 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Shipping Details</h2>
            <div className={styles.inputGroup}>
              <input type="email" name="email" placeholder="Email Address" required className={styles.input} defaultValue="user@example.com" />
            </div>
            <div className={styles.inputGroup}>
              <input type="text" name="name" placeholder="Full Name" required className={styles.input} defaultValue="Lagos Shopper" />
            </div>
            <div className={styles.inputGroup}>
              <input type="text" name="address" placeholder="Delivery Address" required className={styles.input} defaultValue="12 Victoria Island" />
            </div>
            <button type="button" className={styles.primaryBtn} onClick={() => setCurrentStep(2)}>
              Continue to Payment
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            
            <label className={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="card" defaultChecked className={styles.radioInput} />
              <div className={styles.paymentCard}>
                <CreditCard size={24} />
                <span>Credit / Debit Card</span>
              </div>
            </label>

            <label className={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="mobile" className={styles.radioInput} />
              <div className={styles.paymentCard}>
                <Smartphone size={24} />
                <span>Mobile Money</span>
              </div>
            </label>

            <label className={styles.paymentOption}>
              <input type="radio" name="paymentMethod" value="bank" className={styles.radioInput} />
              <div className={styles.paymentCard}>
                <Landmark size={24} />
                <span>Bank Transfer</span>
              </div>
            </label>

            <div className={styles.btnRow}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setCurrentStep(1)}>Back</button>
              <button type="button" className={styles.primaryBtn} onClick={() => setCurrentStep(3)}>Review Order</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Review Order</h2>
            
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{formatPrice(SHIPPING_COST)}</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span>{formatPrice(FINAL_TOTAL)}</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setCurrentStep(2)}>Back</button>
              <button type="submit" className={styles.primaryBtn} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}

      </form>

      {orderConfirmed && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <CheckCircle2 size={64} className={styles.successIcon} />
            <h2 className={styles.popupTitle}>Thank you for your order!</h2>
            <p className={styles.popupText}>
              We sincerely appreciate your purchase. Your order #{orderConfirmed.id} has been placed successfully.
            </p>
            <p className={styles.popupText}>
              Please proceed to the Orders page to review your product's status.
            </p>
            <button className={styles.primaryBtn} onClick={() => router.push('/orders')}>
              View Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{padding: '4rem', textAlign: 'center', color: '#888'}}>Loading checkout securely...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
