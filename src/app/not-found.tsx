import Link from 'next/link';
export default function NotFound() {
  return <main className="not-found">
    <h1>Vamos encontrar seu próximo passo.</h1>
    <p>Esta página não está disponível na demonstração.</p>
    <Link href="/painel" className="button button-primary">Voltar ao painel</Link>
  </main>;
}
