import { LegalLayout } from '@/components/legal-layout';
import { openCookieSettings } from '@/lib/analytics';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Learn what data the Martial Arts Studio website in Neelbad, Bhopal handles, how analytics consent works, and how to contact us about your privacy choices."
    >
      <section>
        <h2>1. Who operates this website</h2>
        <p>
          This website is for Martial Arts Studio in Neelbad, Bhopal, India. The site operator is
          Shubham Dwivedi. For privacy questions, contact{' '}
          <a href="mailto:ritikalakoti179@gmail.com">ritikalakoti179@gmail.com</a> or call{' '}
          <a href="tel:+918959993070">+91 89599 93070</a>.
        </p>
      </section>

      <section>
        <h2>2. Information collected through this website</h2>
        <p>
          The site currently has no contact, signup, booking, or payment form and does not create
          visitor accounts. It does not accept personal details through an on-site form.
        </p>
        <p>
          The hosting provider may process technical request and security information needed to
          deliver and protect the site, such as an IP address, requested page, browser or device
          details, and request time. Hosting-provider processing is governed by the provider’s own
          terms and privacy practices.
        </p>
        <p>
          If you call the studio or follow a link to Instagram or Google Maps, you choose to share
          information with those services or with the studio outside this website. Their own
          privacy policies apply to those interactions.
        </p>
      </section>

      <section id="cookies">
        <h2>3. Cookies, local storage, and analytics</h2>
        <p>
          Google Analytics is not currently configured on this website, so the site does not
          currently set Google Analytics cookies. The site may use browser local storage to remember
          whether a visitor dismissed the cookie notice or selected an analytics preference.
        </p>
        <p>
          If optional analytics are enabled in the future, they will remain off unless you accept
          them through the consent banner. You can reject optional analytics or reopen your choice
          using the cookie settings control when it is available. A future change to analytics will
          be reflected here before tracking is enabled.
        </p>
        <button className="button button-ghost legal-cookie-settings" type="button" onClick={openCookieSettings}>
          Cookie settings
        </button>
      </section>

      <section>
        <h2>4. How information is used and retained</h2>
        <p>
          The site uses technical information for delivery, security, and reliability. Because the
          site has no submission form or account system, it does not store contact-form entries or
          account profiles. The hosting provider controls its own operational-log retention.
        </p>
        <p>
          Information you share directly by phone or through a third-party service may be used to
          respond to your enquiry. Retention and deletion for those communications depend on the
          channel used and any applicable legal requirements.
        </p>
      </section>

      <section>
        <h2>5. Your choices and requests</h2>
        <p>
          You may contact the operator at{' '}
          <a href="mailto:ritikalakoti179@gmail.com">ritikalakoti179@gmail.com</a> to ask about
          personal information associated with a direct enquiry or to request correction or
          deletion, subject to applicable law and information held by third-party providers.
        </p>
        <p>
          This website has no age restriction. The site does not provide online accounts or collect
          personal details from children through a form. Parents or guardians may contact the
          operator with privacy concerns.
        </p>
      </section>

      <section>
        <h2>6. Security and third-party services</h2>
        <p>
          When published on Replit, the website is served using HTTPS with a platform-managed TLS
          certificate. Links to Instagram, Google Maps, and phone services leave this website and
          are governed by those providers’ terms and privacy notices.
        </p>
      </section>

      <section>
        <h2>7. Changes to this policy</h2>
        <p>
          This policy may be updated when the website’s features or data practices change. The
          effective date at the top of this page will be updated when a revision is published.
        </p>
      </section>
    </LegalLayout>
  );
}
