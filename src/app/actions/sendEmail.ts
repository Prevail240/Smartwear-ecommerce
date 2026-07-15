"use server";

import { Resend } from 'resend';
import OrderConfirmation from '@/emails/OrderConfirmation';
import ReviewRequest from '@/emails/ReviewRequest';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(data: {
  email: string;
  customerName: string;
  orderId: string;
  orderCode: string;
  total: number;
  items: Array<{ name: string; price: number; image: string }>;
}) {
  try {
    const { data: resData, error } = await resend.emails.send({
      from: 'Smartwear <onboarding@resend.dev>', // Resend free tier requires this verified domain
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

export async function sendReviewRequestEmail(data: {
  email: string;
  customerName: string;
  orderId: string;
  reviewUrl: string;
}) {
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
