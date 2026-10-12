export default function Loading() {
  return <main className="route-loading" aria-label="Carregando página">
    <span className="skeleton" />
    <span className="skeleton" />
    <p role="status">Carregando a experiência…</p>
  </main>;
}
