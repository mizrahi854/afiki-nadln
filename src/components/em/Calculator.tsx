'use client';

import { useId, useState } from 'react';
import s from './Calculator.module.css';

const ils = (n: number) => `₪${Math.round(n).toLocaleString('en-US')}`;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Mortgage calculator. Monthly payment on a fixed-rate loan (Spitzer / annuity): M = P·r / (1 − (1 + r)^−n),
 * r = annual rate / 12. Every value has a slider and an editable number; the donut shows what the whole deal
 * is made of (equity / loan / interest) with the monthly payment in its centre. The layout follows its own
 * width (container query): side by side when there is room, stacked in the side panel and on phones.
 * Illustration only: real mortgages mix tracks, linkage and fees.
 */
export type Preset = { id: number; label: string; price: number };

const COLORS = { equity: '#b9c6cd', loan: '#17303e', interest: '#c7d31b' };

function Donut({ parts, center, sub }: { parts: { v: number; c: string }[]; center: string; sub: string }) {
  const R = 46, C = 2 * Math.PI * R;
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  let off = 0;
  return (
    <div className={s.donut}>
      <svg viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(23,48,62,.08)" strokeWidth="14" />
        {parts.map((p, i) => {
          const len = (p.v / total) * C;
          const el = <circle key={i} className={s.seg} cx="60" cy="60" r={R} fill="none" stroke={p.c} strokeWidth="14"
            strokeDasharray={`${Math.max(0, len - 0.6)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 60 60)" />;
          off += len;
          return el;
        })}
      </svg>
      <div className={s.center}><b dir="ltr">{center}</b><span>{sub}</span></div>
    </div>
  );
}

function Field({ id, label, value, set, min, max, step, show }: {
  id: string; label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; show: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={s.field}>
      <div className={s.fieldTop}>
        <label htmlFor={id}>{label}</label>
        <input className={s.num} type="number" inputMode="decimal" dir="ltr" min={min} max={max} step={step} value={value}
          aria-label={label} onChange={(e) => set(clamp(Number(e.target.value) || 0, min, max))} />
      </div>
      <input id={id} className={s.range} type="range" min={min} max={max} step={step} value={value}
        style={{ ['--p' as string]: `${pct}%` }} aria-valuetext={show} onChange={(e) => set(Number(e.target.value))} />
    </div>
  );
}

export function Calculator({ defaultPrice = 2500000, compact, presets }: { defaultPrice?: number; compact?: boolean; presets?: Preset[] }) {
  const id = useId();
  const [price, setPrice] = useState(defaultPrice);
  const [eqPct, setEqPct] = useState(25);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.5);
  const equity = Math.round((price * eqPct) / 100);
  const loan = Math.max(0, price - equity);
  const r = rate / 100 / 12, n = years * 12;
  const pay = loan === 0 ? 0 : r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  const interest = Math.max(0, pay * n - loan);
  const ltv = 100 - eqPct;
  const pick = (v: string) => { const p = presets?.find((x) => String(x.id) === v); if (p) setPrice(p.price); };
  const legend = [
    { k: 'הון עצמי', v: equity, c: COLORS.equity },
    { k: 'סכום המשכנתא', v: loan, c: COLORS.loan },
    { k: 'סך הריבית', v: interest, c: COLORS.interest },
  ];

  return (
    <div className={s.calc} data-compact={compact || undefined}>
      <div className={s.inputs}>
        {presets && (
          <label className={s.preset} htmlFor={`${id}-p`}>
            <span>חשבו לפי נכס מהמדף</span>
            <select id={`${id}-p`} defaultValue="" onChange={(e) => pick(e.target.value)}>
              <option value="" disabled>בחרו נכס…</option>
              {presets.map((p) => <option key={p.id} value={p.id}>{p.label} · ₪{p.price.toLocaleString('en-US')}</option>)}
            </select>
          </label>
        )}
        <Field id={`${id}-price`} label="מחיר הנכס (₪)" value={price} set={setPrice} min={300000} max={12000000} step={10000} show={ils(price)} />
        <Field id={`${id}-eq`} label={`הון עצמי (%) · ${ils(equity)}`} value={eqPct} set={setEqPct} min={10} max={100} step={1} show={`${eqPct}%`} />
        <Field id={`${id}-years`} label="תקופה (שנים)" value={years} set={setYears} min={4} max={30} step={1} show={`${years} שנים`} />
        <Field id={`${id}-rate`} label="ריבית שנתית (%)" value={rate} set={setRate} min={1} max={10} step={0.05} show={`${rate}%`} />
      </div>

      <div className={s.result} aria-live="polite">
        <Donut parts={legend.map((x) => ({ v: x.v, c: x.c }))} center={ils(pay)} sub="החזר חודשי משוער" />
        <ul className={s.legend}>
          {legend.map((x) => (
            <li key={x.k}><i style={{ background: x.c }} aria-hidden /><span>{x.k}</span><b dir="ltr">{ils(x.v)}</b></li>
          ))}
          <li className={s.sum}><span>אחוז מימון</span><b dir="ltr">{ltv}%</b></li>
          <li className={s.sum}><span>סה״כ תשלומים לבנק</span><b dir="ltr">{ils(pay * n)}</b></li>
        </ul>
      </div>

      {ltv > 75 && <p className={s.warn}>אחוז המימון גבוה מ־75%. לרוכשי דירה יחידה בנק ישראל מגביל בדרך כלל את המימון ל־75% ממחיר הנכס.</p>}
      <p className={s.fine}>חישוב להמחשה בלבד, בריבית קבועה לכל התקופה. משכנתא בפועל בנויה ממסלולים, הצמדות ועמלות. כדאי לבדוק מול יועץ משכנתאות.</p>
    </div>
  );
}
