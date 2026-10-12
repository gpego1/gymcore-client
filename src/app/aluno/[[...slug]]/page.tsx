import { notFound } from 'next/navigation';
import { StudentPage } from '@/components/pages';
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
  if (slug.length > 1 || slug[0] && !['treino', 'aulas', 'perfil', 'qr', 'evolucao', 'avisos', 'mensalidades', 'onboarding'].includes(slug[0])) notFound();
  return <StudentPage slug={slug} />;
}
