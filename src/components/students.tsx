'use client';

import Link from 'next/link';
import { features } from '@/lib/features';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMock } from '@/lib/store';
import { date, money, exercises } from '@/lib/domain';
import { downloadCsv } from '@/lib/export';
import { Icon } from './icons';
import { Avatar, Badge, Button, DemoNote, Empty, Modal, PageHeading, Panel } from './ui';
export function Students() {
  const {
    state,
    notify
  } = useMock();
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get('q') ?? '';
  const status = params.get('status') ?? 'Todos';
  function filter(key: string, value: string) {
    const p = new URLSearchParams(params);
    if (value && value !== 'Todos') p.set(key, value);else p.delete(key);
    router.replace('/painel/alunos?' + p, {
      scroll: false
    });
  }
  const visible = state.students.filter(s => s.name.toLocaleLowerCase('pt-BR').includes(q.toLocaleLowerCase('pt-BR')) && (status === 'Todos' || s.status === status));
  return <>
    <PageHeading eyebrow="PESSOAS EM PRIMEIRO LUGAR" title="Alunos" description="Cada nome tem uma história. Acompanhe a evolução de cada uma." actions={<Button asChild>
      <Link href="/painel/matriculas">
        <Icon name="plus" />Nova matrícula</Link>
    </Button>} />
    <div className="summary-strip">
      <span>
        <strong>{state.students.length}</strong>alunos na amostra</span>
      <span>
        <strong className="text-success">{state.students.filter(s => s.status === 'Ativo').length}</strong>ativos</span>
      <span>
        <strong className="text-danger">{state.students.filter(s => s.status === 'Inadimplente').length}</strong>em atraso</span>
    </div>
    <Panel>
      <div className="table-toolbar">
        <div className="search-field">
          <Icon name="search" />
          <input aria-label="Buscar aluno por nome" name="q" autoComplete="off" placeholder="Buscar por nome…" value={q} onChange={e => filter('q', e.target.value)} />
        </div>
        <select aria-label="Filtrar status do aluno" value={status} name="status" onChange={e => filter('status', e.target.value)}>{['Todos', 'Ativo', 'Inadimplente', 'Inativo'].map(s => <option key={s}>{s}</option>)}</select>
        <Button variant="secondary" onClick={() => {
          downloadCsv('gymcore-alunos.csv', [['Nome', 'Plano', 'Status', 'Email'], ...visible.map(s => [s.name, s.plan, s.status, s.email])]);
          notify('Lista de alunos fictícios exportada.');
        }}>
          <Icon name="download" size={16} />Exportar</Button>
      </div>{visible.length ? <div className="table-scroll">
        <table>
          <caption className="sr-only">Alunos da academia selecionada</caption>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Frequência</th>
              <th>Desde</th>
              <th>
                <span className="sr-only">Perfil</span>
              </th>
            </tr>
          </thead>
          <tbody>{visible.map(s => <tr key={s.id}>
              <td>
                <Link className="student-cell" href={'/painel/alunos/' + s.id}>
                  <Avatar name={s.name} />
                  <span>
                    <strong>{s.name}</strong>
                    <small>{s.email}</small>
                  </span>
                </Link>
              </td>
              <td>{s.plan}</td>
              <td>
                <Badge tone={s.status === 'Ativo' ? 'success' : s.status === 'Inadimplente' ? 'danger' : 'neutral'}>{s.status}</Badge>
              </td>
              <td>{s.visits} visitas</td>
              <td className="muted">{date(s.since)}</td>
              <td>
                <Link href={'/painel/alunos/' + s.id} className="icon-link" aria-label={'Ver perfil de ' + s.name}>
                  <Icon name="arrow" size={18} />
                </Link>
              </td>
            </tr>)}</tbody>
        </table>
      </div> : <Empty title="Nenhum aluno encontrado" description="Tente outro nome ou remova o filtro de status." action={<Button variant="secondary" onClick={() => router.replace('/painel/alunos')}>Limpar filtros</Button>} />}<div className="table-footer">{visible.length} registros · dados fictícios</div>
    </Panel>
    <DemoNote />
  </>;
}
export function StudentProfile({
  id
}: {
  id: string;
}) {
  const {
    state,
    update,
    notify
  } = useMock();
  const student = state.students.find(s => s.id === id);
  const [edit, setEdit] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  if (!student) return <Empty title="Aluno não encontrado nesta academia" description="Selecione a academia correta ou retorne à lista de alunos." action={<Button asChild>
    <Link href="/painel/alunos">Ver alunos</Link>
  </Button>} />;
  return <>
    <Link href="/painel/alunos" className="back-link">
      <Icon name="arrow" className="reverse" size={16} />Todos os alunos</Link>
    <div className="profile-heading">
      <Avatar name={student.name} size="large" />
      <div>
        <Badge tone={student.status === 'Ativo' ? 'success' : 'danger'}>{student.status}</Badge>
        <h1>{student.name}</h1>
        <p>{student.plan} · Aluno desde {date(student.since)}</p>
      </div>
      <Button variant="secondary" onClick={() => setEdit(true)}>Editar cadastro</Button>
    </div>
    <div className="detail-grid">
      <Panel title="Dados do aluno">
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
            <dt>Mensalidade</dt>
            <dd>{money(student.plan === 'Performance' ? 249.9 : 189.9)} · valor ilustrativo</dd>
          </div>
          <div>
            <dt>Acessos registrados</dt>
            <dd>{student.visits} visitas</dd>
          </div>
        </dl>
        <div className="privacy-note">
          <Icon name="shield" />
          <p>Dados fictícios. Saúde e biometria exigirão consentimento e permissão específica em produção.</p>
        </div>
        <Button variant="ghost" onClick={() => setPrivacy(true)}>Gerenciar consentimento demonstrativo</Button>
      </Panel>
      {features.studentArea && <Panel title="Treino atual" description="Ficha A · superiores e core">
        <div className="exercise-preview">{exercises.map(e => <div key={e.id}>
            <span className="exercise-icon">
              <Icon name="dumbbell" />
            </span>
            <span>
              <strong>{e.name}</strong>
              <small>{e.muscle}</small>
            </span>
            <span>{e.sets} × {e.reps}</span>
          </div>)}</div>
        <Button asChild variant="secondary">
          <Link href="/aluno/treino">Abrir prévia do treino do aluno<Icon name="arrow" size={16} />
          </Link>
        </Button>
      </Panel>}
    </div>
    <Panel title="Linha do tempo" description="Histórico demonstrativo">
      <ol className="timeline">
        <li>
          <span />
          <div>
            <strong>Matrícula registrada</strong>
            <p>Plano {student.plan} · {date(student.since)}</p>
          </div>
        </li>
        <li>
          <span />
          <div>
            <strong>Avaliação inicial</strong>
            <p>{student.consent ? 'Consentimento demonstrativo registrado.' : 'Dados restritos: consentimento não registrado.'}</p>
          </div>
        </li>
        <li>
          <span />
          <div>
            <strong>{student.daysLate ? 'Mensalidade em aberto' : 'Plano ativo'}</strong>
            <p>{student.daysLate ? student.daysLate + ' dias em atraso. Acompanhe no painel de inadimplência.' : 'Acesso disponível para o próximo treino.'}</p>
          </div>
        </li>
      </ol>
    </Panel>
    <Modal open={edit} onOpenChange={setEdit} title="Editar cadastro" description="As alterações ficam apenas nesta demo, para a academia atual.">
      <form className="form-stack" onSubmit={e => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        update(s => ({
          ...s,
          students: s.students.map(x => x.id === id ? {
            ...x,
            name: String(data.get('name')).trim(),
            email: String(data.get('email')),
            phone: String(data.get('phone'))
          } : x)
        }));
        setEdit(false);
        notify('Cadastro atualizado localmente.');
      }}>
        <label className="field">
          <span>Nome completo</span>
          <input name="name" autoComplete="name" defaultValue={student.name} required maxLength={80} />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input name="email" type="email" autoComplete="email" spellCheck={false} defaultValue={student.email} required />
        </label>
        <label className="field">
          <span>Telefone</span>
          <input name="phone" type="tel" autoComplete="tel" defaultValue={student.phone} required />
        </label>
        <Button type="submit">Salvar cadastro</Button>
      </form>
    </Modal>
    <Modal open={privacy} onOpenChange={setPrivacy} title="Consentimento e privacidade" description="Controle visual demonstrativo; não representa consentimento jurídico válido.">
      <p>Permitir a exibição de informações fictícias de evolução física neste protótipo.</p>
      <label className="checkbox-field">
        <input type="checkbox" checked={student.consent} onChange={e => {
          const consent = e.target.checked;
          update(s => ({
            ...s,
            students: s.students.map(x => x.id === id ? {
              ...x,
              consent
            } : x)
          }));
          notify(consent ? 'Consentimento demonstrativo ativado.' : 'Consentimento demonstrativo revogado.');
        }} />
        <span>Compartilhar evolução física com o professor</span>
      </label>
      <p className="muted">Nenhuma imagem facial ou informação de saúde real é coletada.</p>
    </Modal>
    <DemoNote />
  </>;
}
