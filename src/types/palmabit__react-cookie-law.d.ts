// src/types/palmabit__react-cookie-law.d.ts
declare module '@palmabit/react-cookie-law' {
  import * as React from 'react';

  type Handler = () => void;

  interface CookieBannerStyles {
    dialog?: React.CSSProperties;
    container?: React.CSSProperties;
    message?: React.CSSProperties;
    policy?: React.CSSProperties;
    selectPane?: React.CSSProperties;
    optionWrapper?: React.CSSProperties;
    optionLabel?: React.CSSProperties;
    checkbox?: React.CSSProperties;
    buttonWrapper?: React.CSSProperties;
    button?: React.CSSProperties;
  }

  export interface CookieBannerProps {
    className?: string;
    message: string;
    wholeDomain?: boolean;
    policyLink?: string;
    privacyPolicyLinkText?: string;

    necessaryOptionText?: string;
    preferencesOptionText?: string;
    statisticsOptionText?: string;
    marketingOptionText?: string;

    acceptButtonText?: string;
    declineButtonText?: string;
    managePreferencesButtonText?: string;
    savePreferencesButtonText?: string;

    showDeclineButton?: boolean;
    dismissOnScroll?: boolean;
    showPreferencesOption?: boolean;
    showStatisticsOption?: boolean;
    showMarketingOption?: boolean;

    preferencesDefaultChecked?: boolean;
    statisticsDefaultChecked?: boolean;
    marketingDefaultChecked?: boolean;

    styles?: CookieBannerStyles;

    onAccept?: Handler;
    onAcceptPreferences?: Handler;
    onAcceptStatistics?: Handler;
    onAcceptMarketing?: Handler;
    onDeclinePreferences?: Handler;
    onDeclineStatistics?: Handler;
    onDeclineMarketing?: Handler;

    // Corypha (optional integration)
    coryphaUserId?: string;
    coryphaDocumentCode?: string;
    coryphaDocumentLanguage?: string;
    coryphaApiKey?: string;
    onAcceptCoryphaPreferences?: Handler;
    onDeclineCoryphaPreferences?: Handler;
  }

  export const CookieBanner: React.FC<CookieBannerProps>;
}
