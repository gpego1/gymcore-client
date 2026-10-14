'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { GymCarousel } from './gym-carousel';
import { Logo, Icon } from './icons';
import { Badge, Button } from './ui';
export function Landing() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const sync = () => {
      observer?.disconnect();
      delete element.dataset.motionReady;
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = 'true';
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      element.querySelectorAll<HTMLElement>('[data-reveal]').forEach(target => {
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) target.dataset.visible = 'true';
        if (!target.dataset.visible) observer?.observe(target);
      });
      element.dataset.motionReady = 'true';
    };
    sync();
    preference.addEventListener('change', sync);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', sync);
      delete element.dataset.motionReady;
    };
  }, []);
  return <div ref={root} className="landing">
    <a href="#landing-main" className="skip-link">Pular para o conteúdo</a>
    <header className="landing-header">
      <Link href="/" aria-label="GymCore, início">
        <Logo />
      </Link>
      <nav aria-label="Apresentação">
        <a href="#produto">O produto</a>
        <a href="#experiencias">Experiências</a>
        <a href="#planos">Planos</a>
      </nav>
      <Button asChild variant="secondary">
        <Link href="/login">Entrar<Icon name="arrow" size={16} />
        </Link>
      </Button>
    </header>
    <main id="landing-main">
      <section className="landing-hero">
        <div className="hero-copy">
          <Badge tone="info">GESTÃO PARA QUEM VAI ALÉM</Badge>
          <h1>Força na gestão.<br />
            <span>Foco nas pessoas.</span>
          </h1>
          <p>Menos planilhas. Mais movimento. Uma plataforma que conecta sua academia, sua equipe e cada aluno ao próximo nível.</p>
          <div className="button-row">
            <Button asChild>
              <Link href="/painel">Explorar demonstração<Icon name="arrow" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/aluno">Conhecer a área do aluno</Link>
            </Button>
          </div>
          <span className="hero-note">
            <Icon name="shield" size={16} />Demo navegável · sem cadastro ou cobrança</span>
        </div>
        <GymCarousel />
        <div className="hero-bottom">
          <span>PROJETADO PARA O DIA A DIA REAL.</span>
          <span>01 / GESTÃO EM MOVIMENTO</span>
        </div>
      </section>
      <section id="produto" className="landing-product">
        <div className="eyebrow" data-reveal>UM NÚCLEO. TODA A OPERAÇÃO.</div>
        <h2 data-reveal>Seu negócio não para.<br />Sua gestão acompanha.</h2>
        <div className="landing-features">{[{
            icon: 'dashboard',
            title: 'Decisões com direção.',
            text: 'Indicadores claros, financeiro organizado e atenção ao que precisa de você.',
            href: '/painel'
          }, {
            icon: 'students',
            title: 'Pessoas no centro.',
            text: 'Do primeiro contato à renovação. Uma jornada de matrícula mais próxima e fluida.',
            href: '/painel/alunos'
          }, {
            icon: 'exit',
            title: 'Acesso sem dúvida.',
            text: 'Feedback imediato e estados claros. A recepção pode focar no acolhimento.',
            href: '/recepcao'
          }].map((f, i) => <Link key={f.title} href={f.href} data-reveal>
            <span className="feature-index">0{i + 1}</span>
            <Icon name={f.icon} size={32} />
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <span>Explorar<Icon name="arrow" size={16} />
            </span>
          </Link>)}</div>
      </section>
      <section id="experiencias" className="landing-experiences">
        <div data-reveal>
          <div className="eyebrow">CADA PESSOA. SEU PRÓPRIO RITMO.</div>
          <h2>Uma experiência que<br />chega até o treino.</h2>
          <p>Reservas, fichas, check-in e evolução. A prévia web do aluno mostra como a academia pode estar presente em cada conquista.</p>
          <Button asChild>
            <Link href="/aluno">Abrir prévia do aluno<Icon name="arrow" />
            </Link>
          </Button>
          <p className="small muted">Protótipo web responsivo. App Flutter previsto no handoff.</p>
        </div>
        <div className="landing-student-card" data-reveal>
          <div className="phone-top">
            <span>9:41</span>
            <Icon name="wifi" size={16} />
          </div>
          <Logo symbol />
          <small>ATLAS FITNESS</small>
          <h3>Olá, Mariana.</h3>
          <span>Hoje é um bom dia para ir além.</span>
          <div className="mini-checkin">
            <Icon name="qr" />
            <strong>Seu acesso, em um toque.</strong>
          </div>
          <div className="mini-workout">
            <Icon name="dumbbell" size={72} />
            <h4>Força que vem<br />de dentro.</h4>
            <small>TREINO A · SUPERIORES</small>
          </div>
          <div className="mini-phone-nav">
            <Icon name="home" />
            <Icon name="dumbbell" />
            <Icon name="calendar" />
            <Icon name="user" />
          </div>
        </div>
      </section>
      <section id="planos" className="landing-pricing">
        <div className="eyebrow" data-reveal>ESCOLHA O PRÓXIMO NÍVEL</div>
        <h2 data-reveal>Um plano para o seu momento.</h2>
        <p data-reveal>Conceitos comerciais ilustrativos. Não há contratação ou cobrança nesta demo.</p>
        <div className="pricing-grid">{[{
            name: 'Essencial',
            description: 'O núcleo da sua operação',
            items: ['Cadastro e matrícula', 'Controle de acesso', 'Agenda e financeiro']
          }, {
            name: 'Performance',
            description: 'Mais visão. Mais possibilidades.',
            items: ['Tudo do Essencial', 'Leads e régua de cobrança', 'Comissões e experiência do aluno']
          }].map((p, i) => <article key={p.name} data-reveal className={i ? 'pricing-featured' : ''}>
            <Badge tone={i ? 'info' : 'neutral'}>{i ? 'PARA IR ALÉM' : 'PARA COMEÇAR'}</Badge>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>Sob consulta <small>· proposta</small>
            </strong>
            <ul>{p.items.map(item => <li key={item}>
                <Icon name="check" size={17} />{item}</li>)}</ul>
            <Button asChild variant={i ? 'primary' : 'secondary'}>
              <Link href="/painel">Conhecer a demonstração<Icon name="arrow" size={16} />
              </Link>
            </Button>
          </article>)}</div>
      </section>
    </main>
    <footer className="landing-footer">
      <Logo />
      <span>Disciplina na operação. Energia na evolução.</span>
      <span>GymCore · demonstração local</span>
    </footer>
  </div>;
}
