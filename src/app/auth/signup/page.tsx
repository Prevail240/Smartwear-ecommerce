"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import styles from '../auth.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWaitingForVerification, setIsWaitingForVerification] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWaitingForVerification && verifyingUser) {
      interval = setInterval(async () => {
        try {
          await verifyingUser.reload();
          if (verifyingUser.emailVerified) {
            clearInterval(interval);
            // Sign them out so they go through the normal signin flow securely
            await auth.signOut();
            router.push('/auth/signin');
          }
        } catch (error) {
          console.error("Error reloading user:", error);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWaitingForVerification, verifyingUser, router]);

  const validatePassword = (pass: string) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    if (pass.length < minLength) return 'Password must be at least 8 characters long.';
    if (!hasUpper) return 'Password must contain an uppercase letter.';
    if (!hasLower) return 'Password must contain a lowercase letter.';
    if (!hasNumber) return 'Password must contain a number.';
    if (!hasSpecial) return 'Password must contain a special character.';
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update their display name in Auth
      await updateProfile(user, { displayName: name });

      // 3. Create their profile document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        role: 'customer'
      });

      // 4. Send Verification Email
      await sendEmailVerification(user);
      
      // 5. Start waiting for verification
      setVerifyingUser(user);
      setIsWaitingForVerification(true);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || '',
          email: user.email || '',
          createdAt: new Date().toISOString(),
          role: 'customer',
          authProvider: 'google'
        });
      }
      
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Sign-Up failed.');
    } finally {
      setLoading(false);
    }
  };

  if (isWaitingForVerification) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.waitingContainer}>
            <Loader2 size={48} className={styles.spinner} />
            <h2 className={styles.waitingTitle}>Verify Your Email</h2>
            <p className={styles.waitingText}>
              We've sent a verification link to <strong>{email}</strong>. 
              Please check your inbox (and spam folder) and click the link to activate your account.
              <br/><br/>
              This page will automatically redirect you once your email is verified!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Smartwear today.</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.icon} />
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.icon} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className={styles.input}
              />
              <button 
                type="button" 
                className={styles.rightIconBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className={styles.helperText}>Requires 8+ chars, upper, lower, number, & special char.</span>
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Creating Account...' : (
              <>Sign Up <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or continue with</span>
        </div>

        <button type="button" onClick={handleGoogleSignUp} disabled={loading} className={styles.ssoBtn}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className={styles.googleIcon} />
          Sign up with Google
        </button>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/auth/signin" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
