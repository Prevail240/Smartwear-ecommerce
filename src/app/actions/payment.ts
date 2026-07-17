"use server";

import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod';

const InitiatePaymentSchema = z.object({
  amount: z.number().positive(),
  email: z.string().email(),
  userId: z.string().min(1)
});

const VerifyPaymentSchema = z.object({
  tx_ref: z.string().startsWith('tx_sim_'),
  userId: z.string().min(1)
});

export async function initiatePayment(input: unknown) {
  // 1. The Bouncer (Authentication) 
  // In a real app with Firebase Admin, we would securely verify a session cookie or token here.
  // For this implementation, we extract userId from input and simulate the check.
  
  // 2. The Metal Detector (Validation)
  const result = InitiatePaymentSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: 'Invalid data sent.' };
  }
  const { amount, email, userId } = result.data;

  // Bouncer continued
  if (!userId) {
    return { success: false, error: 'You must be logged in to do this.' };
  }

  // 4. The Filter (Safe Execution)
  try {
    // 3. The VIP List (Authorization)
    // Normally query the DB to recalculate the exact cart total for this specific user
    // e.g. const userCart = await db.collection('carts').doc(userId).get();
    // if (userCart.total !== amount) throw new Error('Unauthorized');
    
    const tx_ref = `tx_sim_${uuidv4()}`;
    const paymentUrl = `/pay/secure-checkout?tx_ref=${tx_ref}&amount=${amount}&email=${encodeURIComponent(email)}`;
    
    return { success: true, paymentUrl, tx_ref };
  } catch (error) {
    // Catch errors safely so we don't leak secrets
    return { success: false, error: 'Failed to process request.' };
  }
}

export async function verifyPayment(input: unknown) {
  // 2. The Metal Detector
  const result = VerifyPaymentSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: 'Invalid data sent.' };
  }
  const { tx_ref, userId } = result.data;
  
  // 1. The Bouncer
  if (!userId) {
    return { success: false, error: 'You must be logged in to do this.' };
  }

  // 4. The Filter
  try {
    // 3. The VIP List
    // Normally verify the transaction in the DB belongs to this specific user
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    return { success: true, orderId };
  } catch (error) {
    // Catch errors safely
    return { success: false, error: 'Failed to process request.' };
  }
}
