import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { OrderProvider } from '@/context/OrderContext';
import { AuthProvider } from '@/context/AuthContext';
import { InboxProvider } from '@/context/InboxContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DashboardSidebar from '@/components/DashboardSidebar';

export const metadata: Metadata = {
  title: 'Smartwear | Premium Activewear',
  description: 'Premium mobile-first eCommerce app for Smartwear brand.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <OrderProvider>
                  <InboxProvider>
                    <SidebarProvider>
                      <div className="app-container">
                        <DashboardSidebar />
                        <Header />
                        <main style={{ flex: 1, paddingBottom: '20px' }}>
                          {children}
                        </main>
                        <BottomNav />
                      </div>
                    </SidebarProvider>
                  </InboxProvider>
                </OrderProvider>
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
