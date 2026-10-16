// Public build-time flags. Restart dev/rebuild after changing the environment.
export const features = {
  classes: process.env.NEXT_PUBLIC_FEATURE_CLASSES === 'true',
  leads: process.env.NEXT_PUBLIC_FEATURE_LEADS === 'true',
  commissions: process.env.NEXT_PUBLIC_FEATURE_COMMISSIONS === 'true',
  pointOfSale: process.env.NEXT_PUBLIC_FEATURE_POS === 'true',
  studentArea: process.env.NEXT_PUBLIC_FEATURE_STUDENT_AREA === 'true',
} as const;

export function isRouteEnabled(path: string): boolean {
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const modules = [
    ['/painel/aulas', features.classes],
    ['/painel/leads', features.leads],
    ['/painel/comissoes', features.commissions],
    ['/painel/pdv', features.pointOfSale],
    ['/aluno', features.studentArea],
  ] as const;
  return modules.every(([route, enabled]) =>
    enabled || (pathname !== route && !pathname.startsWith(route + '/')));
}
