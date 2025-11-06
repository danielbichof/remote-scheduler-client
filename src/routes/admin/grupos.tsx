import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'

type GroupRow = { Id: number; Name: string; Description?: string | null; PrimaryScheduleId?: number | null; SecondaryScheduleId?: number | null }
type ScheduleRow = { Id: number; Title: string; Description?: string | null }

export const Route = createFileRoute('/admin/grupos')({
  component: GruposPage,
})

function GruposPage() {
  const [itens, setItens] = useState<GroupRow[]>([])
  const [schedules, setSchedules] = useState<ScheduleRow[]>([])
  const [filtro, setFiltro] = useState('')
  const [form, setForm] = useState<{ Name: string; Description?: string | null; PrimaryScheduleId?: number | null; SecondaryScheduleId?: number | null }>({ Name: '', Description: '', PrimaryScheduleId: null, SecondaryScheduleId: null })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const [groupsData, schedulesData] = await Promise.all([
        api.admin.groups.list(),
        api.admin.schedules.list(),
      ])
      // Mapear explicitamente para garantir que os campos estão corretos
      const mappedGroups = Array.isArray(groupsData) ? groupsData.map((item: any) => ({
        Id: item.Id || item.id,
        Name: item.Name || item.name || '',
        Description: item.Description || item.description || null,
        PrimaryScheduleId: item.PrimaryScheduleId ?? item.primaryScheduleId ?? null,
        SecondaryScheduleId: item.SecondaryScheduleId ?? item.secondaryScheduleId ?? null,
      })) : []
      const mappedSchedules = Array.isArray(schedulesData) ? schedulesData.map((item: any) => ({
        Id: item.Id || item.id,
        Title: item.Title || item.title || '',
        Description: item.Description || item.description || null
      })) : []
      setItens(mappedGroups as GroupRow[])
      setSchedules(mappedSchedules as ScheduleRow[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dados')
      console.error('Erro ao carregar dados:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const list = itens.filter(i => {
    const name = (i.Name || '').toLowerCase()
    const search = filtro.toLowerCase()
    return name.includes(search)
  })

  const clearForm = () => setForm({ Name: '', Description: '', PrimaryScheduleId: null, SecondaryScheduleId: null })

  const salvar = async () => {
    if (!form.Name || !form.Name.trim()) {
      setError('Nome é obrigatório')
      return
    }
    try {
      setLoading(true)
      setError('')
      const payload = { 
        Name: form.Name.trim(), 
        Description: form.Description?.trim() || null,
        PrimaryScheduleId: form.PrimaryScheduleId || null,
        SecondaryScheduleId: form.SecondaryScheduleId || null
      }
      console.log('Enviando payload:', payload)
      if (editingId) {
        await api.admin.groups.update(editingId, payload)
        setEditingId(null)
      } else {
        await api.admin.groups.create(payload)
      }
      clearForm()
      await load()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar grupo'
      setError(msg)
      console.error('Erro ao salvar grupo:', e)
    } finally {
      setLoading(false)
    }
  }

  const editar = (id: number) => {
    const e = itens.find(i => i.Id === id)
    if (!e) return
    setEditingId(id)
    setForm({ Name: e.Name, Description: e.Description || '', PrimaryScheduleId: e.PrimaryScheduleId || null, SecondaryScheduleId: e.SecondaryScheduleId || null })
  }

  const remover = async (id: number) => {
    if (!confirm('Deseja remover este grupo?')) return
    try {
      setLoading(true)
      await api.admin.groups.remove(id)
      if (editingId === id) { setEditingId(null); clearForm() }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao remover grupo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased py-10 px-6">
      <main className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Grupos</h1>
            <p className="mt-1 text-sm text-slate-300">Gerencie grupos e capacidades.</p>
          </div>
          <div>
            <input value={filtro} onChange={e=>setFiltro(e.target.value)} placeholder="Filtrar por nome" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[360px,1fr]">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="m-0 text-base font-semibold">{editingId ? 'Editar grupo' : 'Novo grupo'}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-300">Nome</label>
                <input value={form.Name} onChange={e=>setForm(f=>({...f, Name:e.target.value}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
              </div>
              <div>
                <label className="block text-xs text-slate-300">Descrição</label>
                <input value={form.Description || ''} onChange={e=>setForm(f=>({...f, Description:e.target.value}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
              </div>
              <div>
                <label className="block text-xs text-slate-300">Escala Primária</label>
                <select value={form.PrimaryScheduleId || ''} onChange={e=>setForm(f=>({...f, PrimaryScheduleId: e.target.value ? Number(e.target.value) : null}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">
                  <option value="">Nenhuma</option>
                  {schedules.map(s => (
                    <option key={s.Id} value={s.Id}>{s.Title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300">Escala Secundária</label>
                <select value={form.SecondaryScheduleId || ''} onChange={e=>setForm(f=>({...f, SecondaryScheduleId: e.target.value ? Number(e.target.value) : null}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">
                  <option value="">Nenhuma</option>
                  {schedules.map(s => (
                    <option key={s.Id} value={s.Id}>{s.Title}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={salvar} className="rounded-md bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white">{editingId ? 'Salvar' : 'Criar'}</button>
                {editingId && (
                  <button onClick={()=>{setEditingId(null); clearForm()}} className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm">Cancelar</button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="py-2">Nome</th>
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {list.map((g)=> (
                  <tr key={g.Id} className="border-t border-white/10">
                    <td className="py-2">{g.Name}</td>
                    <td className="py-2">{g.Description || '-'}</td>
                    <td className="py-2 text-right space-x-2">
                      <button onClick={()=>editar(g.Id)} className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs">Editar</button>
                      <button onClick={()=>remover(g.Id)} className="rounded-md bg-red-500/80 px-3 py-1.5 text-xs text-white">Remover</button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr key="empty"><td colSpan={3} className="py-6 text-center text-slate-400">Nenhum grupo encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {error && <div className="mt-4 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>}
        {loading && <div className="mt-2 text-sm text-slate-300">Carregando...</div>}
      </main>
    </div>
  )
}

