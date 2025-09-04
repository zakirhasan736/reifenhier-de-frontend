"use client"
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const CookieBanner = dynamic(
  () => import('@palmabit/react-cookie-law').then(m => m.CookieBanner),
  { ssr: false }
);

type Consent = 'granted' | 'denied';

function updateGtag(partial: Record<string, Consent>, eventName?: string) {
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (...args: any[]) => window.dataLayer.push(args);
    gtag('consent', 'update', partial);

    if (eventName) {
        window.dataLayer.push({
            event: eventName,
            consent: partial,
            timestamp: new Date().toISOString(),
        } as unknown);
    }
}

export default function CookiesBanner() {
useEffect(() => {
  const observer = new MutationObserver(() => {
    const banner = document.querySelector('.custom-cookie-banner');
    if (banner && !banner.classList.contains('slide-up')) {
      banner.classList.add('slide-up');
      observer.disconnect(); // cleanup
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);


  return (
    <CookieBanner
      message="Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Sie können Kategorien auswählen. Mehr in unserer Datenschutzerklärung."
      policyLink="/datenschutz"
      privacyPolicyLinkText="Datenschutzerklärung"
      necessaryOptionText="Notwendig"
      preferencesOptionText="Präferenzen"
      statisticsOptionText="Statistik"
      marketingOptionText="Marketing"
      acceptButtonText="Alle akzeptieren"
      declineButtonText="Alle ablehnen"
      managePreferencesButtonText="Einstellungen"
      savePreferencesButtonText="Speichern & schließen"
      showDeclineButton
      wholeDomain
      dismissOnScroll={false}
      preferencesDefaultChecked={false}
      statisticsDefaultChecked={false}
      marketingDefaultChecked={false}
      coryphaDocumentLanguage="de"
      onAccept={() =>
        updateGtag(
          {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          },
          'consent_all_accepted'
        )
      }
      onAcceptStatistics={() =>
        updateGtag(
          { analytics_storage: 'granted' },
          'consent_statistics_accepted'
        )
      }
      onDeclineStatistics={() =>
        updateGtag(
          { analytics_storage: 'denied' },
          'consent_statistics_declined'
        )
      }
      onAcceptMarketing={() =>
        updateGtag(
          {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          },
          'consent_marketing_accepted'
        )
      }
      onDeclineMarketing={() =>
        updateGtag(
          {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          },
          'consent_marketing_declined'
        )
      }
      styles={{
        dialog: {
          position: 'fixed',
          bottom: 24,
          right: 24,
          maxWidth: 420,
          width: 'calc(100vw - 32px)',
          padding: 20,
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          fontFamily: 'Poppins, sans-serif',
          zIndex: 9999,
        },
        container: {
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        },
        message: {
          fontSize: 16,
          lineHeight: 1.6,
          color: '#16171a',
        },
        policy: {
          color: '#3a64f6',
          fontWeight: 600,
          fontSize: 14,
          textDecoration: 'underline',
          cursor: 'pointer',
        },
        selectPane: {
          background: '#f9fafb',
          padding: 12,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        },
        optionWrapper: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        },
        optionLabel: {
          fontSize: 13,
          color: '#1f2937',
        },
        checkbox: {
          width: 18,
          height: 18,
          accentColor: '#3a64f6',
          cursor: 'pointer',
        },
        buttonWrapper: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 8,
        },
        button: {
          background: '#3a64f6',
          color: '#ffffff',
          borderRadius: 6,
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '',
        },
      }}
      className="custom-cookie-banner"
    />
  );
}
