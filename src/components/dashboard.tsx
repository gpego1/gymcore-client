'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMock } from '@/lib/store';
import { metrics, money, number, classes } from '@/lib/domain';
import { downloadCsv } from '@/lib/export';
import { Icon } from './icons';
import { Avatar, Badge, Button, PageHeading, Panel, Stat, DemoNote } from './ui';
import { RevenueChart, FrequencyChart } from './charts';
export function Dashboard() {
  const {
    state,
    notify
  } = useMock();
  const m = metrics(state);
  const params = useSearchParams();
  const router = useRouter();
  const period = params.get('periodo') === 'trimestre' ? 'trimestre' : 'semestre';
  return <>
    <PageHeading eyebrow="SEGUNDA-FEIRA, 12 DE OUTUBRO · DEMO" title="Cada dia, mais forte." description="Uma visão clara do seu negócio. Mais espaço para o que importa." actions={<>
      <Button variant="secondary" onClick={() => {
        downloadCsv('gymcore-resumo.csv', [['Indicador', 'Valor'], ['Alunos ativos', m.active], ['Receita', m.revenue], ['Inadimplentes', m.overdue], ['Visitas', m.visits]]);
        notify('Resumo demonstrativo exportado em CSV.');
      }}>
        <Icon name="download" size={16} />Exportar</Button>
      <Button asChild>
        <Link href="/painel/matriculas">
          <Icon name="plus" size={18} />Nova matrícula</Link>
      </Button>
    </>} />
    <div className="overview-banner">
      <span className="banner-icon">
        <Icon name="pulse" />
      </span>
      <span>
        <strong>Sua academia está em movimento.</strong> Acompanhe os sinais e transforme cada decisão em evolução.</span>
      <Badge tone="success">Operação em dia</Badge>
    </div>
    <div className="stats-grid">
      <Stat label="Alunos ativos" value={number(m.active)} detail="Matrículas ativas na demo" icon="students" />
      <Stat label="Receita do mês" value={money(m.revenue)} detail="Mensalidades + vendas simuladas" icon="money" featured />
      <Stat label="Inadimplência" value={money(m.debt)} detail={m.overdue + ' alunos precisam de atenção'} tone="danger" icon="warning" />
    </div>
    <div className="secondary-stats">
      <div>
        <Icon name="pulse" />
        <span>Frequência registrada<strong>{number(m.visits)} <small>visitas</small>
          </strong>
        </span>
      </div>
      <div>
        <Icon name="lead" />
        <span>Conversão de leads<strong>{Math.round(m.conversion)}<small>%</small>
          </strong>
        </span>
      </div>
      <div>
        <Icon name="refresh" />
        <span>Churn da amostra<strong>0<small>% · sem cancelamentos</small>
          </strong>
        </span>
      </div>
    </div>
    <div className="dashboard-middle">
      <Panel title="Evolução da receita" description="Consistência hoje. Crescimento amanhã." action={<select aria-label="Período da receita" name="periodo" value={period} onChange={e => router.replace('/painel?periodo=' + e.target.value, {
        scroll: false
      })}>
        <option value="semestre">Últimos 6 meses</option>
        <option value="trimestre">Últimos 3 meses</option>
      </select>}>
        <div className="chart-summary">
          <strong>{money(m.revenue)}</strong>
          <span className="text-info">Receita simulada de outubro</span>
        </div>
        <RevenueChart current={m.revenue} period={period} />
        <div className="chart-legend">
          <span>
            <i />Receita recebida</span>
          <small>Histórico ilustrativo · valores em reais</small>
        </div>
      </Panel>
      <Panel className="frequency-panel" title="Ritmo da academia" description="Distribuição semanal ilustrativa">
        <div className="frequency-total">
          <strong>{number(m.visits)}</strong>
          <span>visitas registradas na amostra</span>
        </div>
        <FrequencyChart />
        <div className="frequency-note">
          <Icon name="fire" />
          <span>Sexta é o seu dia de maior movimento.</span>
        </div>
      </Panel>
    </div>
    <div className="dashboard-bottom">
      <Panel title="Acontece hoje" description="A energia que move sua academia" action={<Link className="text-link" href="/painel/aulas">Ver agenda<Icon name="arrow" size={16} />
      </Link>}>
        <div className="agenda-preview">{classes.slice(0, 3).map((item, i) => <div className="agenda-row" key={item.id}>
            <time>{item.time}</time>
            <span className={'class-marker marker-' + i} />
            <div>
              <strong>{item.name}</strong>
              <small>{item.teacher} · {item.room}</small>
            </div>
            <span className="agenda-capacity">{item.occupied}/{item.capacity}<small>alunos</small>
            </span>
          </div>)}</div>
      </Panel>
      <Panel title="Pontos de atenção" description="Pequenas ações, grandes resultados" action={<span className="attention-count">{m.overdue}</span>}>
        <div className="attention-content">{state.students.filter(s => s.daysLate > 0).slice(0, 2).map(s => <Link key={s.id} href={'/painel/alunos/' + s.id} className="attention-row">
            <Avatar name={s.name} />
            <span>
              <strong>{s.name}</strong>
              <small>Mensalidade · {s.daysLate} dias em atraso</small>
            </span>
            <Icon name="arrow" size={16} />
          </Link>)}{!m.overdue && <p className="text-success">Nenhuma mensalidade em atraso na amostra.</p>}<Link href="/painel/inadimplencia" className="attention-cta">Acompanhar inadimplência<Icon name="arrow" size={16} />
          </Link>
        </div>
      </Panel>
    </div>
    <DemoNote />
  </>;
}
