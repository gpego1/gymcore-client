'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useMock } from '@/lib/store';
import { access, classes, exercises, money, monthlyFee, promote, reserve, tenants, type Booking } from '@/lib/domain';
import { Icon, Logo } from './icons';
import { Avatar, Badge, Button, DemoNote, Empty, Modal, Panel } from './ui';
import { EvolutionChart } from './charts';
export function StudentShell({
  children
}: {
  children: ReactNode;
}) {
  const {
    tenantId,
    state
  } = useMock();
  const path = usePathname();
  const nav = [{
    href: '/aluno',
    name: 'Início',
    icon: 'home'
  }, {
    href: '/aluno/treino',
    name: 'Treino',
    icon: 'dumbbell'
  }, {
    href: '/aluno/aulas',
    name: 'Aulas',
    icon: 'calendar'
  }, {
    href: '/aluno/evolucao',
    name: 'Evolução',
    icon: 'chart'
  }, {
    href: '/aluno/perfil',
    name: 'Perfil',
    icon: 'user'
  }];
  return <div className="student-preview">
    <a className="skip-link" href="#student-main">Pular para o conteúdo</a>
    <aside className="student-preview-info">
      <Link href="/painel" className="back-link">
        <Icon name="arrow" className="reverse" />Voltar à gestão</Link>
      <Logo />
      <div className="eyebrow">EXPERIÊNCIA DO ALUNO</div>
      <h1>Seu ritmo.<br />Sua evolução.</h1>
      <p>Uma academia que acompanha você, em cada repetição e em cada conquista.</p>
      <span className="preview-label">
        <Icon name="phone" />Protótipo web responsivo</span>
      <p className="muted">Esta prévia representa as telas do aluno. O app Flutter é especificado no handoff e ainda não foi implementado.</p>
      <Link href="/recepcao" className="text-link">Conhecer o terminal de acesso<Icon name="arrow" size={16} />
      </Link>
    </aside>
    <div className="student-device">
      <header className="student-header">
        <Link href="/aluno" aria-label="GymCore, início do aluno">
          <Logo symbol />
        </Link>
        <div>
          <strong>{tenants[tenantId].name}</strong>
          <small>Aluno · demo web</small>
        </div>
        <Link href="/aluno/avisos" className="icon-link" aria-label="Ver mural de avisos">
          <Icon name="bell" />
        </Link>
        <Link href="/aluno/perfil" aria-label="Ver perfil">
          <Avatar name={state.students[0].name} />
        </Link>
      </header>
      <main id="student-main" className="student-content" tabIndex={-1}>{children}</main>
      <nav className="student-nav" aria-label="Navegação do aluno">{nav.map(n => <Link key={n.href} href={n.href} className={(n.href === '/aluno' ? path === n.href : path.startsWith(n.href)) ? 'active' : ''} aria-current={(n.href === '/aluno' ? path === n.href : path.startsWith(n.href)) ? 'page' : undefined}>
          <Icon name={n.icon} size={22} />
          <span>{n.name}</span>
        </Link>)}</nav>
    </div>
  </div>;
}
function StudentTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return <div className="student-title">{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>;
}
export function StudentHome() {
  const {
    state
  } = useMock();
  const first = state.students[0].name.split(' ')[0];
  const count = Object.values(state.sets).filter(s => s.done).length;
  return <>
    <div className="student-greeting">
      <span>SEGUNDA, 12 DE OUTUBRO · DEMO</span>
      <Icon name="sun" />
    </div>
    <StudentTitle title={'Olá, ' + first + '.'} description="Hoje é um bom dia para ir além." />{!state.onboarding && <Link href="/aluno/onboarding" className="onboarding-link">
      <Icon name="star" />
      <span>Conheça seu espaço de evolução</span>
      <Icon name="arrow" size={18} />
    </Link>}<Link href="/aluno/qr" className="checkin-card">
      <span className="checkin-card-icon">
        <Icon name="qr" size={30} />
      </span>
      <span>
        <strong>Seu próximo treino começa aqui.</strong>
        <small>Abrir QR de check-in · demonstração</small>
      </span>
      <Icon name="arrow" />
    </Link>
    <div className="student-week">
      <span>
        <Icon name="fire" />SEU RITMO NESTA SEMANA</span>
      <div>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => <div key={i} className={i < 2 ? 'day-complete' : i === 2 ? 'day-today' : ''}>
          <span>{d}</span>
          <b>{i < 2 ? <Icon name="check" size={16} /> : 12 + i}</b>
        </div>)}</div>
      <p>
        <strong>2 treinos.</strong> Consistência faz a diferença.</p>
    </div>
    <div className="student-section-heading">
      <h2>Seu treino de hoje</h2>
      <span>FICHA A</span>
    </div>
    <Link href="/aluno/treino" className="workout-card">
      <div className="workout-art" aria-hidden="true">
        <Icon name="dumbbell" size={95} />
        <span>01</span>
      </div>
      <div className="workout-card-content">
        <Badge tone="info">Superiores + core</Badge>
        <h2>Força que<br />vem de dentro.</h2>
        <p>4 exercícios · ~45 min</p>
        <div className="workout-progress">
          <span style={{
            width: count / 12 * 100 + '%'
          }} />
        </div>
        <span className="workout-cta">{count ? count + ' de 12 séries registradas' : 'Começar treino'}<Icon name="arrow" size={18} />
        </span>
      </div>
    </Link>
    <div className="student-section-heading">
      <h2>Próxima aula</h2>
      <Link href="/aluno/aulas" className="text-link">Ver todas</Link>
    </div>
    <Link href="/aluno/aulas" className="student-class-summary">
      <span className="exercise-icon">
        <Icon name="calendar" />
      </span>
      <div>
        <strong>Funcional</strong>
        <small>Segunda · 07:00 · Camila Rocha</small>
      </div>
      <Icon name="arrow" size={18} />
    </Link>
    <div className="student-shortcuts">
      <Link href="/aluno/mensalidades">
        <Icon name="money" />
        <strong>Mensalidades</strong>
        <small>{state.paymentPaid ? 'Em dia · mock' : 'Próximo vencimento: 15 out.'}</small>
      </Link>
      <Link href="/aluno/avisos">
        <Icon name="bell" />
        <strong>Mural da academia</strong>
        <small>Fique por dentro</small>
      </Link>
    </div>
    <DemoNote>Prévia web · dados fictícios</DemoNote>
  </>;
}
export function Onboarding() {
  const {
    update
  } = useMock();
  const [step, setStep] = useState(0);
  const slides = [{
    icon: 'target',
    title: 'Sua melhor versão começa no próximo passo.',
    description: 'Treinos, reservas e evolução. Um espaço para cuidar do seu ritmo.'
  }, {
    icon: 'qr',
    title: 'Chegue. Faça check-in. Vá além.',
    description: 'Seu acesso fica a um toque. O QR desta demo é apenas ilustrativo.'
  }, {
    icon: 'shield',
    title: 'Sua evolução. Sua privacidade.',
    description: 'Você controla o consentimento demonstrativo. Dados de saúde e biometria real não são coletados.'
  }];
  return <div className="onboarding">
    <div className="onboarding-art">
      <Icon name={slides[step].icon} size={88} />
      <span className="orbit orbit-one" />
      <span className="orbit orbit-two" />
    </div>
    <Badge tone="info">{step + 1} de 3</Badge>
    <h1>{slides[step].title}</h1>
    <p>{slides[step].description}</p>
    <div className="onboarding-dots" aria-hidden="true">{slides.map((_, i) => <span key={i} className={i === step ? 'active' : ''} />)}</div>{step < 2 ? <Button className="full-width" onClick={() => setStep(step + 1)}>Próximo passo<Icon name="arrow" />
    </Button> : <Button asChild className="full-width">
      <Link href="/aluno" onClick={() => update(s => ({
        ...s,
        onboarding: true
      }))}>Começar minha jornada<Icon name="arrow" />
      </Link>
    </Button>}<Link href="/aluno" className="text-link">Ir para o início</Link>
  </div>;
}
export function MockQr({
  size = 240
}: {
  size?: number;
}) {
  const cells = [];
  for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) {
    const inFinder = x < 7 && y < 7 || x > 17 && y < 7 || x < 7 && y > 17;
    if (!inFinder && (x * 7 + y * 11 + x * y) % 5 < 2) cells.push(<rect key={x + '-' + y} x={x + 2} y={y + 2} width="1" height="1" />);
  }
  return <svg width={size} height={size} viewBox="0 0 29 29" role="img" aria-label="Padrão QR ilustrativo. Não é uma credencial de acesso válida.">
    <rect width="29" height="29" fill="white" />
    <g fill="#08101D">{cells}{[[2, 2], [20, 2], [2, 20]].map(([x, y]) => <g key={x + '-' + y}>
        <rect x={x} y={y} width="7" height="7" />
        <rect x={x + 1} y={y + 1} width="5" height="5" fill="white" />
        <rect x={x + 2} y={y + 2} width="3" height="3" />
      </g>)}</g>
  </svg>;
}
export function QrCheckIn() {
  const {
    state,
    update,
    notify
  } = useMock();
  const [full, setFull] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof access> | null>(null);
  function simulate() {
    const r = access(state.students[0], false);
    setResult(r);
    if (r.allowed) update(s => ({
      ...s,
      checkins: [{
        name: s.students[0].name,
        allowed: true,
        time: new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date())
      }, ...s.checkins].slice(0, 8)
    }));
    notify(r.title + ' · simulação local.');
  }
  return <>
    <StudentTitle eyebrow="PRONTO PARA TREINAR" title="Seu acesso, em um toque." description="Na versão integrada, você apresentará o QR na recepção." />
    <div className="qr-panel">
      <Badge tone={state.students[0].status === 'Ativo' ? 'success' : 'danger'}>{state.students[0].status === 'Ativo' ? 'Plano ativo' : 'Acesso requer atenção'}</Badge>
      <button className="qr-enlarge" onClick={() => setFull(true)} aria-label="Ampliar QR ilustrativo">
        <MockQr />
      </button>
      <strong>{state.students[0].name}</strong>
      <p>QR ilustrativo · não válido para acesso real</p>
      <span className="demo-code">DEMO · ALUNO · 001</span>
    </div>
    <Button className="full-width" onClick={simulate}>
      <Icon name="qr" />Simular leitura na recepção</Button>{result && <div className={'access-result compact ' + (result.allowed ? 'allowed' : 'denied')} role="status">
      <Icon name={result.allowed ? 'check' : 'close'} size={32} />
      <h2>{result.title}</h2>
      <p>{result.reason}</p>
      <small>Resultado demonstrativo</small>
    </div>}<div className="privacy-note">
      <Icon name="shield" />
      <p>O QR desta prévia não contém CPF, dados de saúde ou token real. A leitura é simulada pelo botão.</p>
    </div>
    <Modal open={full} onOpenChange={setFull} title="QR de check-in" description="Prévia ampliada de uma credencial ilustrativa.">
      <div className="qr-modal">
        <MockQr size={300} />
        <p>QR ilustrativo · sem validade</p>
      </div>
    </Modal>
    <DemoNote>QR e liberação de acesso simulados</DemoNote>
  </>;
}
export function Workout() {
  const {
    state,
    update,
    notify
  } = useMock();
  const completed = Object.values(state.sets).filter(s => s.done).length;
  return <>
    <StudentTitle eyebrow="TREINO A · SUPERIORES + CORE" title="Uma repetição de cada vez." description="Registre suas cargas. Reconheça sua evolução." />
    <div className="workout-status">
      <Icon name="dumbbell" />
      <span>
        <strong>{completed}/12</strong> séries concluídas</span>
      <span>~45 min</span>
    </div>
    <div className="workout-progress">
      <span style={{
        width: completed / 12 * 100 + '%'
      }} />
    </div>{exercises.map((exercise, i) => <Panel className="exercise-panel" key={exercise.id}>
      <header>
        <span className="exercise-number">0{i + 1}</span>
        <div>
          <h2>{exercise.name}</h2>
          <p>{exercise.muscle} · {exercise.reps} repetições</p>
        </div>
        <Icon name="dumbbell" />
      </header>
      <div className="set-labels">
        <span>Série</span>
        <span>Carga (kg)</span>
        <span>Feito</span>
      </div>{Array.from({
        length: exercise.sets
      }, (_, j) => {
        const key = exercise.id + '-' + j;
        const set = state.sets[key] ?? {
          weight: exercise.weight,
          done: false
        };
        return <div className={'set-row ' + (set.done ? 'set-done' : '')} key={key}>
          <strong>{j + 1}</strong>
          <input type="number" name={key} aria-label={'Carga em kg, ' + exercise.name + ', série ' + (j + 1)} min="0" max="500" step="0.5" value={set.weight} onChange={e => {
            const weight = Math.min(500, Math.max(0, Number(e.target.value)));
            update(s => ({
              ...s,
              sets: {
                ...s.sets,
                [key]: {
                  ...set,
                  weight
                }
              }
            }));
          }} />
          <Button variant={set.done ? 'primary' : 'secondary'} size="icon" aria-label={(set.done ? 'Desmarcar' : 'Concluir') + ' série ' + (j + 1) + ' de ' + exercise.name} aria-pressed={set.done} onClick={() => update(s => ({
            ...s,
            sets: {
              ...s.sets,
              [key]: {
                ...set,
                done: !set.done
              }
            }
          }))}>
            <Icon name="check" />
          </Button>
        </div>;
      })}<small className="rest-note">
        <Icon name="clock" size={14} />Descanso sugerido: 60 s · ficha fictícia</small>
    </Panel>)}<Button className="full-width" disabled={completed < 12} onClick={() => notify('Treino demonstrativo concluído. Mais um passo na sua evolução!')}>
      <Icon name="target" />Concluir treino</Button>
    <DemoNote>Ficha fictícia · sem prescrição profissional</DemoNote>
  </>;
}
export function StudentClasses() {
  const {
    state,
    update,
    notify
  } = useMock();
  const [cancel, setCancel] = useState<Booking | null>(null);
  const params = useSearchParams();
  const mode = params.get('vista') ?? 'todas';
  const visible = classes.filter(c => mode !== 'minhas' || state.bookings.some(b => b.classId === c.id));
  return <>
    <StudentTitle eyebrow="ENCONTRE SUA ENERGIA" title="Juntos, mais fortes." description="Reserve seu lugar. O próximo movimento é seu." />
    <div className="tabs student-tabs">
      <Link href="/aluno/aulas" className={mode === 'todas' ? 'selected' : ''} aria-current={mode === 'todas' ? 'page' : undefined}>Todas as aulas</Link>
      <Link href="/aluno/aulas?vista=minhas" className={mode === 'minhas' ? 'selected' : ''} aria-current={mode === 'minhas' ? 'page' : undefined}>Minhas reservas ({state.bookings.length})</Link>
    </div>{visible.map(c => {
      const b = state.bookings.find(x => x.classId === c.id);
      return <Panel className="student-booking" key={c.id}>
        <div className="booking-heading">
          <span className="booking-time">{c.time}<small>{c.day}</small>
          </span>
          <div>
            <h2>{c.name}</h2>
            <p>{c.teacher}</p>
            <small>{c.duration} min · {c.room}</small>
          </div>
        </div>{b ? <>
          <Badge tone={b.status === 'confirmed' ? 'success' : 'warning'}>{b.status === 'confirmed' ? 'Reserva confirmada' : 'Você está na lista de espera · posição 1'}</Badge>{b.status === 'waiting' && <Button variant="secondary" className="full-width" onClick={() => {
            update(s => ({
              ...s,
              bookings: promote(s.bookings, c.id)
            }));
            notify('Uma vaga foi aberta na simulação. Sua reserva está confirmada!');
          }}>Simular vaga e promoção<Icon name="arrow" size={16} />
          </Button>}<Button variant="ghost" onClick={() => setCancel(b)}>Cancelar reserva</Button>
        </> : <div className="booking-footer">
          <span className={c.occupied >= c.capacity ? 'text-warning' : 'text-success'}>{c.occupied >= c.capacity ? 'Aula lotada' : c.capacity - c.occupied + ' vagas disponíveis'}</span>
          <Button variant={c.occupied >= c.capacity ? 'secondary' : 'primary'} onClick={() => {
            update(s => ({
              ...s,
              bookings: reserve(s.bookings, c)
            }));
            notify(c.occupied >= c.capacity ? 'Você entrou na lista de espera demonstrativa.' : 'Reserva confirmada na demo.');
          }}>{c.occupied >= c.capacity ? 'Entrar na espera' : 'Reservar'}</Button>
        </div>}</Panel>;
    })}{!visible.length && <Empty title="Seu próximo movimento espera por você" description="Explore as aulas e faça sua primeira reserva." action={<Button asChild>
      <Link href="/aluno/aulas">Encontrar uma aula</Link>
    </Button>} />}<Modal open={!!cancel} onOpenChange={o => {
      if (!o) setCancel(null);
    }} title="Cancelar esta reserva?" description="Seu lugar será removido da agenda demonstrativa.">
      <div className="button-row">
        <Button variant="secondary" onClick={() => setCancel(null)}>Manter reserva</Button>
        <Button variant="danger" onClick={() => {
          update(s => ({
            ...s,
            bookings: s.bookings.filter(b => b.classId !== cancel?.classId)
          }));
          setCancel(null);
          notify('Reserva cancelada na demo.');
        }}>Cancelar reserva</Button>
      </div>
    </Modal>
    <DemoNote>Reservas e lista de espera simuladas</DemoNote>
  </>;
}
export function Evolution() {
  const {
    state,
    update,
    notify
  } = useMock();
  const [photos, setPhotos] = useState<string[]>([]);
  const [metric, setMetric] = useState('carga');
  const student = state.students[0];
  return <>
    <StudentTitle eyebrow="CADA PASSO CONTA" title="A evolução é sua." description="Compare com quem você era. Celebre quem você está se tornando." />{!student.consent ? <Panel>
      <Empty title="Sua evolução está protegida" description="Ative o consentimento demonstrativo para visualizar dados fictícios." action={<Button onClick={() => {
        update(s => ({
          ...s,
          students: s.students.map((x, i) => i === 0 ? {
            ...x,
            consent: true
          } : x)
        }));
        notify('Consentimento demonstrativo ativado.');
      }}>Permitir exibição na demo</Button>} />
    </Panel> : <>
      <div className="evolution-stats">
        <div>
          <Icon name="dumbbell" />
          <strong>+10 kg</strong>
          <span>No supino · amostra</span>
        </div>
        <div>
          <Icon name="target" />
          <strong>24</strong>
          <span>Treinos · amostra</span>
        </div>
      </div>
      <Panel title="Evolução que se vê" description="Dados ilustrativos · agosto a outubro">
        <label className="field compact-field">
          <span>Indicador</span>
          <select value={metric} name="metric" onChange={e => setMetric(e.target.value)}>
            <option value="carga">Carga no supino</option>
            <option value="peso">Peso corporal</option>
          </select>
        </label>
        <div className="evolution-value">
          <strong>{metric === 'carga' ? '30' : '62'}<small> kg</small>
          </strong>
          <Badge tone="info">{metric === 'carga' ? '+50% desde agosto' : '−2 kg desde agosto'}</Badge>
        </div>{metric === 'carga' ? <EvolutionChart /> : <svg className="evolution-chart" viewBox="0 0 340 120" role="img" aria-label="Peso corporal fictício: agosto 64 kg, setembro 63 kg, outubro 62 kg">
          <path d="M20 20L160 60 320 100" stroke="#78D7F0" strokeWidth="3" fill="none" />
        </svg>}<div className="chart-labels">
          <span>Ago</span>
          <span>Set</span>
          <span>Out</span>
        </div>
      </Panel>
      <Panel title="Sua linha do tempo" description="Comparação visual · fotos opcionais, apenas nesta sessão">
        <div className="photo-comparison">{[0, 1].map(i => <div key={i}>{photos[i] ? <Image unoptimized src={photos[i]} width="180" height="220" alt={'Foto demonstrativa de evolução, ' + (i === 0 ? 'antes' : 'depois')} /> : <div className="photo-placeholder">
              <Icon name="user" size={60} />
              <span>Prévia sem foto</span>
            </div>}<span>{i === 0 ? 'Antes' : 'Depois'}</span>
          </div>)}</div>
        <label className="upload-button">
          <Icon name="plus" size={18} />
          <span>Selecionar 2 fotos fictícias</span>
          <input type="file" name="photos" multiple accept="image/png,image/jpeg,image/webp" aria-label="Selecionar até duas fotos fictícias para comparação" onChange={async e => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 2 || files.some(f => f.size > 5 * 1024 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(f.type))) {
              notify('Selecione até 2 imagens JPG, PNG ou WebP de até 5 MB cada.');
              return;
            }
            const urls = await Promise.all(files.map(f => new Promise<string>(r => {
              const reader = new FileReader();
              reader.onload = () => r(String(reader.result));
              reader.readAsDataURL(f);
            })));
            setPhotos(urls);
            notify('Imagens carregadas apenas nesta sessão, sem envio.');
          }} />
        </label>
        <p className="muted small">Use apenas imagens fictícias. Elas não são enviadas nem persistidas.</p>
      </Panel>
    </>}<div className="privacy-note">
      <Icon name="lock" />
      <p>Dados fictícios. Em produção, esta área exigirá consentimento, acesso restrito e retenção definida.</p>
    </div>
    <DemoNote>Indicadores ilustrativos · sem avaliação real</DemoNote>
  </>;
}
export function Payments() {
  const {
    state,
    update,
    notify
  } = useMock();
  const [open, setOpen] = useState(false);
  return <>
    <StudentTitle eyebrow="TUDO EM DIA" title="Seu plano. Seu ritmo." description="Acompanhe suas mensalidades com clareza." />
    <div className="membership-card">
      <Badge tone="info">Plano {state.students[0].plan}</Badge>
      <h2>Mais espaço<br />para evoluir.</h2>
      <span>{money(monthlyFee(state.students[0]))}<small>/ mês · amostra</small>
      </span>
    </div>
    <Panel title="Mensalidade de outubro" description="Vencimento demonstrativo: 15 de outubro de 2026">
      <div className="payment-summary">
        <strong>{money(monthlyFee(state.students[0]))}</strong>
        <Badge tone={state.paymentPaid ? 'success' : 'warning'}>{state.paymentPaid ? 'Pago · mock' : 'Em aberto'}</Badge>
      </div>{state.paymentPaid ? <p className="text-success">Recebimento simulado. Nenhuma cobrança real foi feita.</p> : <Button className="full-width" onClick={() => setOpen(true)}>
        <Icon name="qr" />Ver Pix demonstrativo</Button>}</Panel>
    <Panel title="Histórico demonstrativo">
      <div className="payment-history">
        <span>Setembro de 2026</span>
        <Badge tone="success">Pago · exemplo</Badge>
        <strong>{money(monthlyFee(state.students[0]))}</strong>
      </div>
      <div className="payment-history">
        <span>Agosto de 2026</span>
        <Badge tone="success">Pago · exemplo</Badge>
        <strong>{money(monthlyFee(state.students[0]))}</strong>
      </div>
    </Panel>
    <Modal open={open} onOpenChange={setOpen} title="Pix demonstrativo" description="Este QR não é um Pix válido. Não tente realizar um pagamento.">
      <div className="qr-modal">
        <MockQr size={190} />
        <strong>{money(monthlyFee(state.students[0]))}</strong>
        <p>QR ilustrativo · sem dados bancários</p>
        <Button variant="secondary" onClick={async () => {
          try {
            await navigator.clipboard.writeText('GYMCORE-DEMO-SEM-VALIDADE-PARA-PAGAMENTO');
            notify('Texto demonstrativo copiado. Não é um código Pix.');
          } catch {
            notify('Cópia indisponível. Texto: GYMCORE-DEMO-SEM-VALIDADE-PARA-PAGAMENTO');
          }
        }}>Copiar texto de demonstração</Button>
        <Button onClick={() => {
          update(s => ({
            ...s,
            paymentPaid: true,
            paidInvoices: [...new Set([...s.paidInvoices, s.students[0].id])]
          }));
          setOpen(false);
          notify('Pagamento simulado. Nenhuma transação real realizada.');
        }}>Simular confirmação de pagamento</Button>
      </div>
    </Modal>
    <DemoNote>Pix, boleto e cartão dependem de integração futura</DemoNote>
  </>;
}
export function Notices() {
  return <>
    <StudentTitle eyebrow="CONEXÃO COM SUA ACADEMIA" title="No nosso ritmo." description="Novidades para você continuar em movimento." />{[{
      label: 'NOVIDADE',
      date: '12 out. 2026',
      title: 'Uma semana para ir além.',
      text: 'Aulas de funcional, cycling e mobilidade esperam por você. Encontre sua energia na nova grade.',
      icon: 'calendar'
    }, {
      label: 'COMUNIDADE',
      date: '10 out. 2026',
      title: 'Cada conquista merece ser vista.',
      text: 'Compartilhe suas metas com seu professor. Seu próximo passo começa com um bom plano.',
      icon: 'target'
    }, {
      label: 'INFORMAÇÃO',
      date: '8 out. 2026',
      title: 'Seu espaço, nosso cuidado.',
      text: 'Respeite os intervalos entre séries, guarde seus equipamentos e mantenha a hidratação em dia.',
      icon: 'dumbbell'
    }].map(n => <article key={n.title} className="notice-article">
      <div className="notice-art">
        <Icon name={n.icon} size={48} />
        <span>{n.label}</span>
      </div>
      <small>{n.date} · aviso fictício</small>
      <h2>{n.title}</h2>
      <p>{n.text}</p>
    </article>)}<DemoNote>Avisos locais · sem push ou WhatsApp</DemoNote>
  </>;
}
export function StudentProfile() {
  const {
    tenantId,
    state,
    update,
    notify
  } = useMock();
  const student = state.students[0];
  const [notifications, setNotifications] = useState(true);
  return <>
    <div className="student-profile">
      <Avatar name={student.name} size="large" />
      <h1>{student.name}</h1>
      <p>{tenants[tenantId].name} · perfil demonstrativo</p>
      <Badge tone={student.status === 'Ativo' ? 'success' : 'danger'}>{student.status}</Badge>
    </div>
    <Panel title="Seu cadastro">
      <dl className="detail-list">
        <div>
          <dt>E-mail</dt>
          <dd>{student.email}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{student.phone}</dd>
        </div>
        <div>
          <dt>Plano</dt>
          <dd>{student.plan}</dd>
        </div>
      </dl>
    </Panel>
    <Panel title="Privacidade e preferências">
      <label className="checkbox-field">
        <input type="checkbox" checked={student.consent} onChange={e => {
          const consent = e.target.checked;
          update(s => ({
            ...s,
            students: s.students.map((x, i) => i === 0 ? {
              ...x,
              consent
            } : x)
          }));
          notify('Preferência de consentimento demonstrativo atualizada.');
        }} />
        <span>Permitir evolução física fictícia</span>
      </label>
      <label className="checkbox-field">
        <input type="checkbox" checked={notifications} onChange={e => {
          setNotifications(e.target.checked);
          notify('Preferência visual alterada nesta sessão. Nenhum push será enviado.');
        }} />
        <span>Receber avisos · preferência visual</span>
      </label>
      <p className="muted small">Nenhum dado biométrico real é coletado. Você pode revogar a exibição de evolução a qualquer momento.</p>
    </Panel>
    <div className="profile-links">
      <Link href="/aluno/mensalidades">
        <Icon name="money" />Mensalidades<Icon name="arrow" />
      </Link>
      <Link href="/aluno/avisos">
        <Icon name="bell" />Mural de avisos<Icon name="arrow" />
      </Link>
      <Link href="/painel">
        <Icon name="dashboard" />Voltar à gestão<Icon name="arrow" />
      </Link>
      <Link href="/login">
        <Icon name="logout" />Acessar outra experiência<Icon name="arrow" />
      </Link>
    </div>
    <DemoNote>Prévia web · não é um app Flutter</DemoNote>
  </>;
}
