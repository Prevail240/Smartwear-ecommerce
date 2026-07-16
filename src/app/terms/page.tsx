import styles from '../legal.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms & Conditions</h1>
      <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className={styles.section}>
        <h2>1. Introduction</h2>
        <p>Welcome to Smartwear. By accessing and using our application, you agree to comply with and be bound by the following terms and conditions of use. If you disagree with any part of these terms, please do not use our application.</p>
      </div>

      <div className={styles.section}>
        <h2>2. Intellectual Property Rights</h2>
        <p>Unless otherwise stated, Smartwear Inc. owns the intellectual property rights for all material on the app. All intellectual property rights are reserved. You may access this from Smartwear for your own personal use subjected to restrictions set in these terms.</p>
      </div>

      <div className={styles.section}>
        <h2>3. User Account</h2>
        <p>If you create an account on our app, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.</p>
      </div>

      <div className={styles.section}>
        <h2>4. Purchases and Payments</h2>
        <p>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product availability, errors in the description or price of the product, or error in your order. We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.</p>
      </div>

      <div className={styles.section}>
        <h2>5. Limitation of Liability</h2>
        <p>In no event shall Smartwear, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this app. Smartwear shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this app.</p>
      </div>
    </div>
  );
}
