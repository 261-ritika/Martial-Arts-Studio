const CONSENT_KEY = 'martial-arts-studio-analytics-consent-v1';
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? '';
const validMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId);
let lastPageView = '';

type ConsentChoice = 'accepted' | 'rejected';
type GtagWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

export const analyticsConfigured = validMeasurementId;

export function getAnalyticsConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === 'accepted' || stored === 'rejected' ? stored : null;
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Analytics remains disabled if the browser cannot save a consent choice.
  }
}

export function enableAnalytics() {
  if (!validMeasurementId) return;

  const gaWindow = window as GtagWindow;
  const disabledWindow = window as unknown as Window & Record<string, unknown>;
  disabledWindow[`ga-disable-${measurementId}`] = false;
  gaWindow.dataLayer ??= [];
  gaWindow.gtag ??= (...args: unknown[]) => gaWindow.dataLayer?.push(args);

  gaWindow.gtag('js', new Date());
  gaWindow.gtag('consent', 'update', { analytics_storage: 'granted' });
  gaWindow.gtag('config', measurementId, { send_page_view: false });

  const scriptId = `google-analytics-${measurementId}`;
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  trackPageView();
}

export function disableAnalytics() {
  if (!validMeasurementId) return;

  const disabledWindow = window as unknown as Window & Record<string, unknown>;
  disabledWindow[`ga-disable-${measurementId}`] = true;
  const gaWindow = window as GtagWindow;
  gaWindow.gtag?.('consent', 'update', { analytics_storage: 'denied' });

  document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => name.startsWith('_ga'))
    .forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
}

export function trackPageView(path = window.location.pathname) {
  if (!validMeasurementId || getAnalyticsConsent() !== 'accepted') return;

  const gaWindow = window as GtagWindow;
  if (!gaWindow.gtag) return;
  const pageViewKey = `${path}|${window.location.href}`;
  if (pageViewKey === lastPageView) return;

  gaWindow.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
  lastPageView = pageViewKey;
}

export const OPEN_COOKIE_SETTINGS_EVENT = 'martial-arts-studio:open-cookie-settings';

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
