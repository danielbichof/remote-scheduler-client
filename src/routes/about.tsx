import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased py-12 px-4">
      <main className="mx-auto w-full max-w-4xl">
        <section className="rounded-lg bg-white/5 border border-white/10 p-8 shadow-sm backdrop-blur-sm">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-white">Sobre o Remote Scheduler</h1>
            <p className="mt-2 text-sm text-slate-300">Sistema de gerenciamento de escalas híbridas (remoto / presencial) pensado para empresas e equipes.</p>
          </header>

          <article className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-white">O que é</h2>
              <p className="mt-2 text-slate-300 text-sm">Uma aplicação para organizar e visualizar escalas de trabalho (remoto, presencial e folgas). Permite que colaboradores consultem sua escala e solicitem mudanças, enquanto gestores podem visualizar todas as escalas e aplicar alterações diretamente.</p>

              <h3 className="mt-4 text-sm font-medium text-white">Funcionalidades (visão rápida)</h3>
              <ul className="mt-2 list-inside list-disc text-slate-300 text-sm space-y-1">
                <li>Visualização mensal/semanal das escalas</li>
                <li>Indicação por ícones (remoto, presencial, folga)</li>
                <li>Solicitação de alteração pelo colaborador</li>
                <li>Edição imediata pelos gestores (troca de tipo de dia)</li>
                <li>Limites de lotação e controle de presença (planejado)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Quem usa</h2>
              <div className="mt-2 text-slate-300 text-sm space-y-2">
                <div>
                  <strong className="text-white">Colaboradores:</strong>
                  <p className="mt-1">Podem visualizar suas escalas, ver ícones por dia e abrir solicitações de mudança quando precisarem.</p>
                </div>
                <div>
                  <strong className="text-white">Gestores / Admins:</strong>
                  <p className="mt-1">Visualizam escalas da equipe e podem alterar tipos de dias (remoto/presencial/folga) diretamente e aprovar solicitações.</p>
                </div>
              </div>
            </div>
          </article>

          <hr className="my-6 border-white/6" />

          <section>
            <h3 className="text-lg font-semibold text-white">Tecnologia</h3>
            <p className="mt-2 text-slate-300 text-sm">Front-end: React + TypeScript + Vite. Calendar: FullCalendar (dayGrid + interaction). Styling: Tailwind + CSS com tema escuro.</p>

            <h3 className="mt-4 text-lg font-semibold text-white">Como testar localmente</h3>
            <pre className="mt-2 rounded bg-black/30 p-3 text-xs text-white/90 overflow-auto"><code>npm install
npm run dev
# abra http://localhost:5173 e vá para /calendar</code></pre>

            <h3 className="mt-4 text-lg font-semibold text-white">Contribuição</h3>
            <p className="mt-2 text-slate-300 text-sm">Este é um projeto em evolução. Sugestões, correções e melhorias são bem-vindas — abra issues ou PRs com pequenas alterações. Antes de subir mudanças maiores, consulte a diretriz de estilo e a pasta <code className="bg-white/5 px-1 rounded">src/components</code>.</p>
          </section>

          <footer className="mt-6 text-sm text-slate-400">© {new Date().getFullYear()} Remote Scheduler • Em desenvolvimento</footer>
        </section>
      </main>
    </div>
  )
}
