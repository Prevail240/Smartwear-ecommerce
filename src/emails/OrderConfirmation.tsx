import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationProps {
  customerName: string;
  orderId: string;
  orderCode: string;
  total: number;
  items: Array<{ name: string; price: number; image: string }>;
}

export const OrderConfirmation = ({
  customerName = "Valued Customer",
  orderId = "ORD-000000",
  orderCode = "SMS-XXXXXXX",
  total = 0,
  items = [],
}: OrderConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Smartwear Order #{orderId} has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed!</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for shopping at Smartwear. Your order has been successfully placed and is currently being processed.
          </Text>

          <Section style={codeBox}>
            <Text style={codeLabel}>Your Order Pickup Code:</Text>
            <Text style={codeValue}>{orderCode}</Text>
            <Text style={codeNotice}>Please keep this code safe. You will need it to collect your package.</Text>
          </Section>

          <Heading style={h2}>Order Summary (#{orderId})</Heading>
          
          {items.map((item, index) => (
            <Section key={index} style={itemRow}>
              <Text style={itemName}>• {item.name}</Text>
              <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
            </Section>
          ))}

          <Section style={totalRow}>
            <Text style={totalLabel}>Total:</Text>
            <Text style={totalValue}>${total.toFixed(2)}</Text>
          </Section>

          <Text style={footer}>
            If you have any questions about your order, please reply to this email.
            <br />- The Smartwear Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmation;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a24',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 20px',
};

const h2 = {
  color: '#1a1a24',
  fontSize: '20px',
  fontWeight: '600',
  margin: '30px 0 16px',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const codeBox = {
  backgroundColor: '#1a1a24',
  padding: '24px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const codeLabel = {
  color: '#aaa',
  fontSize: '14px',
  margin: '0 0 8px',
};

const codeValue = {
  color: '#fff',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '2px',
  margin: '0 0 8px',
};

const codeNotice = {
  color: '#888',
  fontSize: '12px',
  margin: '0',
};

const itemRow = {
  padding: '12px 0',
  borderBottom: '1px solid #eee',
};

const itemName = {
  fontSize: '16px',
  color: '#333',
  margin: '0',
};

const itemPrice = {
  fontSize: '16px',
  color: '#1a1a24',
  fontWeight: '600',
  margin: '0',
};

const totalRow = {
  padding: '16px 0',
  borderTop: '2px solid #1a1a24',
  marginTop: '16px',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#333',
  margin: '0',
};

const totalValue = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1a1a24',
  margin: '0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '40px',
  textAlign: 'center' as const,
};
