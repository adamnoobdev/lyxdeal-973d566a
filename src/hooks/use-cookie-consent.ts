
import { useState, useEffect } from 'react';

export type CookieConsentStatus = 'accepted' | 'rejected' | 'pending';

export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>('pending');

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    if (storedConsent === 'accepted') {
      setConsentStatus('accepted');
    } else if (storedConsent === 'rejected') {
      setConsentStatus('rejected');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setConsentStatus('accepted');
    
    // Initialize Google Tag Manager
    if (window.dataLayer) {
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
    }
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setConsentStatus('rejected');
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
