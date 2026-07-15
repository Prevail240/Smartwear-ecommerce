"use client";

import { useInbox } from '@/context/InboxContext';
import { Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function InboxPage() {
  const { messages, markAsRead } = useInbox();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inbox</h1>
      </div>

      <div className={styles.messageList}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <Mail size={48} className={styles.emptyIcon} />
            <p>You have no messages right now.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.messageCard} ${!msg.read ? styles.unread : ''}`}
              onClick={() => {
                if (!msg.read) markAsRead(msg.id);
              }}
            >
              <div className={styles.msgHeader}>
                <h3 className={styles.msgTitle}>{msg.title}</h3>
                <span className={styles.msgDate}>
                  {new Date(msg.date).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.msgContent}>{msg.content}</p>
              
              {msg.actionLink && (
                <Link href={msg.actionLink} className={styles.actionBtn}>
                  {msg.actionText || 'View Details'} <ChevronRight size={16} />
                </Link>
              )}
              
              {!msg.read && <div className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
