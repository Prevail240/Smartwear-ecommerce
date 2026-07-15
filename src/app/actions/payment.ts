"use server";

import { v4 as uuidv4 } from 'uuid';

// In a real application, this would be a database table tracking pending transactions
// For the simulation, we'll just validate the structure of the tx_ref.
export async function initiatePayment(amount: number, email: string) {
  // 1. Secure Server-Side Validation
  // Here we would normally query the database to recalculate the exact cart total
  // to prevent client-side manipulation. For the simulation, we'll assume it's valid.
  
  if (amount <= 0) {
    return { success: false, error: 'Invalid amount' };
  }

  // 2. Generate a secure transaction reference
  const tx_ref = `tx_sim_${uuidv4()}`;

  // 3. Generate the payment link
  // This mimics Flutterwave's standard checkout URL creation
  const paymentUrl = `/pay/secure-checkout?tx_ref=${tx_ref}&amount=${amount}&email=${encodeURIComponent(email)}`;

  return { success: true, paymentUrl, tx_ref };
}

export async function verifyPayment(tx_ref: string) {
  // 1. Secure Server-to-Server Verification
  // Here we would normally call Flutterwave's verify endpoint with our Secret Key
  // For the simulation, we'll just check if it starts with our prefix
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!tx_ref || !tx_ref.startsWith('tx_sim_')) {
    return { success: false, error: 'Invalid transaction reference' };
  }

  // Generate a mock order ID
  const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;

  return { success: true, orderId };
}
