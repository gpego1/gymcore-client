'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Icon, Logo } from './icons';
import { Badge, Button, DemoNote } from './ui';
export function Login() {
  const router = useRouter();
  const [role, setRole] = useState('gestor');
  return <main className="login-page">
    <section className="login-story">
      <Link href="/site" aria-label="Conhecer GymCore">
        <Logo />
      </Link>
      <span className="eyebrow">SEU NÚCLEO DE EVOLUÇÃO</span>
      <h1>A força está<br />no próximo<br />
        <span>movimento.</span>
      </h1>
      <div className="login-plate" aria-hidden="true">
        <Icon name="dumbbell" size={160} />
        <span>G / C</span>
      </div>
      <p>Um negócio mais forte começa com uma gestão que acompanha seu ritmo.</p>
    </section>
    <section className="login-form-section">
      <Link href="/site" className="back-link">
        <Icon name="arrow" className="reverse" size={16} />Conheça o GymCore</Link>
      <div className="login-form-wrap">
        <Badge tone="info">AMBIENTE DEMONSTRATIVO</Badge>
        <h2>Vamos em frente.</h2>
        <p>Escolha uma experiência para explorar.</p>
        <form className="form-stack" onSubmit={e => {
          e.preventDefault();
          router.push(role === 'aluno' ? '/aluno' : role === 'recepcao' ? '/recepcao' : '/painel');
        }}>
          <label className="field">
            <span>Seu e-mail demonstrativo</span>
            <input name="email" type="email" autoComplete="email" spellCheck={false} defaultValue="gestor@example.com" required />
          </label>
          <label className="field">
            <span>Experiência</span>
            <select name="role" value={role} onChange={e => setRole(e.target.value)}>
              <option value="gestor">Gestão e recepção</option>
              <option value="aluno">Aluno · prévia web</option>
              <option value="recepcao">Terminal de acesso</option>
            </select>
          </label>
          <Button type="submit" className="full-width">Entrar na demonstração<Icon name="arrow" />
          </Button>
        </form>
        <div className="privacy-note">
          <Icon name="shield" />
          <p>Não há autenticação real. O e-mail não é enviado ou salvo. Não use credenciais reais.</p>
        </div>
        <DemoNote>Sem senha, backend ou integrações externas</DemoNote>
      </div>
      <span className="login-footer">GymCore · Força na gestão. Foco nas pessoas.</span>
    </section>
  </main>;
}
