'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMock } from '@/lib/store';
import { classes, metrics, money, monthlyFee, products, reserve, type ClassItem } from '@/lib/domain';
import { downloadCsv } from '@/lib/export';
import { Icon } from './icons';
import { Avatar, Badge, Button, DemoNote, Empty, Modal, PageHeading, Panel, Stat } from './ui';
import { RevenueChart } from './charts';
const days = ['Todos', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
export function ClassSchedule() {
  const {
    state,
    update,
    notify
  } = useMock();
  const params = useSearchParams();
  const router = useRouter();
  const day = params.get('dia') ?? 'Todos';
  const [selected, setSelected] = useState<ClassItem | null>(null);
  return <>
    <PageHeading eyebrow="ENERGIA COMPARTILHADA" title="Agenda de aulas" description="Uma semana de possibilidades. Encontre o próximo movimento." actions={<Button asChild variant="secondary">
      <Link href="/aluno/aulas">Prévia de reservas do aluno<Icon name="arrow" size={16} />
      </Link>
    </Button>} />
    <div className="tabs" aria-label="Dia da semana">{days.map(d => <Link key={d} href={d === 'Todos' ? '/painel/aulas' : '/painel/aulas?dia=' + encodeURIComponent(d)} aria-current={d === day ? 'page' : undefined} className={d === day ? 'selected' : ''}>{d}</Link>)}</div>
    <div className="schedule-grid">{classes.filter(c => day === 'Todos' || c.day === day).map((c, i) => {
        const booking = state.bookings.find(b => b.classId === c.id);
        const count = Math.min(c.capacity, c.occupied + (booking?.status === 'confirmed' ? 1 : 0));
        return <button key={c.id} className={'class-card class-color-' + i % 3} onClick={() => setSelected(c)}>
          <div>
            <span className="class-day">{c.day}</span>
            <Badge tone={count >= c.capacity ? 'warning' : 'success'}>{count >= c.capacity ? 'Lista de espera' : 'Vagas disponíveis'}</Badge>
          </div>
          <span className="class-time">{c.time}<small>{c.duration} min</small>
          </span>
          <h2>{c.name}</h2>
          <p>{c.teacher} · {c.room}</p>
          <div className="capacity-bar">
            <span style={{
              width: count / c.capacity * 100 + '%'
            }} />
          </div>
          <footer>
            <span>{count} / {c.capacity} alunos</span>
            <Icon name="arrow" size={18} />
          </footer>
        </button>;
      })}</div>{!classes.some(c => day === 'Todos' || c.day === day) && <Empty title="Não há aulas neste dia" action={<Button variant="secondary" onClick={() => router.replace('/painel/aulas')}>Ver semana completa</Button>} />}<Modal open={!!selected} onOpenChange={o => {
      if (!o) setSelected(null);
    }} title={selected?.name ?? 'Aula'} description="Detalhes da grade demonstrativa.">{selected && <>
        <dl className="detail-list">
          <div>
            <dt>Professor</dt>
            <dd>{selected.teacher}</dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>{selected.day} · {selected.time} · {selected.duration} min</dd>
          </div>
          <div>
            <dt>Local</dt>
            <dd>{selected.room}</dd>
          </div>
        </dl>
        <p>Use a área do aluno para reservar, entrar na espera e simular a abertura de uma vaga.</p>
        <Button onClick={() => {
          update(s => ({
            ...s,
            bookings: reserve(s.bookings, selected)
          }));
          setSelected(null);
          notify('Reserva demonstrativa registrada para Mariana. Veja a área do aluno.');
        }} disabled={state.bookings.some(b => b.classId === selected.id)}>Reservar para Mariana · mock</Button>
      </>}</Modal>
    <DemoNote />
  </>;
}
const buckets = ['Todos', '1–7 dias', '8–30 dias', '31+ dias'];
export function Collections() {
  const {
    state,
    update,
    notify
  } = useMock();
  const params = useSearchParams();
  const bucket = params.get('faixa') ?? 'Todos';
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState('WhatsApp');
  const overdue = state.students.filter(s => s.daysLate > 0);
  const visible = overdue.filter(s => bucket === 'Todos' || (bucket === '1–7 dias' ? s.daysLate <= 7 : bucket === '8–30 dias' ? s.daysLate >= 8 && s.daysLate <= 30 : s.daysLate > 30));
  const pending = visible.filter(s => !state.collections.includes(s.id));
  const [paidId, setPaidId] = useState<string | null>(null);
  return <>
    <PageHeading eyebrow="CUIDADO COM O NEGÓCIO" title="Inadimplência" description="Conversas no momento certo. Um financeiro mais saudável." actions={<Button disabled={!pending.length} onClick={() => setOpen(true)}>
      <Icon name="mail" size={18} />Simular régua de cobrança</Button>} />
    <div className="stats-grid">
      <Stat label="Valor em aberto" value={money(overdue.reduce((total, s) => total + monthlyFee(s), 0))} detail="Mensalidades fictícias" icon="money" tone="danger" />
      <Stat label="Alunos em atraso" value={String(overdue.length)} detail="Na academia selecionada" icon="students" tone="warning" />
      <Stat label="Contatos simulados" value={String(state.collections.length)} detail="Nenhuma mensagem foi enviada" icon="mail" tone="info" />
    </div>
    <Panel title="Acompanhamento por faixa" description="Priorize, acolha e regularize.">
      <div className="tabs inner-tabs">{buckets.map(b => <Link key={b} href={b === 'Todos' ? '/painel/inadimplencia' : '/painel/inadimplencia?faixa=' + encodeURIComponent(b)} className={b === bucket ? 'selected' : ''} aria-current={b === bucket ? 'page' : undefined}>{b}</Link>)}</div>{visible.length ? <div className="table-scroll">
        <table>
          <caption className="sr-only">Mensalidades em atraso por faixa</caption>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Em aberto</th>
              <th>Atraso</th>
              <th>Contato</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>{visible.map(s => <tr key={s.id}>
              <td>
                <Link className="student-cell" href={'/painel/alunos/' + s.id}>
                  <Avatar name={s.name} />
                  <strong>{s.name}</strong>
                </Link>
              </td>
              <td>{money(monthlyFee(s))}</td>
              <td>
                <Badge tone={s.daysLate > 30 ? 'danger' : 'warning'}>{s.daysLate} dias</Badge>
              </td>
              <td>{state.collections.includes(s.id) ? <Badge tone="info">Contato simulado</Badge> : <span className="muted">Pendente</span>}</td>
              <td>
                <Button variant="ghost" onClick={() => setPaidId(s.id)}>Simular baixa</Button>
              </td>
            </tr>)}</tbody>
        </table>
      </div> : <Empty title="Nenhum atraso nesta faixa" description="Selecione outra faixa para acompanhar as mensalidades." />}<div className="table-footer">A régua atua apenas nos registros visíveis ainda não contatados.</div>
    </Panel>
    <Panel title="Uma régua com humanidade" description="Modelo ilustrativo de comunicação">
      <div className="collection-flow">{[{
          day: 'D+3',
          title: 'Lembrete gentil',
          text: 'Informar o vencimento e oferecer ajuda.'
        }, {
          day: 'D+10',
          title: 'Conversa próxima',
          text: 'Entender a situação e propor regularização.'
        }, {
          day: 'D+30',
          title: 'Atenção individual',
          text: 'Encaminhar o caso para a recepção.'
        }].map(x => <div key={x.day}>
          <span>{x.day}</span>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </div>)}</div>
    </Panel>
    <Modal open={open} onOpenChange={setOpen} title="Simular régua de cobrança" description="A ação registra contatos fictícios. Não envia WhatsApp, push ou e-mail.">
      <div className="form-stack">
        <p>{pending.length} aluno(s) na faixa {bucket.toLowerCase()}.</p>
        <label className="field">
          <span>Canal demonstrativo</span>
          <select name="channel" value={channel} onChange={e => setChannel(e.target.value)}>
            <option>WhatsApp</option>
            <option>Push</option>
            <option>E-mail</option>
          </select>
        </label>
        <div className="message-preview">Olá! Sua mensalidade está em aberto. A recepção está por aqui para ajudar você a manter o ritmo.</div>
        <Button disabled={!pending.length} onClick={() => {
          update(s => ({
            ...s,
            collections: [...new Set([...s.collections, ...pending.map(x => x.id)])]
          }));
          setOpen(false);
          notify('Contato por ' + channel + ' simulado para ' + pending.length + ' aluno(s). Nenhuma mensagem enviada.');
        }}>Registrar {pending.length} contato(s) simulado(s)</Button>
      </div>
    </Modal>
    <Modal open={!!paidId} onOpenChange={o => {
      if (!o) setPaidId(null);
    }} title="Simular recebimento" description="Nenhum valor real será movimentado.">
      <p>A mensalidade será marcada como regularizada e o acesso do aluno será liberado na demo.</p>
      <Button onClick={() => {
        update(s => ({
          ...s,
          paidInvoices: paidId ? [...new Set([...s.paidInvoices, paidId])] : s.paidInvoices,
          students: s.students.map(x => x.id === paidId ? {
            ...x,
            status: 'Ativo',
            daysLate: 0
          } : x)
        }));
        setPaidId(null);
        notify('Baixa simulada. O aluno agora tem acesso ativo.');
      }}>Confirmar baixa demonstrativa</Button>
    </Modal>
    <DemoNote />
  </>;
}
const stages = ['Novos contatos', 'Aula agendada', 'Em negociação', 'Convertidos'];
export function Leads() {
  const {
    state,
    update,
    notify
  } = useMock();
  const [open, setOpen] = useState(false);
  return <>
    <PageHeading eyebrow="NOVAS CONEXÕES" title="Funil de leads" description="Transforme interesse em presença. E presença em pertencimento." actions={<Button onClick={() => setOpen(true)}>
      <Icon name="plus" />Novo lead</Button>} />
    <div className="kanban">{stages.map((stage, i) => <section key={stage} className="kanban-column">
        <header>
          <span className={'kanban-dot stage-' + i} />
          <h2>{stage}</h2>
          <span>{state.leads.filter(l => l.stage === i).length}</span>
        </header>{state.leads.filter(l => l.stage === i).map(l => <article key={l.id} className="lead-card">
          <Avatar name={l.name} />
          <h3>{l.name}</h3>
          <p>{l.source}</p>
          <div className="lead-actions">{i > 0 && <Button variant="ghost" size="icon" aria-label={'Retornar ' + l.name + ' para ' + stages[i - 1]} onClick={() => update(s => ({
              ...s,
              leads: s.leads.map(x => x.id === l.id ? {
                ...x,
                stage: i - 1
              } : x)
            }))}>
              <Icon name="arrow" className="reverse" size={16} />
            </Button>}{i < 3 ? <Button variant="secondary" onClick={() => {
              update(s => ({
                ...s,
                leads: s.leads.map(x => x.id === l.id ? {
                  ...x,
                  stage: i + 1
                } : x)
              }));
              notify(l.name + ' avançou para ' + stages[i + 1].toLowerCase() + '.');
            }}>Avançar<Icon name="arrow" size={15} />
            </Button> : <Badge tone="success">Convertido · mock</Badge>}</div>
        </article>)}{!state.leads.some(l => l.stage === i) && <p className="kanban-empty">Os próximos contatos aparecem aqui.</p>}</section>)}</div>
    <Modal open={open} onOpenChange={setOpen} title="Novo contato" description="Cadastro local de um lead fictício.">
      <form className="form-stack" onSubmit={e => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        update(s => ({
          ...s,
          leads: [...s.leads, {
            id: crypto.randomUUID(),
            name: String(f.get('name')).trim(),
            source: String(f.get('source')),
            stage: 0
          }]
        }));
        setOpen(false);
        notify('Lead criado na demo.');
      }}>
        <label className="field">
          <span>Nome completo</span>
          <input name="name" autoComplete="name" minLength={3} maxLength={80} required placeholder="Ex.: Beatriz Martins…" />
        </label>
        <label className="field">
          <span>Origem</span>
          <select name="source">
            <option>Instagram</option>
            <option>Indicação</option>
            <option>Site</option>
            <option>Wellhub · mock</option>
            <option>TotalPass · mock</option>
          </select>
        </label>
        <Button type="submit">Cadastrar lead fictício</Button>
      </form>
    </Modal>
    <DemoNote>Wellhub e TotalPass são apenas origens ilustrativas, sem integração.</DemoNote>
  </>;
}
export function Finance() {
  const {
    state,
    notify
  } = useMock();
  const m = metrics(state);
  const expenses = 620;
  return <>
    <PageHeading eyebrow="NÚMEROS QUE DÃO DIREÇÃO" title="Financeiro" description="Entradas, saídas e próximos passos. Clareza em cada movimento." actions={<Button variant="secondary" onClick={() => {
      downloadCsv('gymcore-financeiro.csv', [['Descrição', 'Valor'], ['Recebimentos simulados', m.revenue], ['Despesas ilustrativas', -expenses], ['Saldo', m.revenue - expenses]]);
      notify('Fluxo de caixa demonstrativo exportado.');
    }}>
      <Icon name="download" size={16} />Exportar fluxo de caixa</Button>} />
    <div className="stats-grid">
      <Stat label="Entradas simuladas" value={money(m.revenue)} detail="Mensalidades e vendas" icon="money" featured />
      <Stat label="Despesas ilustrativas" value={money(expenses)} detail="Custos da amostra" icon="commission" tone="warning" />
      <Stat label="Saldo da amostra" value={money(m.revenue - expenses)} detail="Entradas menos despesas" icon="chart" />
    </div>
    <Panel title="Fluxo de caixa" description="Histórico demonstrativo de entradas">
      <RevenueChart current={m.revenue} />
    </Panel>
    <Panel title="Movimentações" description="Nenhuma transação bancária é realizada">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>{[{
              name: 'Mensalidades ativas',
              type: 'Entrada',
              value: m.monthlyRevenue - (state.paymentPaid ? monthlyFee(state.students[0]) : 0),
              status: 'Simulado'
            }, {
              name: 'Vendas no PDV',
              type: 'Entrada',
              value: state.sales,
              status: 'Simulado'
            }, {
              name: 'Mensalidade do aluno',
              type: 'Entrada',
              value: state.paymentPaid ? monthlyFee(state.students[0]) : 0,
              status: state.paymentPaid ? 'Pago · mock' : 'Em aberto'
            }, {
              name: 'Custos operacionais',
              type: 'Saída',
              value: -420,
              status: 'Ilustrativo'
            }, {
              name: 'Manutenção de equipamentos',
              type: 'Saída',
              value: -200,
              status: 'Ilustrativo'
            }].map(x => <tr key={x.name}>
              <td>{x.name}</td>
              <td>
                <Badge tone={x.value >= 0 ? 'success' : 'warning'}>{x.type}</Badge>
              </td>
              <td className="muted">{x.status}</td>
              <td className={x.value >= 0 ? 'text-success' : 'text-warning'}>{money(x.value)}</td>
            </tr>)}</tbody>
        </table>
      </div>
    </Panel>
    <DemoNote />
  </>;
}
const teachers = [{
  name: 'Camila Rocha',
  classes: 24,
  rate: 35
}, {
  name: 'Rafael Costa',
  classes: 20,
  rate: 35
}, {
  name: 'Lucas Ferreira',
  classes: 18,
  rate: 30
}, {
  name: 'Marina Alves',
  classes: 12,
  rate: 40
}];
export function Commissions() {
  const {
    state,
    update,
    notify
  } = useMock();
  const [open, setOpen] = useState(false);
  const total = teachers.reduce((n, t) => n + t.classes * t.rate, 0);
  return <>
    <PageHeading eyebrow="VALOR PARA QUEM MOVE" title="Comissões" description="Reconheça o trabalho de quem faz sua academia acontecer." actions={<Button disabled={state.commissionsClosed} onClick={() => setOpen(true)}>
      <Icon name="check" size={18} />{state.commissionsClosed ? 'Fechamento registrado' : 'Fechar outubro · mock'}</Button>} />
    <div className="summary-strip">
      <span>
        <strong>{teachers.length}</strong>professores</span>
      <span>
        <strong>{teachers.reduce((n, t) => n + t.classes, 0)}</strong>aulas ilustrativas</span>
      <span>
        <strong className="text-info">{money(total)}</strong>comissão estimada</span>
    </div>
    <Panel title="Outubro de 2026" description="Valores fictícios para visualizar o fechamento">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Professor</th>
              <th>Aulas</th>
              <th>Por aula</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{teachers.map(t => <tr key={t.name}>
              <td>
                <span className="student-cell">
                  <Avatar name={t.name} />
                  <strong>{t.name}</strong>
                </span>
              </td>
              <td>{t.classes}</td>
              <td>{money(t.rate)}</td>
              <td>{money(t.classes * t.rate)}</td>
              <td>
                <Badge tone={state.commissionsClosed ? 'success' : 'warning'}>{state.commissionsClosed ? 'Fechado · mock' : 'A revisar'}</Badge>
              </td>
            </tr>)}</tbody>
        </table>
      </div>
    </Panel>
    <Modal open={open} onOpenChange={setOpen} title="Fechar comissões demonstrativas" description="O fechamento não realiza pagamentos.">
      <p>Registrar a revisão de {teachers.length} professores, no total ilustrativo de {money(total)}?</p>
      <Button onClick={() => {
        update(s => ({
          ...s,
          commissionsClosed: true
        }));
        setOpen(false);
        notify('Fechamento de outubro registrado localmente. Nenhum pagamento realizado.');
      }}>Confirmar fechamento · mock</Button>
    </Modal>
    <DemoNote />
  </>;
}
export function PointOfSale() {
  const {
    tenantId,
    update,
    notify
  } = useMock();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('Pix');
  const [receipt, setReceipt] = useState<number | null>(null);
  const total = products.reduce((v, p) => v + p.price * (cart[p.id] ?? 0), 0);
  return <>
    <PageHeading eyebrow="O EXTRA QUE FAZ DIFERENÇA" title="Ponto de venda" description="Da hidratação ao pós-treino. Venda com poucos movimentos." />
    <div className="pos-layout">
      <div className="product-grid">{products.map(p => <button key={p.id} className="product-card" onClick={() => {
          setCart(c => ({
            ...c,
            [p.id]: (c[p.id] ?? 0) + 1
          }));
          setReceipt(null);
        }}>
          <div className={'product-visual visual-' + p.id}>
            <Icon name={p.icon} size={58} />
            <span>{tenantId === 'atlas' ? 'ATLAS' : 'NORD'}<br />FUEL</span>
          </div>
          <div className="product-info">
            <h2>{p.name}</h2>
            <p>{p.detail}</p>
            <strong>{money(p.price)}</strong>
            <span className="product-add">
              <Icon name="plus" size={18} />
            </span>
          </div>
        </button>)}</div>
      <Panel title="Sua venda" description="Carrinho demonstrativo" className="cart-panel">{total > 0 ? <>{products.filter(p => cart[p.id]).map(p => <div className="cart-item" key={p.id}>
            <div>
              <strong>{p.name}</strong>
              <small>{money(p.price)} por unidade</small>
            </div>
            <div className="quantity-control">
              <Button variant="ghost" size="icon" aria-label={'Remover uma unidade de ' + p.name} onClick={() => setCart(c => ({
                ...c,
                [p.id]: Math.max(0, c[p.id] - 1)
              }))}>−</Button>
              <span>{cart[p.id]}</span>
              <Button variant="ghost" size="icon" aria-label={'Adicionar uma unidade de ' + p.name} onClick={() => setCart(c => ({
                ...c,
                [p.id]: c[p.id] + 1
              }))}>+</Button>
            </div>
          </div>)}<div className="cart-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <Button className="full-width" onClick={() => setOpen(true)}>Finalizar venda · mock<Icon name="arrow" size={16} />
          </Button>
        </> : <Empty title={receipt ? 'Venda simulada concluída' : 'Pronto para a próxima venda'} description={receipt ? 'Total: ' + money(receipt) + '. Nenhuma cobrança real foi realizada.' : 'Selecione um produto para começar.'} />}<DemoNote>Sem cobrança ou emissão fiscal</DemoNote>
      </Panel>
    </div>
    <Modal open={open} onOpenChange={setOpen} title="Finalizar venda demonstrativa" description="Pagamento e recibo são apenas simulados.">
      <div className="form-stack">
        <div className="cart-total">
          <span>Total</span>
          <strong>{money(total)}</strong>
        </div>
        <label className="field">
          <span>Pagamento demonstrativo</span>
          <select name="method" value={method} onChange={e => setMethod(e.target.value)}>
            <option>Pix</option>
            <option>Cartão</option>
            <option>Dinheiro</option>
          </select>
        </label>
        <Button onClick={() => {
          update(s => ({
            ...s,
            sales: s.sales + total
          }));
          setReceipt(total);
          setCart({});
          setOpen(false);
          notify('Venda de ' + money(total) + ' simulada via ' + method + '. O financeiro da demo foi atualizado.');
        }} disabled={!total}>Confirmar venda · mock</Button>
      </div>
    </Modal>
    <DemoNote />
  </>;
}
