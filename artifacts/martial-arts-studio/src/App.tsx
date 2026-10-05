import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { CookieConsent } from '@/components/cookie-consent';
import { SeoHead } from '@/components/seo-head';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { openCookieSettings, trackPageView } from '@/lib/analytics';
import { sitePath } from '@/lib/site';
import NotFound from '@/pages/not-found';
import PrivacyPolicy from '@/pages/privacy-policy';
import TermsAndConditions from '@/pages/terms-and-conditions';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Instagram, MapPin, Menu, Phone, X } from 'lucide-react';
import './index.css';

const queryClient = new QueryClient();
const INSTAGRAM = 'https://www.instagram.com/martialartsstudio.in/';
const INSTAGRAM_HANDLE = '@martialartsstudio.in';
const PHONE = '+918959993070';
const PHONE_LABEL = '+91 89599 93070';
const ADDRESS = 'Bhadbhada Road, Main Road, near SBI Bank, near Durga Mandir, Neelbad, Bhopal, Madhya Pradesh 462044';
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const navItems = [
  ['Home', '#home'], ['Training', '#training'], ['About', '#about'],
  ['Coach', '#coach'], ['Contact', '#contact'], ['FAQ', '#faq'],
];

const services = [
  { title: 'Boxing', description: 'Build speed, precision, footwork and striking fundamentals.', detail: 'Sharpen the basics through focused combinations, movement, defence and conditioning. Start at your level and build with every round.', symbol: '01' },
  { title: 'Jiu-Jitsu', description: 'Learn grappling, control, technique and ground fighting.', detail: 'Practice positional control, escapes and submissions with technique first. Learn to stay composed and solve problems under pressure.', symbol: '02' },
  { title: 'Kickboxing', description: 'Combine powerful punches, kicks, movement and conditioning.', detail: 'Connect hands and legs with timing, balance and clean combinations. Sessions pair skill work with athletic conditioning.', symbol: '03' },
  { title: 'MMA', description: 'Train across striking, grappling and mixed martial arts fundamentals.', detail: 'Build a rounded foundation across striking, takedowns and ground work. Progress through fundamentals at a pace that makes sense.', symbol: '04' },
  { title: 'Taekwondo', description: 'Develop kicking technique, flexibility, speed, discipline and control.', detail: 'Develop precise kicking mechanics, mobility, balance and control through disciplined practice.', symbol: '05' },
  { title: 'Wrestling', description: 'Build strength, balance, takedown ability and explosive movement.', detail: 'Work on stance, level changes, takedowns and positional control while building full-body strength and confidence.', symbol: '06' },
  { title: 'CrossFit / Bodyweight / Endurance', description: 'Improve strength, conditioning, stamina, mobility and overall athletic performance.', detail: 'A practical mix of strength, bodyweight movement, conditioning and endurance to support your training on and off the mats.', symbol: '07' },
];

const studioPhotos = [
  { src: sitePath('/images/studio-class.webp'), alt: 'Students training together on the studio’s red and blue mats', label: 'Classes in session', width: 433, height: 741 },
  { src: sitePath('/images/studio-trophy-wall.webp'), alt: 'Trophies displayed inside Martial Arts Studio', label: 'Studio achievements', width: 467, height: 582 },
  { src: sitePath('/images/studio-boxing.webp'), alt: 'Young athlete practicing boxing at the studio', label: 'Boxing practice', width: 437, height: 472 },
  { src: sitePath('/images/studio-fundamentals.webp'), alt: 'Athlete working on boxing fundamentals in the studio', label: 'Build the basics', width: 413, height: 620 },
  { src: sitePath('/images/studio-conditioning.webp'), alt: 'Athlete doing strength and conditioning work at the studio', label: 'Strength and conditioning', width: 406, height: 566 },
];

