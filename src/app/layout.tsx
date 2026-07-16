import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { OrderProvider } from '@/context/OrderContext';
import { AuthProvider } from '@/context/AuthContext';
import { InboxProvider } from '@/context/InboxContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              var theme = localStorage.getItem('app-theme') || 'system';
              var accent = localStorage.getItem('app-accent') || 'blue';
              var contrast = localStorage.getItem('app-contrast') === 'true';
              
              var effectiveTheme = theme;
              if (theme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              
              document.documentElement.setAttribute('data-theme', effectiveTheme);
              document.documentElement.setAttribute('data-accent', accent);
              if (contrast) document.documentElement.setAttribute('data-contrast', 'high');
            } catch (e) {}
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
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
                          <Footer />
                        </div>
                      </SidebarProvider>
                    </InboxProvider>
                  </OrderProvider>
                </CartProvider>
              </WishlistProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
