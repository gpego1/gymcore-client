'use client';

import Link from 'next/link';
import { features } from '@/lib/features';
import { useId, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMock } from '@/lib/store';
import { metrics, money, number, classes } from '@/lib/domain';
import { downloadCsv } from '@/lib/export';
import { Icon } from './icons';
import { Avatar, Badge, Button, PageHeading, Panel, DemoNote } from './ui';
import { RevenueChart, FrequencyChart } from './charts';

const chartTabs = ['Receita', 'Frequência'] as const;

export function Dashboard() {
  const { state, notify } = useMock();
  const m = metrics(state);
  const params = useSearchParams();
  const router = useRouter();
  const period = params.get('periodo') === 'trimestre' ? 'trimestre' : 'semestre';
  const [chart, setChart] = useState(0);
  const chartId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const overdueStudents = state.students.filter(student => student.daysLate > 0);

  return <div className="overview-page">
    <PageHeading eyebrow="SEGUNDA-FEIRA, 12 DE OUTUBRO · DEMO" title="Cada dia, mais forte." description="Sua academia em perspectiva. Os números essenciais, as próximas decisões." actions={<>
      <Button variant="secondary" onClick={() => {
        downloadCsv('gymcore-resumo.csv', [['Indicador', 'Valor'], ['Alunos ativos', m.active], ['Receita', m.revenue], ['Inadimplentes', m.overdue], ['Visitas', m.visits]]);
        notify('Resumo demonstrativo exportado em CSV.');
      }}><Icon name="download" size={16} />Exportar</Button>
      <Button asChild><Link href="/painel/matriculas"><Icon name="plus" size={18} />Nova matrícula</Link></Button>
    </>} />

    <section className="overview-section" aria-labelledby="overview-summary-title">
      <div className="overview-section-heading">
        <div><span className="eyebrow">01 / O ESSENCIAL</span><h2 id="overview-summary-title">Seu negócio, agora.</h2></div>
        <Badge tone="info"><Icon name="pulse" size={13} />Sua academia está em movimento</Badge>
      </div>
      <div className="overview-metrics">
        <Link href="/painel/financeiro" className="overview-metric overview-metric-revenue">
          <div className="overview-metric-label"><span>Receita do mês</span><span className="overview-metric-icon"><Icon name="money" size={22} /></span></div>
          <strong className="overview-metric-value">{money(m.revenue)}</strong>
          <p>Mensalidades + vendas simuladas</p>
          <div className="overview-metric-footer"><span>Outubro · receita recebida</span><span>Ver financeiro<Icon name="arrow" size={16} /></span></div>
        </Link>
        <Link href="/painel/alunos" className="overview-metric">
          <div className="overview-metric-label"><span>Alunos ativos</span><span className="overview-metric-icon"><Icon name="students" size={22} /></span></div>
          <strong className="overview-metric-value">{number(m.active)}</strong>
          <p>Matrículas ativas na demo</p>
          <div className="overview-metric-footer"><span>Acompanhar alunos</span><Icon name="arrow" size={16} /></div>
        </Link>
        <Link href="/painel/inadimplencia" className={'overview-metric ' + (m.overdue ? 'overview-metric-debt' : '')}>
          <div className="overview-metric-label"><span>Inadimplência</span><span className="overview-metric-icon"><Icon name={m.overdue ? 'warning' : 'check'} size={22} /></span></div>
          <strong className="overview-metric-value">{money(m.debt)}</strong>
          <p>{m.overdue ? `${m.overdue} alunos precisam de atenção` : 'Nenhuma mensalidade em atraso'}</p>
          <div className="overview-metric-footer"><Badge tone={m.overdue ? 'danger' : 'success'}>{m.overdue ? 'Requer atenção' : 'Operação em dia'}</Badge><Icon name="arrow" size={16} /></div>
        </Link>
      </div>
    </section>

    <section className="overview-section" aria-labelledby="overview-performance-title">
      <div className="overview-section-heading"><div><span className="eyebrow">02 / ACOMPANHE O RITMO</span><h2 id="overview-performance-title">Uma visão mais ampla.</h2></div><span className="overview-section-note">Indicadores da amostra demonstrativa</span></div>
      <div className="overview-performance">
        <section className="panel overview-chart-panel" aria-label="Análise de desempenho">
          <div className="overview-chart-header">
            <div className="overview-chart-tabs" role="tablist" aria-label="Indicador do gráfico">
              {chartTabs.map((label, index) => <button key={label} ref={element => { tabRefs.current[index] = element; }} type="button" role="tab"
                id={`${chartId}-tab-${index}`} aria-selected={chart === index} aria-controls={`${chartId}-panel-${index}`} tabIndex={chart === index ? 0 : -1}
                onClick={() => setChart(index)} onKeyDown={event => {
                  const next = event.key === 'Home' ? 0 : event.key === 'End' ? chartTabs.length - 1 : event.key === 'ArrowRight' ? (index + 1) % chartTabs.length : event.key === 'ArrowLeft' ? (index + chartTabs.length - 1) % chartTabs.length : null;
                  if (next === null) return;
                  event.preventDefault();
                  setChart(next);
                  tabRefs.current[next]?.focus();
                }}><Icon name={index ? 'pulse' : 'money'} size={17} />{label}</button>)}
            </div>
            {chart === 0 && <select aria-label="Período da receita" name="periodo" value={period} onChange={event => router.replace('/painel?periodo=' + event.target.value, { scroll: false })}>
              <option value="semestre">Últimos 6 meses</option><option value="trimestre">Últimos 3 meses</option>
            </select>}
          </div>
          <div role="tabpanel" id={`${chartId}-panel-0`} aria-labelledby={`${chartId}-tab-0`} hidden={chart !== 0} tabIndex={0} className="overview-chart-content">
            <div className="overview-chart-intro"><div><h3>Evolução da receita</h3><p>Consistência hoje. Crescimento amanhã.</p></div><Badge tone="info">Histórico ilustrativo</Badge></div>
            <RevenueChart current={m.revenue} period={period} />
            <div className="chart-legend"><span><i />Receita recebida</span><small>Histórico ilustrativo · valores em reais</small></div>
          </div>
          <div role="tabpanel" id={`${chartId}-panel-1`} aria-labelledby={`${chartId}-tab-1`} hidden={chart !== 1} tabIndex={0} className="overview-chart-content">
            <div className="overview-chart-intro"><div><h3>Ritmo da academia</h3><p>Distribuição semanal ilustrativa · {number(m.visits)} visitas registradas na amostra</p></div><Badge tone="info">Semana ilustrativa</Badge></div>
            <FrequencyChart />
            <div className="frequency-note"><Icon name="fire" size={18} /><span>Sexta é o seu dia de maior movimento.</span></div>
          </div>
        </section>
        <aside className="overview-pulse" aria-labelledby="overview-pulse-title">
          <h3 id="overview-pulse-title">Movimento & retenção</h3>
          <div className="overview-pulse-item"><span className="overview-pulse-icon"><Icon name="pulse" size={20} /></span><div><span>Frequência registrada</span><strong>{number(m.visits)} <small>visitas</small></strong></div></div>
          {features.leads && <Link href="/painel/leads" className="overview-pulse-item"><span className="overview-pulse-icon"><Icon name="lead" size={20} /></span><div><span>Conversão de leads</span><strong>{Math.round(m.conversion)}<small>%</small></strong></div><Icon name="arrow" size={16} /></Link>}
          <div className="overview-pulse-item"><span className="overview-pulse-icon"><Icon name="refresh" size={20} /></span><div><span>Churn da amostra</span><strong>0<small>%</small></strong><p>Sem cancelamentos</p></div></div>
          <p className="overview-pulse-note"><Icon name="shield" size={14} />Dados fictícios, sem integração com backend.</p>
        </aside>
      </div>
    </section>

    <section className="overview-section" aria-labelledby="overview-today-title">
      <div className="overview-section-heading"><div><span className="eyebrow">03 / DO NÚMERO À AÇÃO</span><h2 id="overview-today-title">Seu próximo passo.</h2></div></div>
      <div className="overview-routine" style={!features.classes ? { gridTemplateColumns: '1fr' } : undefined}>
        {features.classes && <Panel title="Acontece hoje" description="A energia que move sua academia" action={<Link className="text-link" href="/painel/aulas">Ver agenda<Icon name="arrow" size={16} /></Link>}>
          <div className="agenda-preview">{classes.slice(0, 3).map((item, index) => <Link href="/painel/aulas" className="agenda-row overview-agenda-row" key={item.id}>
            <time>{item.time}</time><span className={'class-marker marker-' + index} />
            <div><strong>{item.name}</strong><small>{item.teacher} · {item.room}</small></div>
            <span className="agenda-capacity">{item.occupied}/{item.capacity}<small>alunos</small></span>
          </Link>)}</div>
        </Panel>}
        <Panel className="overview-attention" title="Pontos de atenção" description="Pequenas ações, grandes resultados" action={<span className="attention-count">{m.overdue}</span>}>
          <div className="attention-content">{overdueStudents.slice(0, 2).map(student => <Link key={student.id} href={'/painel/alunos/' + student.id} className="attention-row">
            <Avatar name={student.name} /><span><strong>{student.name}</strong><small>Mensalidade · {student.daysLate} dias em atraso</small></span><Icon name="arrow" size={16} />
          </Link>)}{!m.overdue && <p className="overview-no-debt"><Icon name="check" size={20} />Nenhuma mensalidade em atraso na amostra.</p>}
            <Link href="/painel/inadimplencia" className="attention-cta">Acompanhar inadimplência<Icon name="arrow" size={16} /></Link>
          </div>
        </Panel>
      </div>
    </section>
    <DemoNote />
  </div>;
}
