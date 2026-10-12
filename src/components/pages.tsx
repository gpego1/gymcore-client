'use client';

import { Shell } from './shell';
import { Dashboard } from './dashboard';
import { Students, StudentProfile } from './students';
import { Enrollment } from './enrollment';
import { ClassSchedule, Collections, Commissions, Finance, Leads, PointOfSale } from './operations';
import { StudentShell, StudentHome, StudentClasses, StudentProfile as AppProfile, QrCheckIn, Workout, Evolution, Notices, Payments, Onboarding } from './student-app';
import { MockReady, useMock } from '@/lib/store';
function ManagementView({
  slug
}: {
  slug: string[];
}) {
  switch (slug[0]) {
    case 'alunos':
      return slug[1] ? <StudentProfile id={slug[1]} /> : <Students />;
    case 'matriculas':
      return <Enrollment />;
    case 'aulas':
      return <ClassSchedule />;
    case 'inadimplencia':
      return <Collections />;
    case 'leads':
      return <Leads />;
    case 'financeiro':
      return <Finance />;
    case 'comissoes':
      return <Commissions />;
    case 'pdv':
      return <PointOfSale />;
    default:
      return <Dashboard />;
  }
}
export function ManagementPage({
  slug
}: {
  slug: string[];
}) {
  const {
    tenantId
  } = useMock();
  return <MockReady>
    <Shell>
      <ManagementView key={tenantId + slug.join('/')} slug={slug} />
    </Shell>
  </MockReady>;
}
export function StudentPage({
  slug
}: {
  slug: string[];
}) {
  const {
    tenantId
  } = useMock();
  const screens: Record<string, React.ReactNode> = {
    treino: <Workout />,
    aulas: <StudentClasses />,
    perfil: <AppProfile />,
    qr: <QrCheckIn />,
    evolucao: <Evolution />,
    avisos: <Notices />,
    mensalidades: <Payments />,
    onboarding: <Onboarding />
  };
  return <MockReady>
    <StudentShell>
      <div key={tenantId + slug.join('/')}>{screens[slug[0]] ?? <StudentHome />}</div>
    </StudentShell>
  </MockReady>;
}
