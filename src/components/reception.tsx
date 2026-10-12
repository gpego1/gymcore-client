'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMock } from '@/lib/store';
import { access, tenants } from '@/lib/domain';
import { Icon, Logo } from './icons';
import { Avatar, Badge, Button, DemoNote } from './ui';
export function Reception() {
  const {
    tenantId,
    state,
    update
  } = useMock();
  const [mode, setMode] = useState('cpf');
  const [offline, setOffline] = useState(false);
  const [sound, setSound] = useState(false);
  const [cpf, setCpf] = useState('');
  const [selected, setSelected] = useState(state.students[0].id);
  const [faceConsent, setFaceConsent] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof access> | null>(null);
  function check() {
    const index = cpf.replace(/\D/g, '') === '11111111111' ? 0 : cpf.replace(/\D/g, '') === '22222222222' ? 1 : -1;
    const student = mode === 'cpf' ? state.students[index] : state.students.find(s => s.id === selected);
    const r = mode === 'facial' && !faceConsent && !offline ? {
      allowed: false,
      title: 'Consentimento necessário',
      reason: 'Ative o consentimento demonstrativo para explorar a simulação facial. Nenhuma câmera será usada.'
    } : access(student, offline);
    setResult(r);
    if (!offline) update(s => ({
      ...s,
      checkins: [{
        name: student?.name ?? 'Identificador não encontrado',
        allowed: r.allowed,
        time: new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date())
      }, ...s.checkins].slice(0, 8)
    }));
    if (sound) {
      try {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.frequency.value = r.allowed ? 660 : 220;
        gain.gain.value = .08;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + .15);
        oscillator.onended = () => {
          void ctx.close();
        };
      } catch {/* Text and icons remain the primary feedback. */}
      navigator.vibrate?.(r.allowed ? [60] : [80, 50, 80]);
    }
  }
  return <div className="reception-page">
    <a className="skip-link" href="#terminal-main">Pular para o terminal</a>
    <header className="reception-header">
      <Link href="/painel" aria-label="Voltar ao painel">
        <Logo />
      </Link>
      <div>
        <strong>{tenants[tenantId].name}</strong>
        <span>Terminal de recepção · protótipo web</span>
      </div>
      <Badge tone={offline ? 'warning' : 'success'}>{offline ? 'Modo offline · simulado' : 'Online · simulado'}</Badge>
    </header>
    <main id="terminal-main" className="terminal-layout" tabIndex={-1}>
      <section className="terminal-controls">
        <div className="eyebrow">SEU TREINO COMEÇA AQUI</div>
        <h1>Bem-vindo.<br />Vamos em frente.</h1>
        <p>Check-in rápido, acesso claro e o próximo passo sem dúvida.</p>{offline && <div className="offline-banner" role="status">
          <Icon name="wifiOff" />
          <span>Validação indisponível. Nenhum acesso será liberado automaticamente no modo offline.</span>
        </div>}<div className="terminal-tabs" aria-label="Método de acesso">{[{
            id: 'cpf',
            label: 'CPF',
            icon: 'user'
          }, {
            id: 'qr',
            label: 'QR Code',
            icon: 'qr'
          }, {
            id: 'facial',
            label: 'Facial',
            icon: 'face'
          }].map(m => <Button key={m.id} variant={mode === m.id ? 'primary' : 'secondary'} aria-pressed={mode === m.id} onClick={() => {
            setMode(m.id);
            setResult(null);
          }}>
            <Icon name={m.icon} />{m.label}</Button>)}</div>
        <form className="terminal-form" onSubmit={e => {
          e.preventDefault();
          check();
        }}>{mode === 'cpf' ? <>
            <label className="field">
              <span>CPF fictício para demonstração</span>
              <input name="cpf-demo" type="text" inputMode="numeric" autoComplete="off" placeholder="111.111.111-11…" maxLength={14} required value={cpf} onChange={e => setCpf(e.target.value)} />
            </label>
            <p className="muted small">Use apenas os identificadores fictícios abaixo. Não informe um CPF real.</p>
            <div className="demo-identifiers">
              <button type="button" onClick={() => {
                setCpf('111.111.111-11');
                setResult(null);
              }}>
                <Avatar name={state.students[0].name} />
                <span>
                  <strong>{state.students[0].name.split(' ')[0]}</strong>
                  <small>111.111.111-11 · ativo</small>
                </span>
                <Icon name="arrow" size={16} />
              </button>
              <button type="button" onClick={() => {
                setCpf('222.222.222-22');
                setResult(null);
              }}>
                <Avatar name={state.students[1].name} />
                <span>
                  <strong>{state.students[1].name.split(' ')[0]}</strong>
                  <small>222.222.222-22 · cenário em atraso</small>
                </span>
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </> : <>
            <div className="scanner-preview">
              <span />
              <Icon name={mode === 'qr' ? 'qr' : 'face'} size={88} />
              <p>{mode === 'qr' ? 'Leitor de QR demonstrativo' : 'Biometria facial demonstrativa'}</p>
              <small>Sem câmera ou captura de dados</small>
            </div>
            <label className="field">
              <span>Aluno do cenário simulado</span>
              <select name="demo-student" value={selected} onChange={e => {
                setSelected(e.target.value);
                setResult(null);
              }}>{state.students.map(s => <option key={s.id} value={s.id}>{s.name} · {s.status}</option>)}</select>
            </label>{mode === 'facial' && <label className="checkbox-field">
              <input type="checkbox" checked={faceConsent} onChange={e => setFaceConsent(e.target.checked)} />
              <span>Autorizar a simulação visual de reconhecimento facial</span>
            </label>}</>}<Button type="submit" className="terminal-submit">
            <Icon name={mode === 'cpf' ? 'arrow' : mode === 'qr' ? 'qr' : 'face'} />Simular {mode === 'cpf' ? 'validação' : mode === 'qr' ? 'leitura de QR' : 'reconhecimento facial'}</Button>
        </form>
        <div className="terminal-settings">
          <label className="checkbox-field">
            <input type="checkbox" checked={offline} onChange={e => {
              setOffline(e.target.checked);
              setResult(null);
            }} />
            <span>Simular modo offline</span>
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} />
            <span>Ativar som e vibração, se disponíveis</span>
          </label>
        </div>
        <DemoNote>CPF, QR, facial e catraca são simulações locais.</DemoNote>
      </section>
      <section className="terminal-feedback" aria-label="Resultado da validação">
        <div className={'access-result ' + (result ? offline ? 'offline' : result.allowed ? 'allowed' : 'denied' : 'waiting')} role="status" aria-live="polite">
          <div className="access-orbit">
            <Icon name={result ? offline ? 'wifiOff' : result.allowed ? 'check' : 'close' : 'exit'} size={72} />
          </div>
          <span className="eyebrow">{result ? 'VALIDAÇÃO DEMONSTRATIVA' : 'PRONTO PARA O PRÓXIMO ACESSO'}</span>
          <h2>{result?.title ?? 'Seu próximo passo.'}</h2>
          <p>{result?.reason ?? 'Escolha um método de check-in para iniciar a simulação.'}</p>{result && <Button variant="secondary" onClick={() => {
            setResult(null);
            setCpf('');
          }}>Próximo check-in<Icon name="arrow" />
          </Button>}</div>
        <div className="recent-checkins">
          <h2>Últimas verificações <span>· nesta demo</span>
          </h2>{state.checkins.length ? state.checkins.slice(0, 4).map((item, i) => <div key={i}>
            <Icon name={item.allowed ? 'check' : 'close'} className={item.allowed ? 'text-success' : 'text-danger'} />
            <span>{item.name}</span>
            <time>{item.time}</time>
            <Badge tone={item.allowed ? 'success' : 'danger'}>{item.allowed ? 'Liberado' : 'Negado'}</Badge>
          </div>) : <p className="muted">As verificações simuladas aparecerão aqui.</p>}</div>
      </section>
    </main>
    <footer className="reception-footer">
      <Link href="/painel">
        <Icon name="arrow" className="reverse" size={16} />Voltar ao painel</Link>
      <span>Clareza no acesso. Energia no treino.</span>
    </footer>
  </div>;
}
