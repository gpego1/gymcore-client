'use client';

import { money } from '@/lib/domain';
export function RevenueChart({
  current,
  period = 'semestre'
}: {
  current: number;
  period?: string;
}) {
  const values = period === 'trimestre' ? [640, 780, current] : [480, 620, 540, 760, 820, current];
  const max = Math.max(...values) * 1.3;
  const width = 600;
  const height = 170;
  const pts = values.map((v, i) => [i / (values.length - 1) * width, height - v / max * height]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p.join(',')).join(' ');
  const labels = period === 'trimestre' ? ['Ago', 'Set', 'Out'] : ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
  return <div className="revenue-chart">
    <div className="chart-axis">{[max, max / 2, 0].map(v => <span key={v}>{money(v)}</span>)}</div>
    <div className="chart-plot">
      <svg viewBox="0 0 600 190" role="img" aria-label={'Receita simulada de ' + labels[0] + ' a outubro. Valor atual ' + money(current)} preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3478F6" stopOpacity=".3" />
            <stop offset="100%" stopColor="#3478F6" stopOpacity="0" />
          </linearGradient>
        </defs>{[30, 90, 160].map(y => <path key={y} d={'M0 ' + y + 'H600'} stroke="#22324B" strokeDasharray="3 5" />)}<path d={line + ' L600,190 L0,190Z'} fill="url(#revenue-fill)" />
        <path d={line} fill="none" stroke="#5C97FF" strokeWidth="3" vectorEffect="non-scaling-stroke" />{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#0B1423" stroke="#8DB8FF" strokeWidth="2" />)}</svg>
      <div className="chart-labels">{labels.map(m => <span key={m}>{m}</span>)}</div>
    </div>
  </div>;
}
export function FrequencyChart() {
  const values = [35, 63, 80, 71, 90, 48, 20];
  return <div className="frequency-chart" role="img" aria-label="Distribuição fictícia da frequência: pico na sexta-feira, menor movimento no domingo.">{values.map((value, i) => <div key={i}>
      <div className="frequency-track">
        <span style={{
          height: value + '%'
        }} className={i === 4 ? 'bar-highlight' : ''} />
      </div>
      <small>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</small>
    </div>)}</div>;
}
export function EvolutionChart() {
  return <svg className="evolution-chart" viewBox="0 0 340 120" role="img" aria-label="Carga no supino: agosto 20 kg, setembro 25 kg, outubro 30 kg">
    <path d="M15 25H325 M15 65H325 M15 105H325" stroke="#233550" strokeDasharray="3 5" />
    <path d="M20 98L90 82 160 65 230 45 320 22" fill="none" stroke="#78D7F0" strokeWidth="3" />{[[20, 98], [90, 82], [160, 65], [230, 45], [320, 22]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4" fill="#78D7F0" />)}</svg>;
}