const faqs = [
  ['What martial arts do you teach?', 'Boxing, Jiu-Jitsu, Kickboxing, MMA, Taekwondo, Wrestling and fitness/conditioning training.'],
  ['Do I need previous martial arts experience?', 'No. Beginners can start with the fundamentals and gradually progress.'],
  ['Do you provide fitness and conditioning training?', 'Yes. Training includes CrossFit-style conditioning, bodyweight exercises, endurance and general athletic development.'],
  ['What is the training time?', 'Training runs from 5:00 to 6:30.'],
  ['What is the monthly fee?', 'The fee is ₹1,000 per month for an individual.'],
  ['Where is the studio located?', `${ADDRESS}.`],
  ['How can I contact the studio?', `Call ${PHONE_LABEL} or message ${INSTAGRAM_HANDLE} on Instagram.`],
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Martial Arts Studio home">
      <img className="brand-logo" src={sitePath('/images/studio-logo.webp')} alt="" width="505" height="522" />
      <span className="brand-copy"><strong>Martial Arts Studio</strong><small>Neelbad · Bhopal</small></span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <a className="button button-primary header-action" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
        Start Training <ArrowUpRight size={14} />
      </a>
      <button className="mobile-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {navItems.map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
        <a className="button button-primary" href={INSTAGRAM} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Start Training <ArrowUpRight size={14} /></a>
      </nav>
    </header>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [kickActive, setKickActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 0.82)));
        const kick = Math.max(0, Math.min(1, (progress - 0.16) / 0.37, (0.88 - progress) / 0.22));
        const force = Math.max(0, kick);
        hero.style.setProperty('--standing-opacity', String(1 - force));
        hero.style.setProperty('--kick-opacity', String(force));
        hero.style.setProperty('--fighter-x', `${force * 16}px`);
        hero.style.setProperty('--fighter-y', `${-force * 3}px`);
        hero.style.setProperty('--fighter-scale', String(1 + force * 0.045));
        hero.style.setProperty('--card-x', `${force * 118}px`);
        hero.style.setProperty('--card-y', `${-force * 27}px`);
        hero.style.setProperty('--card-r', `${force * 8}deg`);
        setKickActive(force > 0.63);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">Neelbad · Bhopal · Training ground</div>
        <h1 id="hero-title"><span>Martial Arts</span><span>Studio</span></h1>
        <p className="hero-lead">Train your body. Sharpen your mind. Build your discipline.</p>
        <p className="hero-desc">Professional martial arts and fitness training in Neelbad, Bhopal — from striking and grappling to strength, endurance and conditioning.</p>
        <div className="hero-actions">
          <a className="button button-primary" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Start Training <ArrowUpRight size={15} /></a>
          <a className="button button-ghost" href="#about">Explore Studio <ArrowDownRight size={15} /></a>
        </div>
      </div>
      <div className="fighter-stage">
        <div className="fighter-halo" />
        <img className="fighter-img fighter-standing" src={sitePath('/images/fighter-standing.webp')} alt="Martial artist standing in a focused fighting stance" width="1024" height="1024" fetchPriority="high" />
        <img className="fighter-img fighter-kick" src={sitePath('/images/fighter-kick.webp')} alt="Martial artist extending a full roundhouse kick" width="1024" height="1024" loading="lazy" />
      </div>
      <aside className={`hero-card ${kickActive ? 'is-hit' : ''}`} aria-live="polite">
        <small>{kickActive ? 'Impact / 01' : 'Training note / 01'}</small>
        <strong>{kickActive ? 'Make it count.' : 'Earn every round.'}</strong>
        <p>{kickActive ? 'Commit to the movement. Let the work speak.' : 'Technique first. Consistency always.'}</p>
        <span className="card-line" />
        <small>Move with purpose</small>
      </aside>
      <div className="hero-caption">Discipline begins here</div>
      <div className="hero-index"><strong>01</strong> / 07 &nbsp; Neelbad, Bhopal</div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cardRef.current.style.setProperty('--my', `${(x - 0.5) * 4}deg`);
    cardRef.current.style.setProperty('--mx', `${(0.5 - y) * 4}deg`);
  };
  const resetTilt = () => {
    cardRef.current?.style.setProperty('--mx', '0deg');
    cardRef.current?.style.setProperty('--my', '0deg');
  };
  return (
    <button
      className="service-card"
      type="button"
      ref={cardRef}
      aria-expanded={expanded}
      aria-controls={`service-detail-${index}`}
      onClick={() => setExpanded((value) => !value)}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="service-top"><span className="service-no">DISCIPLINE / {service.symbol}</span><span className="service-symbol" aria-hidden="true"><ArrowUpRight size={17} /></span></div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="service-detail" id={`service-detail-${index}`}><div>{service.detail}</div></div>
      <span className="service-more">{expanded ? 'Close details' : 'Explore discipline'} <ArrowRight size={13} /></span>
    </button>
  );
}

