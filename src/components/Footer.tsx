import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>SMARTWEAR</h3>
          <p className={styles.description}>
            Premium activewear engineered for elite performance. Upgrade your workout gear today.
          </p>
        </div>
        
        <div className={styles.section}>
          <h3>Legal</h3>
          <ul className={styles.links}>
            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Contact Us</h3>
          <ul className={styles.contactInfo}>
            <li>
              <MapPin size={16} />
              <span>123 Performance Way, Suite 400<br/>San Francisco, CA 94105</span>
            </li>
            <li>
              <Mail size={16} />
              <span>support@smartwear-app.com</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+1 (800) 555-0199</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Smartwear Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
