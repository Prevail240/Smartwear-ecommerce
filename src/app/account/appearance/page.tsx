"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeft, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme, Accent } from '@/context/ThemeContext';
import styles from './page.module.css';

export default function AppearanceSettings() {
  const router = useRouter();
  const { theme, setTheme, accent, setAccent, highContrast, setHighContrast } = useTheme();

  const themes: { id: Theme; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'system',
      name: 'System Default',
      icon: <Monitor size={18} />,
      desc: 'Matches your operating system settings',
    },
    {
      id: 'light',
      name: 'Light Theme',
      icon: <Sun size={18} />,
      desc: 'Clean, bright aesthetic for daytime use',
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      icon: <Moon size={18} />,
      desc: 'Sleek, dark aesthetic to reduce eye strain',
    }
  ];

  const accents: { id: Accent; className: string }[] = [
    { id: 'blue', className: styles.swatchBlue },
    { id: 'red', className: styles.swatchRed },
    { id: 'orange', className: styles.swatchOrange },
    { id: 'green', className: styles.swatchGreen },
    { id: 'dark', className: styles.swatchDark },
    { id: 'light', className: styles.swatchLight },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Appearance</h1>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Theme preferences</h2>
        <div className={styles.themeGrid}>
          {themes.map((t) => (
            <div 
              key={t.id}
              className={`${styles.themeCard} ${theme === t.id ? styles.active : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <div className={styles.themeHeader}>
                <div className={styles.themeIcon}>
                  {t.icon}
                  <span>{t.name}</span>
                </div>
                {theme === t.id && <span className={styles.activeBadge}>Active</span>}
              </div>
              <p className={styles.themeDesc}>{t.desc}</p>
              
              <div className={styles.previewWindow}>
                <div className={styles.previewHeader}>
                  <div className={styles.previewDot} />
                  <div className={styles.previewDot} />
                  <div className={styles.previewDot} />
                </div>
                <div className={styles.previewBody}>
                  <div className={styles.previewContent}>
                    <div className={styles.previewAccent} />
                  </div>
                  <div className={styles.previewSidebar} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.accentGroup}>
          <div className={styles.accentTitle}>Accent Color</div>
          <div className={styles.swatchRow}>
            {accents.map((a) => (
              <button
                key={a.id}
                className={`${styles.swatch} ${a.className} ${accent === a.id ? styles.active : ''}`}
                onClick={() => setAccent(a.id)}
                aria-label={`Select ${a.id} accent`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contrast</h2>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h3>Increase contrast</h3>
            <p>Enable maximum contrast between background and text for improved readability.</p>
          </div>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={highContrast} 
              onChange={(e) => setHighContrast(e.target.checked)} 
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </section>
    </div>
  );
}
