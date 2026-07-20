"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Order } from '@/data/orders';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  cancelItem: (orderId: string, itemId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        // Sort by date or id descending
        fetchedOrders.sort((a, b) => b.id.localeCompare(a.id));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const addOrder = async (order: Order) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'orders', order.id), {
        ...order,
        userId: user.uid
      });
      setOrders(prev => [order, ...prev]);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const cancelItem = async (orderId: string, itemId: string) => {
    if (!user) return;
    
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const updatedItems = order.items.map(item => {
        if (item.id === itemId) {
          return { ...item, status: 'CANCELED' as const };
        }
        return item;
      });

      // Update in Firestore in background
      const updatedOrder = { ...order, items: updatedItems };
      updateDoc(doc(db, 'orders', orderId), { items: updatedItems }).catch(console.error);

      return updatedOrder;
    }));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelItem }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
