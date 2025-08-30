import { useCallback } from "react";

function App() {
  const handleLogin = useCallback(() => {
    // TODO: integrar com fluxo real de autenticação (OAuth / Keycloak / etc.)
    alert("Fluxo de login ainda não implementado.");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl drop-shadow-[0_0_6px_rgba(100,108,255,0.7)]" aria-hidden>⌛</span>
          <h1 className="m-0 text-base font-semibold tracking-wide">Hybrid Scheduler</h1>
        </div>
        <nav className="hidden md:block" aria-label="Principal">
          <ul className="m-0 flex list-none items-center gap-6 p-0 text-sm text-slate-300">
            <li><a className="relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-cyan-300 after:transition-[width] after:duration-300 hover:after:w-full" href="#features">Funcionalidades</a></li>
            <li><a className="relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-cyan-300 after:transition-[width] after:duration-300 hover:after:w-full" href="#como-funciona">Como funciona</a></li>
            <li><a className="relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-cyan-300 after:transition-[width] after:duration-300 hover:after:w-full" href="#contato">Contato</a></li>
          </ul>
        </nav>
        <div className="flex items-center">
          <button onClick={handleLogin} className="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">Entrar</button>
        </div>
      </header>

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
            <button onClick={handleLogin} className="rounded-md bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">Começar agora</button>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="rounded-md border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">Saiba mais</button>
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
  );
}

export default App;
