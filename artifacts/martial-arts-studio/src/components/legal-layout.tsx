import type { ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SeoHead } from '@/components/seo-head';
import { sitePath } from '@/lib/site';

type LegalLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalLayout({ title, description, children }: LegalLayoutProps) {
  return (
    <div className="legal-shell">
      <SeoHead title={`${title} | Martial Arts Studio`} description={description} />
      <header className="legal-header">
        <a className="brand" href={sitePath('/')} aria-label="Martial Arts Studio home">
          <img className="brand-logo" src={sitePath('/images/studio-logo.webp')} alt="" width="505" height="522" />
          <span className="brand-copy">
            <strong>Martial Arts Studio</strong>
            <small>Neelbad · Bhopal</small>
          </span>
        </a>
        <a className="legal-back" href={sitePath('/')}>
          <ArrowLeft size={15} /> Back to studio
        </a>
      </header>
      <main className="legal-main">
        <div className="legal-heading">
          <span className="section-kicker">Martial Arts Studio · Neelbad, Bhopal</span>
          <h1>{title}</h1>
          <p className="legal-updated">Effective date: 5 October 2026</p>
        </div>
        <aside className="legal-disclaimer">
          This page is an informational summary of the website’s current practices, not legal advice.
          Consult a qualified lawyer about legal rights or obligations.
        </aside>
        <article className="legal-content">{children}</article>
        <nav className="legal-crosslinks" aria-label="Legal pages">
          <a href={sitePath('/privacy-policy')}>Privacy Policy</a>
          <a href={sitePath('/terms-and-conditions')}>Terms &amp; Conditions</a>
          <a href="mailto:ritikalakoti179@gmail.com">Privacy contact</a>
          <a href={sitePath('/#contact')}>Contact the studio <ArrowUpRight size={13} /></a>
        </nav>
      </main>
      <footer className="legal-footer">
        <span>Shubham Dwivedi · Martial Arts Studio</span>
        <span>Bhadbhada Road, Neelbad, Bhopal, Madhya Pradesh 462044</span>
      </footer>
    </div>
  );
}
