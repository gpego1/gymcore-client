'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMock } from '@/lib/store';
import { tenants, money } from '@/lib/domain';
import { Icon } from './icons';
import { Badge, Button, DemoNote, PageHeading, Panel } from './ui';
const steps = ['Cadastro', 'Plano', 'Contrato', 'Assinatura', 'Cobrança'];
export function Enrollment() {
  const {
    tenantId,
    state,
    update,
    notify
  } = useMock();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('Essencial');
  const [accepted, setAccepted] = useState(false);
  const [signed, setSigned] = useState('');
  const [payment, setPayment] = useState('Pix');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const dirty = !!name && !done;
  useEffect(() => {
    if (!dirty) return;
    const unload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const navigate = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (a && a.href !== location.href && !window.confirm('A matrícula ainda não foi concluída. Descartar o preenchimento?')) e.preventDefault();
    };
    window.addEventListener('beforeunload', unload);
    document.addEventListener('click', navigate, true);
    return () => {
      window.removeEventListener('beforeunload', unload);
      document.removeEventListener('click', navigate, true);
    };
  }, [dirty]);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (step === 0 && name.trim().length < 3) {
      setError('Informe um nome com pelo menos 3 caracteres, além de espaços.');
      e.currentTarget.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      return;
    }
    if (step === 0 && phone.replace(/\D/g, '').length < 8) {
      setError('Informe um telefone fictício com pelo menos 8 dígitos.');
      e.currentTarget.querySelector<HTMLInputElement>('[name="phone"]')?.focus();
      return;
    }
    if (step === 0 && state.students.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      setError('Este e-mail já tem cadastro na academia. Use outro e-mail ou consulte a lista de alunos.');
      e.currentTarget.querySelector<HTMLInputElement>('[name="email"]')?.focus();
      return;
    }
    if (step === 3 && signed.trim().toLowerCase() !== name.trim().toLowerCase()) {
      setError('Digite o nome completo igual ao cadastro para simular a assinatura.');
      e.currentTarget.querySelector<HTMLInputElement>('[name="signature"]')?.focus();
      return;
    }
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    const id = tenantId + '-' + crypto.randomUUID();
    update(s => ({
      ...s,
      students: [...s.students, {
        id,
        name: name.trim(),
        email,
        phone,
        plan,
        status: 'Ativo',
        since: '2026-10-12',
        visits: 0,
        daysLate: 0,
        consent
      }]
    }));
    setDone(id);
    notify('Matrícula criada. Contrato, assinatura e cobrança foram simulados.');
  }
  return <>
    <PageHeading eyebrow="UM NOVO COMEÇO" title="Nova matrícula" description="Da primeira conversa ao primeiro treino. Tudo no mesmo fluxo." />{done ? <Panel className="success-panel">
      <span className="success-emblem">
        <Icon name="check" size={36} />
      </span>
      <Badge tone="success">Matrícula concluída</Badge>
      <h2>Bem-vindo ao próximo nível, {name.split(' ')[0]}.</h2>
      <p>Plano {plan} · {tenants[tenantId].name}</p>
      <p className="muted">Contrato e assinatura simulados. A primeira cobrança foi criada como demonstração, sem pagamento real.</p>
      <div className="button-row">
        <Button asChild>
          <Link href={'/painel/alunos/' + done}>Ver perfil do aluno</Link>
        </Button>
        <Button variant="secondary" onClick={() => {
          setDone('');
          setStep(0);
          setName('');
          setEmail('');
          setPhone('');
          setSigned('');
          setAccepted(false);
          setConsent(false);
        }}>Matricular outro aluno</Button>
      </div>
    </Panel> : <div className="enrollment-layout">
      <Panel className="enrollment-panel">
        <ol className="stepper" aria-label="Etapas da matrícula">{steps.map((s, i) => <li key={s} aria-current={step === i ? 'step' : undefined} className={i < step ? 'complete' : i === step ? 'current' : ''}>
            <span>{i < step ? <Icon name="check" size={15} /> : i + 1}</span>
            <small>{s}</small>
          </li>)}</ol>
        <form onSubmit={submit} className="enrollment-form" data-enrollment-dirty={dirty ? "true" : "false"}>
          <div className="eyebrow">ETAPA {step + 1} DE 5</div>
          <h2>{['Vamos conhecer o aluno.', 'Um plano para ir além.', 'Clareza desde o início.', 'Um compromisso com a evolução.', 'Tudo pronto para começar.'][step]}</h2>{step === 0 && <div className="form-stack">
            <label className="field">
              <span>Nome completo</span>
              <input name="name" autoComplete="name" required minLength={3} maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: Mariana Oliveira…" />
            </label>
            <div className="form-grid">
              <label className="field">
                <span>E-mail</span>
                <input name="email" type="email" autoComplete="email" spellCheck={false} required value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex.: aluno@example.com…" />
              </label>
              <label className="field">
                <span>Telefone</span>
                <input name="phone" type="tel" autoComplete="tel" required minLength={8} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex.: (11) 90000-0000…" />
              </label>
            </div>
            <label className="checkbox-field">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span>Autorizar exibição de evolução física fictícia no protótipo</span>
            </label>
          </div>}{step === 1 && <fieldset className="plan-picker">
            <legend className="sr-only">Escolha o plano</legend>{[{
              name: 'Essencial',
              price: 189.9,
              details: 'Musculação + avaliação inicial'
            }, {
              name: 'Performance',
              price: 249.9,
              details: 'Musculação + todas as aulas + avaliação'
            }].map(p => <label key={p.name} className={plan === p.name ? 'plan-option selected' : 'plan-option'}>
              <input name="plan" type="radio" value={p.name} checked={plan === p.name} onChange={() => setPlan(p.name)} />
              <span>
                <strong>{p.name}</strong>
                <small>{p.details}</small>
              </span>
              <b>{money(p.price)}<small>/ mês</small>
              </b>
            </label>)}</fieldset>}{step === 2 && <>
            <div className="contract">
              <Badge tone="info">Documento demonstrativo</Badge>
              <h3>Contrato de prestação de serviços</h3>
              <p>
                <strong>{tenants[tenantId].name}</strong> e <strong>{name}</strong> acordam a adesão ao plano {plan}, no valor mensal de {money(plan === 'Performance' ? 249.9 : 189.9)}.</p>
              <p>O plano inclui os serviços selecionados. Horários de funcionamento, cancelamento e uso dos espaços devem ser informados antes da assinatura.</p>
              <p>Este texto é um exemplo de interface. Não é um contrato válido e precisa de revisão jurídica antes de uso em produção.</p>
            </div>
            <label className="checkbox-field">
              <input type="checkbox" required checked={accepted} onChange={e => setAccepted(e.target.checked)} />
              <span>Li e aceito o contrato demonstrativo</span>
            </label>
          </>}{step === 3 && <div className="form-stack">
            <div className="privacy-note">
              <Icon name="shield" />
              <p>Assinatura simulada. Não há validação de identidade nem serviço de assinatura digital.</p>
            </div>
            <label className="field">
              <span>Digite seu nome completo</span>
              <input name="signature" autoComplete="name" required value={signed} onChange={e => setSigned(e.target.value)} placeholder={name + '…'} />
            </label>
            <div className="signature-preview" aria-hidden="true">{signed || 'Sua assinatura aqui'}</div>
          </div>}{step === 4 && <div className="form-stack">
            <label className="field">
              <span>Forma de cobrança demonstrativa</span>
              <select name="payment" value={payment} onChange={e => setPayment(e.target.value)}>
                <option>Pix</option>
                <option>Boleto</option>
                <option>Cartão recorrente</option>
              </select>
            </label>
            <div className="payment-summary">
              <span>Primeira mensalidade</span>
              <strong>{money(plan === 'Performance' ? 249.9 : 189.9)}</strong>
              <Badge tone="info">Simulação · {payment}</Badge>
            </div>
            <p className="muted">Nenhum pagamento será processado. A demo ativa a matrícula localmente para explorar o fluxo de acesso.</p>
          </div>}{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions">{step > 0 ? <Button type="button" variant="secondary" onClick={() => {
              setStep(step - 1);
              setError('');
            }}>
              <Icon name="arrow" className="reverse" size={16} />Voltar</Button> : <span />}<Button type="submit">{step === 4 ? 'Concluir matrícula demonstrativa' : 'Continuar para ' + steps[step + 1].toLowerCase()}<Icon name={step === 4 ? 'check' : 'arrow'} size={17} />
            </Button>
          </div>
        </form>
      </Panel>
      <aside className="enrollment-summary">
        <span className="summary-kicker">O PRÓXIMO PASSO</span>
        <Icon name="dumbbell" size={46} />
        <h3>Uma nova história começa aqui.</h3>
        <p>Uma experiência de matrícula tão fluida quanto o primeiro treino deve ser.</p>
        <dl>
          <div>
            <dt>Academia</dt>
            <dd>{tenants[tenantId].name}</dd>
          </div>
          <div>
            <dt>Aluno</dt>
            <dd>{name || 'A definir'}</dd>
          </div>
          <div>
            <dt>Plano</dt>
            <dd>{plan}</dd>
          </div>
        </dl>
        <DemoNote>Assinatura e cobrança simuladas</DemoNote>
      </aside>
    </div>}<DemoNote />
  </>;
}
