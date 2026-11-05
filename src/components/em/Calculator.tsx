'use client';

import { useId, useState } from 'react';
import em from './em.module.css';
import b from './blocks.module.css';
import s from './Calculator.module.css';

const ils = (n: number) => `₪${Math.round(n).toLocaleString('en-US')}`;

/**
 * Monthly payment on a fixed-rate loan (Spitzer / annuity): M = P·r / (1 − (1 + r)^−n), r = annual rate / 12.
 * Fields in Emerald's underlined style, results in its outlined number boxes. Illustration only: real
 * mortgages mix tracks, linkage and fees.
 */
export type Preset = { id: number; label: string; price: number };

export function Calculator({ defaultPrice = 2500000, compact, presets }: { defaultPrice?: number; compact?: boolean; presets?: Preset[] }) {
  const id = useId();
  const [price, setPrice] = useState(defaultPrice);
  const [equity, setEquity] = useState(Math.round(defaultPrice * 0.25));
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.5);
  const loan = Math.max(0, price - equity);
  const r = rate / 100 / 12, n = years * 12;
  const pay = loan === 0 ? 0 : r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  const ltv = price ? (loan / price) * 100 : 0;
  const pick = (v: string) => { const p = presets?.find((x) => String(x.id) === v); if (p) { setPrice(p.price); setEquity(Math.round(p.price * 0.25)); } };
  const fields: [string, number, (v: number) => void, number, number, number, string][] = [
    ['מחיר הנכס (₪)', price, setPrice, 100000, 20000000, 10000, ''],
    ['הון עצמי (₪)', equity, setEquity, 0, 20000000, 10000, ''],
    ['תקופה (שנים)', years, setYears, 4, 30, 1, ''],
    ['ריבית שנתית (%)', rate, setRate, 0, 15, 0.1, ''],
  ];
  return (
    <div className={`${em.frame} ${em.frameWide} ${s.calc}`} data-compact={compact || undefined}>
      {presets && (
        <label className={s.preset} htmlFor={`${id}-p`}>
          <span>חשבו לפי נכס מהמדף</span>
          <select id={`${id}-p`} defaultValue="" onChange={(e) => pick(e.target.value)}>
            <option value="" disabled>בחרו נכס…</option>
            {presets.map((p) => <option key={p.id} value={p.id}>{p.label} · ₪{p.price.toLocaleString('en-US')}</option>)}
          </select>
        </label>
      )}
      <form className={s.fields} onSubmit={(e) => e.preventDefault()}>
        {fields.map(([label, v, set, min, max, step], i) => (
          <label key={label} htmlFor={`${id}-${i}`}>
            <span>{label}</span>
            <input id={`${id}-${i}`} type="number" inputMode="decimal" dir="ltr" min={min} max={max} step={step} value={v}
              onChange={(e) => set(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} />
          </label>
        ))}
      </form>
      <ul className={`${b.boxes} ${s.out}`} aria-live="polite">
        <li className={em.frame}><b dir="ltr">{ils(pay)}</b><span>החזר חודשי משוער</span></li>
        <li className={em.frame}><b dir="ltr">{ils(loan)}</b><span>סכום המשכנתא</span></li>
        <li className={em.frame}><b dir="ltr">{ltv.toFixed(0)}%</b><span>אחוז מימון</span></li>
        <li className={em.frame}><b dir="ltr">{ils(pay * n - loan)}</b><span>סך הריבית</span></li>
      </ul>
      {ltv > 75 && <p className={s.warn}>אחוז המימון גבוה מ־75%. לרוכשי דירה יחידה בנק ישראל מגביל בדרך כלל את המימון ל־75% ממחיר הנכס.</p>}
      <p className={s.fine}>חישוב להמחשה בלבד, בריבית קבועה לכל התקופה. משכנתא בפועל בנויה ממסלולים, הצמדות ועמלות. כדאי לבדוק מול יועץ משכנתאות.</p>
    </div>
  );
}
