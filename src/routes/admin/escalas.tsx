import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'

type ScheduleRow = { Id: number; Title: string; Description?: string | null }
type DayConfig = { WeekdayId?: number; DayName?: string; IsRemote: boolean }

export const Route = createFileRoute('/admin/escalas')({
  component: EscalasPage,
})

function EscalasPage() {
  const [itens, setItens] = useState<ScheduleRow[]>([])
  const [filtro, setFiltro] = useState('')
  const [form, setForm] = useState<{ Title: string; Description?: string | null; Days: DayConfig[] }>({ Title: '', Description: '', Days: [] })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'dados' | 'dias'>('dados')

  // Dias da semana padrão (usando nomes em PT-BR). Enviaremos DayName para o backend.
  const weekOptions = useMemo(() => ([
    { id: 1, name: 'Segunda' },
    { id: 2, name: 'Terça' },
    { id: 3, name: 'Quarta' },
    { id: 4, name: 'Quinta' },
    { id: 5, name: 'Sexta' },
    { id: 6, name: 'Sábado' },
    { id: 7, name: 'Domingo' },
  ]), [])

  useEffect(() => {
    // Inicializa Days ao abrir o formulário
    setForm(f => ({
      ...f,
      Days: weekOptions.map(w => ({ DayName: w.name, WeekdayId: w.id, IsRemote: false })),
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.admin.schedules.list()
      console.log('Dados recebidos da API (raw):', data)
      // Mapear explicitamente para garantir que os campos estão corretos
      const mapped = Array.isArray(data) ? data.map((item: any) => ({
        Id: item.Id || item.id,
        Title: item.Title || item.title || '',
        Description: item.Description || item.description || null
      })) : []
      console.log('Dados mapeados:', mapped)
      setItens(mapped as ScheduleRow[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar escalas')
      console.error('Erro ao carregar escalas:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const list = itens.filter(i => {
    const title = (i.Title || '').toLowerCase()
    const desc = (i.Description || '').toLowerCase()
    const search = filtro.toLowerCase()
    return title.includes(search) || desc.includes(search)
  })

  const clearForm = () => setForm({ Title: '', Description: '', Days: weekOptions.map(w => ({ DayName: w.name, WeekdayId: w.id, IsRemote: false })) })

  const salvar = async () => {
    if (!form.Title || !form.Title.trim()) {
      setError('Título é obrigatório')
      return
    }
    try {
      setLoading(true)
      setError('')
      const payload = { 
        Title: form.Title.trim(), 
        Description: form.Description?.trim() || null,
        Days: (form.Days || []).map(d => ({ DayName: d.DayName, WeekdayId: d.WeekdayId, IsRemote: !!d.IsRemote }))
      }
      if (editingId) {
        await api.admin.schedules.update(editingId, payload)
        setEditingId(null)
      } else {
        await api.admin.schedules.create(payload)
      }
      clearForm()
      await load()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar escala'
      setError(msg)
      console.error('Erro ao salvar escala:', e)
    } finally {
      setLoading(false)
    }
  }

  const editar = (id: number) => {
    const e = itens.find(i => i.Id === id)
    if (!e) return
    setEditingId(id)
    setForm({ Title: e.Title, Description: e.Description || '', Days: weekOptions.map(w => ({ DayName: w.name, WeekdayId: w.id, IsRemote: false })) })
  }

  const remover = async (id: number) => {
    if (!confirm('Deseja remover esta escala?')) return
    try {
      setLoading(true)
      await api.admin.schedules.remove(id)
      if (editingId === id) { setEditingId(null); clearForm() }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao remover escala')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased py-10 px-6">
      <main className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Escalas</h1>
            <p className="mt-1 text-sm text-slate-300">Gerencie modelos de escalas por grupo.</p>
          </div>
          <div>
            <input value={filtro} onChange={e=>setFiltro(e.target.value)} placeholder="Filtrar por nome" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[360px,1fr]">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="m-0 text-base font-semibold">{editingId ? 'Editar escala' : 'Nova escala'}</h2>
            <div className="mt-4">
              <div className="flex gap-1 rounded-md bg-white/5 p-1 text-sm">
                <button onClick={()=>setActiveTab('dados')} className={`flex-1 rounded px-3 py-2 ${activeTab==='dados' ? 'bg-indigo-500 text-white' : 'text-slate-300'}`}>Dados</button>
                <button onClick={()=>setActiveTab('dias')} className={`flex-1 rounded px-3 py-2 ${activeTab==='dias' ? 'bg-indigo-500 text-white' : 'text-slate-300'}`}>Dias da semana</button>
              </div>

              {activeTab === 'dados' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300">Título</label>
                    <input value={form.Title} onChange={e=>setForm(f=>({...f, Title:e.target.value}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" placeholder="Ex: Semana A" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300">Descrição</label>
                    <input value={form.Description || ''} onChange={e=>setForm(f=>({...f, Description:e.target.value}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" placeholder="Descrição opcional" />
                  </div>
                </div>
              )}

              {activeTab === 'dias' && (
                <div className="mt-4 space-y-3">
                  <div className="text-xs text-slate-300">Defina o tipo de trabalho para cada dia.</div>
                  <div className="grid grid-cols-1 gap-2">
                    {form.Days.map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2">
                        <div className="text-sm">{d.DayName}</div>
                        <select
                          value={d.IsRemote ? 'remoto' : 'presencial'}
                          onChange={(e)=>{
                            const val = e.target.value === 'remoto'
                            setForm(f=>{
                              const next = [...f.Days]
                              next[idx] = { ...next[idx], IsRemote: val }
                              return { ...f, Days: next }
                            })
                          }}
                          className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs"
                        >
                          <option value="presencial">Presencial</option>
                          <option value="remoto">Remoto</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2 pt-2">
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
                  <th className="py-2">Título</th>
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {list.map((e)=> (
                  <tr key={e.Id} className="border-t border-white/10">
                    <td className="py-2">{e.Title || '-'}</td>
                    <td className="py-2">{e.Description || '-'}</td>
                    <td className="py-2 text-right space-x-2">
                      <button onClick={()=>editar(e.Id)} className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs">Editar</button>
                      <button onClick={()=>remover(e.Id)} className="rounded-md bg-red-500/80 px-3 py-1.5 text-xs text-white">Remover</button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr key="empty"><td colSpan={3} className="py-6 text-center text-slate-400">Nenhuma escala encontrada</td></tr>
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

