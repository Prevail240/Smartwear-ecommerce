"use server";

import { z } from 'zod';

const CheckoutSchema = z.object({
  email: z.string().email(),
  paymentMethod: z.string().min(1),
  userId: z.string().min(1)
});

export async function processCheckout(input: unknown) {
  // Point 5: Zod Validation
  const result = CheckoutSchema.safeParse(input);
  if (!result.success) {
    return { success: false, message: 'Invalid data sent.' };
  }
  
  const { userId } = result.data;
  
  // Point 3: Authentication
  if (!userId) {
    return { success: false, message: 'Unauthorized.' };
  }

  // Simulate network delay and processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a mock order ID
  const orderId = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return { 
    success: true, 
    orderId, 
    message: 'Order placed successfully!' 
  };
}
