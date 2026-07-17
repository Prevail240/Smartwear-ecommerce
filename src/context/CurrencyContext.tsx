"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type CurrencyContextType = {
  currencyCode: string;
  currencySymbol: string;
  formatPrice: (priceInNgn: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const COUNTRY_CURRENCY_MAP: Record<string, { code: string, symbol: string }> = {
  NG: { code: 'NGN', symbol: '₦' },
  US: { code: 'USD', symbol: '$' },
  GB: { code: 'GBP', symbol: '£' },
  FR: { code: 'EUR', symbol: '€' },
  DE: { code: 'EUR', symbol: '€' },
  IT: { code: 'EUR', symbol: '€' },
  ES: { code: 'EUR', symbol: '€' },
  CA: { code: 'CAD', symbol: 'C$' },
  AU: { code: 'AUD', symbol: 'A$' },
  ZA: { code: 'ZAR', symbol: 'R' },
  KE: { code: 'KES', symbol: 'KSh' },
  GH: { code: 'GHS', symbol: 'GH₵' },
  // Default will fallback to USD if not found
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<{ code: string, symbol: string }>({ code: 'NGN', symbol: '₦' });
  const [exchangeRate, setExchangeRate] = useState<number>(1); // NGN to Local

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        // 1. Get Country from Vercel Edge Header via our API
        const geoRes = await fetch('/api/geo');
        const geoData = await geoRes.json();
        const countryCode = geoData.country || 'NG';
        
        let targetCurrency = COUNTRY_CURRENCY_MAP[countryCode] || { code: 'USD', symbol: '$' };
        if (countryCode === 'NG') targetCurrency = { code: 'NGN', symbol: '₦' };

        setCurrency(targetCurrency);

        if (targetCurrency.code === 'NGN') {
          setExchangeRate(1);
          return;
        }

        // 2. Fetch Exchange Rate securely via our Next.js API route
        // The API route handles the 24-hour caching on the server side
        const rateRes = await fetch('/api/rates');
        if (!rateRes.ok) throw new Error('Failed to fetch rates from local API');
        
        const rateData = await rateRes.json();
        const rate = rateData.rates?.[targetCurrency.code];
        
        if (rate) {
          setExchangeRate(rate);
        }
      } catch (error) {
        console.error("Failed to initialize currency:", error);
      }
    };

    initializeCurrency();
  }, []);

  const formatPrice = (priceInNgn: number) => {
    const converted = priceInNgn * exchangeRate;
    return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currencyCode: currency.code, currencySymbol: currency.symbol, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
