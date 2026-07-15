"use server";

export async function processCheckout(formData: FormData) {
  // Simulate network delay and processing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const email = formData.get('email');
  const paymentMethod = formData.get('paymentMethod');

  if (!email || !paymentMethod) {
    return { success: false, message: 'Missing required fields.' };
  }

  // Generate a mock order ID
  const orderId = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return { 
    success: true, 
    orderId, 
    message: 'Order placed successfully!' 
  };
}
