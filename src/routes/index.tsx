import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased">
      {/* Header is provided globally by the Root layout */}

      {/* Hero */}
      <main className="flex flex-1 items-center justify-center px-5 py-16 md:py-24">
        <section className="mx-auto max-w-4xl text-center">
          <h2 className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-5xl">
            Gerencie as escalas híbridas (remoto / presencial) da sua equipe
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Centralize a definição de dias de trabalho presencial e remoto, visualize ocupação de escritórios e reduza conflitos de agenda — tudo em um só lugar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" className="rounded-md bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">Começar agora</Link>
            <Link to="/about" className="rounded-md border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">Saiba mais</Link>
          </div>
          <ul aria-label="Benefícios rápidos" className="mt-10 grid list-none grid-cols-1 gap-3 p-0 text-sm text-slate-300 sm:grid-cols-2 md:grid-cols-4">
            <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">Planejamento visual de presença</li>
            <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">Limites de lotação configuráveis</li>
            <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">Relatórios de ocupação</li>
            <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">Integração calendário (futuro)</li>
          </ul>
        </section>
      </main>

      <footer className="px-4 pb-8 pt-2 text-center text-[10px] font-medium tracking-wide text-slate-500">
        <small>© {new Date().getFullYear()} Hybrid Scheduler • Em desenvolvimento</small>
      </footer>
    </div>
  )
}
