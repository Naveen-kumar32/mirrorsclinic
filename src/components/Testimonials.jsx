import { useEffect, useRef, useState } from 'react';
import { REVIEWS, CONTACT, img } from '../data';
import { SectionLabel, SplitWords } from './ui';

/* Google-reviews-style widget.
   REVIEWS (src/data/people.js) holds the review content. Replace it with your
   real Google reviews — copy name, rating, date and text from your Google
   Business Profile. Rating + count below are calculated from that list. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function timeAgo(label) {
  const [m, y] = label.split(' ');
  const month = MONTHS.indexOf(m);
  if (month < 0 || !y) return label;
  const now = new Date();
  const diff = (now.getFullYear() - Number(y)) * 12 + (now.getMonth() - month);
  if (diff <= 0) return 'this month';
  if (diff === 1) return 'a month ago';
  if (diff < 12) return `${diff} months ago`;
  const yrs = Math.floor(diff / 12);
  return yrs === 1 ? 'a year ago' : `${yrs} years ago`;
}

const AVATAR_COLORS = ['#1a73e8', '#e8710a', '#188038', '#d93025', '#9334e6', '#12b5cb', '#c5221f', '#5f6368'];
const avatarColor = (name) => AVATAR_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

function GStars({ rating, size = 18 }) {
  return (
    <span className="gr-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i + 1));
        return (
          <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <defs>
              <linearGradient id={`gs-${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#fbbc04" />
                <stop offset={`${fill * 100}%`} stopColor="#dadce0" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#gs-${i}-${Math.round(fill * 100)})`}
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function GoogleG({ size = 20 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const photoSrc = (p, w) => (/^(https?:)?\/|^data:/.test(p) ? p : img(p, w));

function Lightbox({ photos, start, name, onClose }) {
  const [i, setI] = useState(start);
  const n = photos.length;
  const go = (d) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="gr-lightbox" role="dialog" aria-modal="true" aria-label={`Photos from ${name}`} onClick={onClose}>
      <div className="gr-lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <span>
          {name} · {i + 1} / {n}
        </span>
        <button onClick={onClose} aria-label="Close photos">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <img src={photoSrc(photos[i], 1600)} alt={`Photo ${i + 1} from ${name}'s review`} onClick={(e) => e.stopPropagation()} />
      {n > 1 && (
        <>
          <button className="gr-lightbox__nav is-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
          </button>
          <button className="gr-lightbox__nav is-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
          </button>
        </>
      )}
    </div>
  );
}

function ReviewPhotos({ photos, name }) {
  const [open, setOpen] = useState(null);
  const shown = photos.slice(0, 3);
  const extra = photos.length - shown.length;
  return (
    <>
      <div className="gr-photos">
        {shown.map((p, i) => (
          <button key={p + i} className="gr-photo" onClick={() => setOpen(i)} aria-label={`View photo ${i + 1} of ${photos.length}`}>
            <img src={photoSrc(p, 480)} alt="" loading="lazy" />
            {i === shown.length - 1 && extra > 0 && <span className="gr-photo__more">+{extra}</span>}
          </button>
        ))}
      </div>
      {open !== null && <Lightbox photos={photos} start={open} name={name} onClose={() => setOpen(null)} />}
    </>
  );
}

function ReviewCard({ r }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 140;
  return (
    <article className="gr-card">
      <header className="gr-card__head">
        <span className="gr-avatar" style={{ background: avatarColor(r.name) }} aria-hidden="true">
          {r.name[0]}
        </span>
        <span className="gr-card__who">
          <strong>{r.name}</strong>
          <small>{timeAgo(r.date)}</small>
        </span>
        <GoogleG size={20} />
      </header>
      <div className="gr-card__rating">
        <GStars rating={r.rating} size={17} />
        <svg className="gr-verified" viewBox="0 0 24 24" width="16" height="16" aria-label="Verified">
          <path fill="#1a73e8" d="m23 12-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69z" />
          <path fill="#fff" d="m10.09 16.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48z" />
        </svg>
      </div>
      <p className={`gr-card__text ${open ? 'is-open' : ''}`}>{r.text}</p>
      {long && (
        <button className="gr-card__more" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide' : 'Read more'}
        </button>
      )}
      {r.photos?.length > 0 && <ReviewPhotos photos={r.photos} name={r.name} />}
    </article>
  );
}

export default function Testimonials() {
  const track = useRef(null);
  const count = REVIEWS.length;
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / count;
  const label = avg >= 4.5 ? 'EXCELLENT' : avg >= 4 ? 'VERY GOOD' : 'GOOD';

  const scroll = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('.gr-card');
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="stories section">
      <div className="stories__head">
        <SectionLabel>Patient stories</SectionLabel>
        <h2 className="h2">
          <SplitWords text="Kind words from *real* skin." />
        </h2>
      </div>

      <div className="gr">
        <aside className="gr-summary">
          <strong className="gr-summary__label">{label}</strong>
          <GStars rating={avg} size={26} />
          <span className="gr-summary__count">
            Based on <b>{count} reviews</b>
          </span>
          <span className="gr-summary__logo" aria-label="Google">
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </span>
          <a className="gr-summary__btn" href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
            Review us on Google
          </a>
        </aside>

        <div className="gr-carousel">
          <button className="gr-arrow gr-arrow--prev" onClick={() => scroll(-1)} aria-label="Previous reviews">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <div className="gr-track" ref={track}>
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name + r.date} r={r} />
            ))}
          </div>
          <button className="gr-arrow gr-arrow--next" onClick={() => scroll(1)} aria-label="Next reviews">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path fill="currentColor" d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
