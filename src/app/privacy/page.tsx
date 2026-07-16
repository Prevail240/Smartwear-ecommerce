import styles from '../legal.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, shipping address, payment information, and any other details you choose to provide.</p>
      </div>

      <div className={styles.section}>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to process your transactions, manage your account, send you related information including order confirmations and updates, respond to your comments and questions, and improve our services and app experience.</p>
      </div>

      <div className={styles.section}>
        <h2>3. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to maintain the safety of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
      </div>

      <div className={styles.section}>
        <h2>4. Sharing of Information</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our app, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
      </div>

      <div className={styles.section}>
        <h2>5. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. You may update your account details directly in the app or contact us for assistance.</p>
      </div>
    </div>
  );
}
