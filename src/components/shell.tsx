'use client';

import Link from 'next/link';
import { features, isRouteEnabled } from '@/lib/features';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Icon, Logo } from './icons';
import { Avatar, Button, Modal, Badge } from './ui';
import { useMock } from '@/lib/store';
import { tenants, type TenantId } from '@/lib/domain';
export const navigation = [{
  label: 'Visão geral',
  href: '/painel',
  icon: 'dashboard'
}, {
  label: 'Alunos',
  href: '/painel/alunos',
  icon: 'students'
}, {
  label: 'Matrículas',
  href: '/painel/matriculas',
  icon: 'plus'
}, {
  label: 'Agenda de aulas',
  href: '/painel/aulas',
  icon: 'calendar'
}, {
  label: 'Leads',
  href: '/painel/leads',
  icon: 'lead'
}, {
  label: 'Inadimplência',
  href: '/painel/inadimplencia',
  icon: 'warning'
}, {
  label: 'Financeiro',
  href: '/painel/financeiro',
  icon: 'money'
}, {
  label: 'Comissões',
  href: '/painel/comissoes',
  icon: 'commission'
}, {
  label: 'Ponto de venda',
  href: '/painel/pdv',
  icon: 'bag'
}].filter(item => isRouteEnabled(item.href));
export function Shell({
  children
}: {
  children: ReactNode;
}) {
  const path = usePathname();
  const {
    tenantId,
    setTenantId,
    state
  } = useMock();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState(false);
  const content = <>
    <Link href="/painel" className="sidebar-brand" aria-label="GymCore, visão geral">
      <Logo />
    </Link>
    <div className="workspace-label">SEU ESPAÇO DE GESTÃO</div>
    <nav className="main-nav" aria-label="Navegação de gestão">{navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setMenu(false)} aria-current={(item.href === '/painel' ? path === item.href : path.startsWith(item.href)) ? 'page' : undefined} className={(item.href === '/painel' ? path === item.href : path.startsWith(item.href)) ? 'nav-item active' : 'nav-item'}>
        <Icon name={item.icon} size={19} />
        <span>{item.label}</span>{item.label === 'Inadimplência' && state.students.some(s => s.daysLate > 0) && <span className="nav-count">{state.students.filter(s => s.daysLate > 0).length}</span>}</Link>)}</nav>
    <div className="sidebar-bottom">
      <div className="workspace-label">OUTRAS EXPERIÊNCIAS</div>
      {features.studentArea && <Link href="/aluno" className="nav-item">
        <Icon name="phone" size={19} />Área do aluno<Icon name="arrow" size={14} />
      </Link>}
      <Link href="/recepcao" className="nav-item">
        <Icon name="tablet" size={19} />Terminal de acesso<Icon name="arrow" size={14} />
      </Link>
      <Link href="/site" className="nav-item">
        <Icon name="sun" size={19} />Conheça o GymCore</Link>
      <div className="plan-note">
        <Icon name="shield" />
        <div>
          <strong>Plano Performance</strong>
          <span>Uma gestão mais forte.</span>
        </div>
      </div>
      <Link href="/login" className="sidebar-user">
        <Avatar name="Daniel Ribeiro" />
        <span>
          <strong>Daniel Ribeiro</strong>
          <small>Gestor · acesso demonstrativo</small>
        </span>
        <Icon name="logout" size={16} />
      </Link>
    </div>
  </>;
  return <div className="app-shell" style={{
    '--tenant-accent': tenants[tenantId].accent
  } as React.CSSProperties}>
    <a className="skip-link" href="#main">Pular para o conteúdo</a>
    <aside className="sidebar">{content}</aside>
    <div className="workspace">
      <header className="topbar">
        <Button variant="ghost" size="icon" className="mobile-menu" aria-label="Abrir navegação" onClick={() => setMenu(true)}>
          <Icon name="menu" />
        </Button>
        <div className="tenant-control">
          <span className="tenant-avatar">{tenants[tenantId].initials}</span>
          <div>
            <label htmlFor="tenant" className="sr-only">Academia atual</label>
            <select id="tenant" name="tenant" value={tenantId} onChange={e => {
              if (document.querySelector('[data-enrollment-dirty="true"]') && !window.confirm('A matrícula ainda não foi concluída. Trocar de academia e descartar o preenchimento?')) return;
              setTenantId(e.target.value as TenantId);
            }}>{Object.entries(tenants).map(([id, t]) => <option key={id} value={id}>{t.name}</option>)}</select>
            <small>{tenants[tenantId].location}</small>
          </div>
        </div>
        <div className="topbar-actions">
          <Badge tone="info">Demo local</Badge>
          <Button variant="ghost" size="icon" onClick={() => setSearch(true)} aria-label="Buscar alunos e telas">
            <Icon name="search" />
          </Button>
          <Button variant="ghost" size="icon" className="notification-button" onClick={() => setNotifications(true)} aria-label="Ver avisos da academia">
            <Icon name="bell" />
            <span />
          </Button>
          <Link href="/login" className="user-link" aria-label="Trocar experiência demonstrativa">
            <Avatar name="Daniel Ribeiro" />
          </Link>
        </div>
      </header>
      <main id="main" className="main-content" tabIndex={-1}>{children}<footer className="workspace-footer">
          <span>GymCore · Força na gestão. Foco nas pessoas.</span>
          <span>Todos os dados são fictícios.</span>
        </footer>
      </main>
    </div>
    <Modal open={menu} onOpenChange={setMenu} title="Navegação" description="Escolha uma área do GymCore.">
      <div className="mobile-navigation">{content}</div>
    </Modal>
    <Modal open={search} onOpenChange={setSearch} title="Encontre seu próximo passo" description="Busque um aluno ou uma área da academia.">
      <label className="field">
        <span>Buscar</span>
        <input name="global-search" placeholder="Nome do aluno ou tela…" value={query} onChange={e => setQuery(e.target.value)} autoComplete="off" />
      </label>
      <div className="search-results">{[...navigation.map(n => ({
          name: n.label,
          href: n.href,
          kind: 'Área de gestão'
        })), ...state.students.map(s => ({
          name: s.name,
          href: '/painel/alunos/' + s.id,
          kind: s.plan
        }))].filter(x => x.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8).map(x => <Link key={x.href} href={x.href} onClick={() => setSearch(false)}>
          <span>{x.name}<small>{x.kind}</small>
          </span>
          <Icon name="arrow" size={18} />
        </Link>)}</div>
    </Modal>
    <Modal open={notifications} onOpenChange={setNotifications} title="O que acontece na academia" description="Avisos demonstrativos, sem mensagens externas.">
      {features.classes && <div className="notice-card">
        <Icon name="calendar" />
        <div>
          <strong>Uma semana para ir além</strong>
          <p>A grade de aulas de outubro já está disponível.</p>
        </div>
      </div>}
      {features.commissions && <div className="notice-card">
        <Icon name="money" />
        <div>
          <strong>Fechamento do mês</strong>
          <p>Revise as comissões dos professores no painel.</p>
        </div>
      </div>}
      {!features.classes && !features.commissions && <p className="muted">Nenhum aviso no momento.</p>}
    </Modal>
  </div>;
}
