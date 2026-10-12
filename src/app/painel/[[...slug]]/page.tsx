import { notFound } from 'next/navigation';
import { ManagementPage } from '@/components/pages';
export default async function Page({
  params
}: {
  params: Promise<{
    slug?: string[];
  }>;
}) {
  const {
    slug = []
  } = await params;
  if (slug.length > 2 || slug.length === 2 && slug[0] !== 'alunos' || slug[0] && !['alunos', 'matriculas', 'aulas', 'inadimplencia', 'leads', 'financeiro', 'comissoes', 'pdv'].includes(slug[0])) notFound();
  return <ManagementPage slug={slug} />;
}
