import { ArrowLeft } from 'lucide-react';
import { SeoHead } from '@/components/seo-head';
import { sitePath } from '@/lib/site';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <SeoHead
        title="Page not found | Martial Arts Studio"
        description="This page could not be found. Return to Martial Arts Studio in Neelbad, Bhopal."
        noIndex
      />
      <div className="not-found-panel">
        <span className="section-kicker">404 · Off the mat</span>
        <h1>That page isn’t here.</h1>
        <p>The link may be out of date, or the address may have a typo.</p>
        <a className="button button-primary" href={sitePath('/')}>
          <ArrowLeft size={15} /> Back to the studio
        </a>
      </div>
    </main>
  );
}