function Training() {
  return (
    <>
      <section className="section training-section" id="training" aria-labelledby="training-title">
        <div className="training-top">
          <div className="section-head">
            <span className="section-kicker">Find your discipline</span>
            <h2 id="training-title">Train. Fight. Evolve.</h2>
            <p className="section-intro">One studio. Multiple disciplines. One goal — become stronger than yesterday.</p>
          </div>
          <p className="discipline-count"><strong>07</strong> ways to put in the work</p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
        </div>
      </section>
      <div className="kick-transition" aria-hidden="true"><span>01 / Make the first move</span><i /><span>Skill · Strength · Resolve</span></div>
    </>
  );
}

function Manifesto() {
  return (
    <section className="section manifesto" aria-label="Training philosophy">
      <div className="manifesto-content">
        <div>
          <span className="section-kicker">The work, every day</span>
          <h2>Your limits are not your <em>destination.</em></h2>
        </div>
        <div className="manifesto-lines">
          <p>Discipline over excuses.</p>
          <p>Progress over perfection.</p>
          <p>Strength through consistency.</p>
          <p>Train with purpose.</p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="about-layout">
        <div className="about-copy">
          <span className="section-kicker">Explore the studio</span>
          <h2 id="about-title">More than training. It's a discipline.</h2>
          <p>Martial Arts Studio brings martial arts together with strength, conditioning, endurance and fitness. A neighborhood training ground in Neelbad for learning skills, building a stronger body and showing up with purpose.</p>
          <div className="about-facts" aria-label="Training time and fees">
            <div><span>Training time</span><strong>5:00–6:30</strong></div>
            <div><span>Individual fee</span><strong>₹1,000 <small>/ month</small></strong></div>
          </div>
          <div className="discipline-tags" aria-label="Training offered">
            {['Boxing', 'Jiu-Jitsu', 'Kickboxing', 'MMA', 'Taekwondo', 'Wrestling', 'CrossFit', 'Bodyweight', 'Endurance'].map((item) => <span key={item}>{item}</span>)}
          </div>
          <a className="button button-ghost" href="#contact">Find the studio <ArrowDownRight size={14} /></a>
        </div>
        <div className="studio-gallery" aria-label="Photos of Martial Arts Studio">
          {studioPhotos.map((photo) => (
            <figure className="studio-photo" key={photo.src}>
              <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              <figcaption>{photo.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Coach() {
  return (
    <section className="section coach-section" id="coach" aria-labelledby="coach-title">
      <div className="coach-layout">
        <div className="coach-portrait">
          <img src={sitePath('/images/coach-portrait.webp')} alt="Martial Arts Studio coach in a black training jacket" width="472" height="561" loading="lazy" decoding="async" />
          <span className="coach-photo-caption">Coach / Instructor</span>
        </div>
        <div className="coach-copy">
          <span className="section-kicker">Guidance in every round</span>
          <h2 id="coach-title">Meet your coach.</h2>
          <div className="coach-name">Coach</div>
          <div className="coach-role">Martial Arts Coach</div>
          <p>Learn with focused guidance, sound fundamentals and steady progression. Whether you're taking your first step or refining your game, training starts with showing up.</p>
          <a className="social-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> Studio Instagram · {INSTAGRAM_HANDLE} <ArrowUpRight size={14} /></a>
          <div><a className="button button-primary" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Train with us <ArrowUpRight size={15} /></a></div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section location-section" id="contact" aria-labelledby="contact-title">
      <div className="section-head">
        <span className="section-kicker">A real place. Your next step.</span>
        <h2 id="contact-title">Find your fight.<br />Find your place.</h2>
      </div>
      <div className="location-grid">
        <article className="location-card">
          <div className="location-pin"><MapPin size={19} /></div>
          <h3>Martial Arts Studio</h3>
          <span className="location-area">Neelbad, Bhopal</span>
          <address>{ADDRESS}</address>
        </article>
        <div className="location-side">
          <div className="location-art" aria-hidden="true"><span /></div>
            <p>Step into a serious training space for striking, grappling, strength and conditioning. Call the studio or find us on Instagram.</p>
          <div className="contact-actions">
            <a className="button button-primary" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={14} /></a>
              <a className="button button-ghost" href={`tel:${PHONE}`} aria-label={`Call Martial Arts Studio at ${PHONE_LABEL}`}><Phone size={14} /> {PHONE_LABEL}</a>
              <a className="button button-ghost" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><Instagram size={14} /> {INSTAGRAM_HANDLE}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCallout() {
  return (
    <section className="section cta-section" aria-labelledby="cta-title">
      <div className="cta-inner">
        <span className="section-kicker">Your next round starts here</span>
        <h2 id="cta-title">Ready to start training?</h2>
        <p>Your first step is simple. Show up.</p>
        <div className="hero-actions">
          <a className="button button-primary" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Start Training <ArrowUpRight size={15} /></a>
          <a className="button button-ghost" href="#contact">Contact Us <ArrowDownRight size={15} /></a>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-layout">
        <div className="faq-heading">
          <span className="section-kicker">First steps, clear answers</span>
          <h2 id="faq-title">Frequently asked questions.</h2>
          <p>Good training starts with knowing what to expect. Here's what beginners often ask.</p>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            return (
              <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
                <button className="faq-question" type="button" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpenIndex(isOpen ? null : index)}>
                  <span>{question}</span><span className="faq-plus" aria-hidden="true">+</span>
                </button>
                <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-label={question} aria-hidden={!isOpen}>
                  <div><p>{answer}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const trainingLinks = services.slice(0, 4);
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Brand />
          <p className="footer-description">A neighborhood training ground for striking, grappling, strength and discipline in Neelbad, Bhopal.</p>
        </div>
        <div className="footer-col">
          <strong>Explore</strong>
          <nav className="footer-nav" aria-label="Footer navigation">{navItems.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav>
        </div>
        <div className="footer-col">
          <strong>Train</strong>
          <nav className="footer-nav" aria-label="Training disciplines">{trainingLinks.map((item) => <a href="#training" key={item.title}>{item.title}</a>)}</nav>
        </div>
        <div className="footer-col">
          <strong>Find the studio</strong>
          <p className="footer-description">Neelbad, Bhopal<br />Madhya Pradesh 462044</p>
          <a className="social-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><Instagram size={14} /> {INSTAGRAM_HANDLE}</a>
          <a className="social-link" href={`tel:${PHONE}`}><Phone size={14} /> {PHONE_LABEL}</a>
          <a className="button button-primary" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Start Training <ArrowUpRight size={13} /></a>
        </div>
      </div>
      <nav className="footer-legal" aria-label="Legal and privacy">
        <a href={sitePath('/privacy-policy')}>Privacy Policy</a>
        <a href={sitePath('/terms-and-conditions')}>Terms &amp; Conditions</a>
        <button type="button" onClick={openCookieSettings}>Cookie settings</button>
      </nav>
      <div className="footer-bottom"><span>Martial Arts Studio · Neelbad, Bhopal</span><span>Train with purpose. <a href="#home">Back to top ↑</a></span></div>
    </footer>
  );
}

function Home() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    let frame = 0;
    const syncArena = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--facility-scroll', `${window.scrollY}px`);
        header?.classList.toggle('is-scrolled', window.scrollY > 24);
      });
    };
    window.addEventListener('scroll', syncArena, { passive: true });
    window.addEventListener('resize', syncArena);
    syncArena();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', syncArena);
      window.removeEventListener('resize', syncArena);
      root.style.removeProperty('--facility-scroll');
      header?.classList.remove('is-scrolled');
    };
  }, []);

  return (
    <>
      <SeoHead
        title="Martial Arts Training in Bhopal | Martial Arts Studio"
        description="Train boxing, Jiu-Jitsu, kickboxing, MMA and fitness at Martial Arts Studio in Neelbad, Bhopal. Build skill, strength and discipline with focused coaching."
      />
      <main className="site-shell">
        <Header />
        <Hero />
        <Training />
        <Manifesto />
        <About />
        <Coach />
        <Contact />
        <FinalCallout />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}

function AnalyticsPageTracker() {
  const [location] = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  return null;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-and-conditions" component={TermsAndConditions} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
          <AnalyticsPageTracker />
        </WouterRouter>
        <Toaster />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;