'use client';

import { useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { PHONE } from '@/lib/content';
import { EMAIL } from '@/lib/core';
import { Rule } from './Rule';
import em from './em.module.css';
import s from './blocks.module.css';

/**
 * Emerald's "LET'S TALK" block: a wide outlined octagon holding the title row, a line of text and a one-row form
 * (four underlined fields + the octagon button) with a consent box under it.
 * No form backend in this demo: sending opens a pre-filled e-mail to the office address.
 */
export function ContactFrame({ title = 'בואו נמצא לכם את הבית הבא', subject, subjects = ['קניית נכס', 'מכירת נכס', 'הערכת שווי', 'שאלה כללית'] }: {
  title?: string; subject?: string; subjects?: string[];
}) {
  const [sent, setSent] = useState(false);
  const opts = subject && !subjects.includes(subject) ? [subject, ...subjects] : subjects;
  return (
    <section id="contact" className={`${em.wrap} ${s.talkWrap}`} aria-labelledby="talk-title">
      <div className={`${em.frame} ${em.frameWide} ${s.talk}`}>
        <Rule kicker="דברו איתנו" title={title} id="talk-title" />
        <p className={s.talkSub}>השאירו פרטים ויוסי חיים מאפיקי נדל״ן יחזור אליכם בהקדם:</p>
        <form className={s.form} onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const body = ['שם', 'טלפון', 'אימייל', 'נושא'].map((k) => `${k}: ${f.get(k) ?? ''}`).join('\n');
          location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`פנייה מהאתר: ${f.get('נושא')}`)}&body=${encodeURIComponent(body)}`;
          setSent(true);
        }}>
          <label><span className="sr-only">שם מלא</span><input name="שם" required autoComplete="name" placeholder="שם מלא *" /></label>
          <label><span className="sr-only">אימייל</span><input name="אימייל" type="email" required autoComplete="email" placeholder="אימייל *" /></label>
          <label><span className="sr-only">טלפון</span><input name="טלפון" type="tel" required autoComplete="tel" placeholder="טלפון *" dir="rtl" /></label>
          <label className={s.sel}><span className="sr-only">נושא הפנייה</span>
            <select name="נושא" defaultValue={opts[0]}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
          </label>
          <button className={em.poly} type="submit"><ArrowLeft aria-hidden strokeWidth={1.4} />שליחת פרטים</button>
          <label className={s.consent}><input type="checkbox" required name="הסכמה" /> אני מאשר/ת שיחזרו אליי בנוגע לפנייה</label>
        </form>
        <a className={s.wa} href={`https://wa.me/972${PHONE.replace(/-/g, '').slice(1)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden strokeWidth={1.5} />מעדיפים וואטסאפ? כתבו ליוסי ישירות
        </a>
        <p className={s.sent} aria-live="polite">{sent ? 'נפתחה הודעת אימייל עם הפרטים. אם לא נפתחה, אפשר לכתוב ישירות ל־' + EMAIL : ''}</p>
      </div>
    </section>
  );
}
