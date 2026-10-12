'use client';

import Link from 'next/link';
export default function Error({
  reset
}: {
  reset: () => void;
}) {
  return <main className="not-found">
    <h1>Vamos retomar o movimento.</h1>
    <p>Não foi possível abrir esta tela. Tente carregar novamente.</p>
    <button className="button button-primary" onClick={reset}>Tentar novamente</button>
    <Link href="/painel" className="button button-secondary">Voltar ao painel</Link>
  </main>;
}
