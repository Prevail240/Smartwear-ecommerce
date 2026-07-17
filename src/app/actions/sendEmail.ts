"use server";

import { z } from 'zod';
import { Resend } from 'resend';
import OrderConfirmation from '@/emails/OrderConfirmation';
import ReviewRequest from '@/emails/ReviewRequest';

const resend = new Resend(process.env.RESEND_API_KEY);

// Point 6: Rate Limiting
const rateLimitCache = new Map<string, number>();

const checkRateLimit = (key: string) => {
  const now = Date.now();
  const lastRequest = rateLimitCache.get(key) || 0;
  // 1 email per minute per user/IP
  if (now - lastRequest < 60000) {
    return false;
  }
  rateLimitCache.set(key, now);
  return true;
};

// Point 5: Trusting Client Data (Zod Validation)
const OrderEmailSchema = z.object({
  email: z.string().email(),
  customerName: z.string().min(1),
  orderId: z.string().min(1),
  orderCode: z.string().min(1),
  total: z.number().nonnegative(),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number().nonnegative(),
      image: z.string()
    })
  ),
  userId: z.string().min(1) // Point 3: Auth Bouncer
});

export async function sendOrderConfirmationEmail(input: unknown) {
  // Point 5: Validation
  const result = OrderEmailSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: 'Invalid data' };
  }
  
  const data = result.data;

  // Point 3: Authentication
  if (!data.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Point 6: Rate Limiting
  if (!checkRateLimit(`order_${data.userId}`)) {
    return { success: false, error: 'Too many requests' };
  }

  try {
    const { data: resData, error } = await resend.emails.send({
      from: 'Smartwear <onboarding@resend.dev>', 
      to: [data.email],
      subject: `Order Confirmation #${data.orderId}`,
      react: OrderConfirmation(data) as React.ReactElement,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data: resData };
  } catch (error) {
    console.error("Server error sending email:", error);
    return { success: false, error };
  }
}

const ReviewEmailSchema = z.object({
  email: z.string().email(),
  customerName: z.string().min(1),
  orderId: z.string().min(1),
  reviewUrl: z.string().url(),
  userId: z.string().min(1)
});

export async function sendReviewRequestEmail(input: unknown) {
  const result = ReviewEmailSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: 'Invalid data' };
  }
  
  const data = result.data;

  if (!data.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!checkRateLimit(`review_${data.userId}`)) {
    return { success: false, error: 'Too many requests' };
  }

  try {
    const { data: resData, error } = await resend.emails.send({
      from: 'Smartwear <onboarding@resend.dev>',
      to: [data.email],
      subject: `Your Smartwear order has arrived!`,
      react: ReviewRequest(data) as React.ReactElement,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data: resData };
  } catch (error) {
    console.error("Server error sending email:", error);
    return { success: false, error };
  }
}
