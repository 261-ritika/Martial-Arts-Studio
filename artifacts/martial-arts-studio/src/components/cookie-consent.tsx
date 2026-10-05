import { useEffect, useState } from 'react';
import {
  analyticsConfigured,
  disableAnalytics,
  enableAnalytics,
  getAnalyticsConsent,
  OPEN_COOKIE_SETTINGS_EVENT,
  saveAnalyticsConsent,
} from '@/lib/analytics';
import { sitePath } from '@/lib/site';

const NOTICE_KEY = 'martial-arts-studio-cookie-notice-dismissed-v1';

function wasNoticeDismissed() {
  try {
    return window.localStorage.getItem(NOTICE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>(() => getAnalyticsConsent());
  const [noticeDismissed, setNoticeDismissed] = useState(wasNoticeDismissed);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    if (getAnalyticsConsent() === 'accepted') enableAnalytics();
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const visible = settingsOpen || (analyticsConfigured ? choice === null : !noticeDismissed);
  if (!visible) return null;

  const dismissNotice = () => {
    try {
      window.localStorage.setItem(NOTICE_KEY, 'true');
    } catch {
      // The notice can still be dismissed for the current page view.
    }
    setNoticeDismissed(true);
    setSettingsOpen(false);
  };

  const choose = (nextChoice: 'accepted' | 'rejected') => {
    saveAnalyticsConsent(nextChoice);
    setChoice(nextChoice);
    setSettingsOpen(false);
    if (nextChoice === 'accepted') enableAnalytics();
    else disableAnalytics();
  };

  return (
    <section className="cookie-banner" aria-label="Cookie preferences">
      <div className="cookie-copy">
        <strong>{analyticsConfigured ? 'Your privacy choice' : 'Cookie notice'}</strong>
        <p>
          {analyticsConfigured
            ? 'Optional analytics are off unless you accept. You can change your choice at any time.'
            : 'Optional analytics cookies are not currently active. If analytics is enabled later, it will remain off until you consent.'}
        </p>
      </div>
      <div className="cookie-actions">
        {analyticsConfigured ? (
          <>
            <button className="button button-ghost cookie-reject" type="button" onClick={() => choose('rejected')}>
              Reject optional
            </button>
            <button className="button button-primary" type="button" onClick={() => choose('accepted')}>
              Accept analytics
            </button>
          </>
        ) : (
          <button className="button button-primary" type="button" onClick={dismissNotice}>
            Got it
          </button>
        )}
        <a className="cookie-policy-link" href={sitePath('/privacy-policy#cookies')}>
          Privacy details
        </a>
      </div>
    </section>
  );
}
