
import { useState, useEffect } from 'react';

export type CookieConsentStatus = 'accepted' | 'rejected' | 'pending';

export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>('pending');

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    if (storedConsent === 'accepted') {
      setConsentStatus('accepted');
      initializeGTM();
    } else if (storedConsent === 'rejected') {
      setConsentStatus('rejected');
    }
  }, []);

  const initializeGTM = () => {
    // Initialisera Google Tag Manager när användaren har accepterat cookies
    if (window.dataLayer) {
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setConsentStatus('accepted');
    initializeGTM();
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setConsentStatus('rejected');
    
    // Om GTM är laddat, meddela att användaren har avböjt cookies
    if (window.dataLayer) {
      window.dataLayer.push({
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  };

  const resetCookieConsent = () => {
    localStorage.removeItem('cookie-consent');
    setConsentStatus('pending');
  };

  return {
    consentStatus,
    acceptCookies,
    rejectCookies,
    resetCookieConsent,
  };
}
