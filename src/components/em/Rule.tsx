import type { ReactNode } from 'react';
import { SplitWords } from './motion';
import em from './em.module.css';

/** "◆ — title — ◆" with an optional serif kicker above it; `long` stretches the rules across the row. */
export function Rule({ kicker, title, as = 'h2', long, split, className = '', id }: {
  kicker?: string; title: ReactNode; as?: 'h1' | 'h2' | 'p'; long?: boolean; split?: boolean; className?: string; id?: string;
}) {
  const T = as;
  return (
    <div className={`${em.rule2} ${long ? em.long : ''} ${className}`}>
      {kicker && (split ? <SplitWords as="p" className={em.kicker} text={kicker} /> : <p className={em.kicker}>{kicker}</p>)}
      <div className={em.ruleRow}>
        <i className={em.diamond} /><span className={em.line} />
        <T id={id}>{title}</T>
        <span className={em.line} /><i className={em.diamond} />
      </div>
    </div>
  );
}

/** Text with **bold** runs, as Afikey's copy is stored */
export function Rich({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/).map((t, i) => (t.startsWith('**') ? <b key={i}>{t.slice(2, -2)}</b> : t))}</>;
}

/** Blocks scraped from afikeynadlan.co.il: [kind, text] */
export function Blocks({ body }: { body: [string, string][] }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) { out.push(<ul key={out.length}>{list.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>); list = []; } };
  for (const [k, raw] of body) {
    const t = raw.replace(/^[\p{Extended_Pictographic}️\s]+/u, '');
    if (k === 'li') { list.push(t); continue; }
    flush();
    if (k === 'h') out.push(<h2 key={out.length}>{t}</h2>);
    else if (k === 'q') out.push(<blockquote key={out.length}><Rich text={t} /></blockquote>);
    else out.push(<p key={out.length}><Rich text={t} /></p>);
  }
  flush();
  return <>{out}</>;
}
