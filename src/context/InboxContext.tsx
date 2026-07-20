"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, setDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface InboxMessage {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  actionLink?: string;
  actionText?: string;
  userId: string;
}

interface InboxContextType {
  messages: InboxMessage[];
  unreadCount: number;
  addMessage: (message: Omit<InboxMessage, 'id' | 'read' | 'userId'>) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export function InboxProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<InboxMessage[]>([]);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    const q = query(collection(db, 'inbox'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: InboxMessage[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as InboxMessage);
      });
      // Sort newest first
      fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = messages.filter(m => !m.read).length;

  const addMessage = async (msgData: Omit<InboxMessage, 'id' | 'read' | 'userId'>) => {
    if (!user) return;
    try {
      const newRef = doc(collection(db, 'inbox'));
      await setDoc(newRef, {
        ...msgData,
        read: false,
        userId: user.uid
      });
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'inbox', messageId), { read: true });
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  return (
    <InboxContext.Provider value={{ messages, unreadCount, addMessage, markAsRead }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
}
