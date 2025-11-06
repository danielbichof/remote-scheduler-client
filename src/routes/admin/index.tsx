import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminHome,
})

function Card({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="block rounded-lg border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black"
    >
      <h3 className="m-0 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-300">{description}</p>
    </Link>
  )
}

function AdminHome() {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased py-10 px-6">
      <main className="mx-auto w-full max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="mt-2 text-sm text-slate-300">Gerencie escalas, usuários e grupos.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Card title="Escalas" description="CRUD de escalas" to="/admin/escalas" />
          <Card title="Usuários" description="CRUD de usuários" to="/admin/usuarios" />
          <Card title="Grupos" description="CRUD de grupos" to="/admin/grupos" />
        </section>
      </main>
    </div>
  )
}

