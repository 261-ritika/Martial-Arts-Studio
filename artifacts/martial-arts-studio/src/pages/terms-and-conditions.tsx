import { LegalLayout } from '@/components/legal-layout';
import { sitePath } from '@/lib/site';

export default function TermsAndConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      description="Review the terms for using the Martial Arts Studio website in Neelbad, Bhopal, including acceptable use, external links, website availability, and applicable laws."
    >
      <section>
        <h2>1. About these terms</h2>
        <p>
          These terms apply to your use of the Martial Arts Studio website operated by Shubham
          Dwivedi in Neelbad, Bhopal, India. By accessing the website, you agree to use it lawfully
          and in line with these terms.
        </p>
      </section>

      <section>
        <h2>2. Website information</h2>
        <p>
          This is an informational website about the studio and its training. It does not create an
          account, accept a booking, take payment, or confirm a place in a class. Training times,
          fees, and availability can change; contact the studio to confirm current details.
        </p>
        <p>
          There is no age restriction for using this website. Separate conditions may apply to
          participation in studio classes; these website terms do not replace any class enrolment,
          safety, or participation requirements.
        </p>
      </section>

      <section>
        <h2>3. Acceptable use</h2>
        <p>
          Do not use the website to break the law, interfere with its operation or security, attempt
          unauthorized access, distribute malware, or send automated traffic that disrupts the
          service. Do not misrepresent yourself when contacting the studio.
        </p>
      </section>

      <section>
        <h2>4. Website content and external links</h2>
        <p>
          The studio name, logo, text, photographs, and site design are provided for information
          about Martial Arts Studio. Do not copy or reuse them commercially without permission,
          except where applicable law permits.
        </p>
        <p>
          The website links to third-party services, including Instagram and Google Maps. The
          studio does not control their content, availability, privacy practices, or terms.
        </p>
      </section>

      <section>
        <h2>5. Availability and accuracy</h2>
        <p>
          The website is provided for general information and may be changed, interrupted, or
          unavailable from time to time. The studio works to keep information accurate but does not
          promise that every detail is complete or current. Confirm important training or fee
          information directly with the studio.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>
          To the extent permitted by applicable law, the studio is not responsible for losses caused
          by relying on outdated website information, interruption of the site, or third-party
          services outside its control. Nothing in these terms limits a right or liability that
          cannot legally be limited.
        </p>
      </section>

      <section>
        <h2>7. Privacy</h2>
        <p>
          Use of this website is also covered by the{' '}
          <a href={sitePath('/privacy-policy')}>Privacy Policy</a>, which explains the site’s current data
          practices and privacy choices.
        </p>
      </section>

      <section>
        <h2>8. Changes and applicable law</h2>
        <p>
          These terms may be updated when the website or its practices change. The effective date
          above identifies the current version. These terms are governed by the applicable laws of
          India, subject to rights that cannot be excluded under applicable law.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          For questions about these terms, contact Shubham Dwivedi at{' '}
          <a href="mailto:ritikalakoti179@gmail.com">ritikalakoti179@gmail.com</a> or call{' '}
          <a href="tel:+918959993070">+91 89599 93070</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
