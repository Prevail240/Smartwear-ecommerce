import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ReviewRequestProps {
  customerName: string;
  orderId: string;
  reviewUrl: string;
}

export const ReviewRequest = ({
  customerName = "Valued Customer",
  orderId = "ORD-000000",
  reviewUrl = "http://localhost:3000/orders",
}: ReviewRequestProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Smartwear package has arrived! We&apos;d love your feedback.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Package Delivered! 🎉</Heading>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Great news! Your Smartwear order #{orderId} has been successfully delivered. 
            We hope you love your new premium activewear.
          </Text>

          <Text style={text}>
            We&apos;d love to hear what you think about the products. Your feedback helps us 
            continue to improve and helps other customers make informed decisions.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={reviewUrl}>
              Review Your Products
            </Button>
          </Section>

          <Text style={notice}>
            Note: You must be logged into your account to submit a review securely.
          </Text>

          <Text style={footer}>
            Enjoy your gear!
            <br />- The Smartwear Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReviewRequest;

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
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1a1a24',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 20px',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  margin: '40px 0',
};

const button = {
  backgroundColor: '#1a1a24',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
};

const notice = {
  color: '#888',
  fontSize: '12px',
  margin: '20px 0 0',
  fontStyle: 'italic',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  marginTop: '40px',
  textAlign: 'left' as const,
};
