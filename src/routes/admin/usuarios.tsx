import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { api, request } from '../../lib/api'

type UsuarioRow = {
  Id: number
  Username: string
  Email: string
  GroupId: number
  RoleId: number
}

type GroupRow = { Id: number; Name: string }
type RoleRow = { Id: number; Name: string; DisplayName?: string | null }

export const Route = createFileRoute('/admin/usuarios')({
  component: UsuariosPage,
})

function UsuariosPage() {
  const [itens, setItens] = useState<UsuarioRow[]>([])
  const [filtro, setFiltro] = useState('')
  const [form, setForm] = useState<{ Username: string; Email: string; GroupId: number | '' ; RoleId: number | '' ; Password?: string }>({ Username: '', Email: '', GroupId: '', RoleId: '', Password: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [roles, setRoles] = useState<RoleRow[]>([])

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const [usersData, groupsData, rolesData] = await Promise.all([
        api.admin.users.list(),
        api.admin.groups.list(),
        api.admin.roles.list(),
      ])
      // Mapear explicitamente para garantir que os campos estão corretos
      const mappedUsers = Array.isArray(usersData) ? usersData.map((item: any) => ({
        Id: item.Id || item.id,
        Username: item.Username || item.username || '',
        Email: item.Email || item.email || '',
        GroupId: item.GroupId ?? item.groupId ?? 0,
        RoleId: item.RoleId ?? item.roleId ?? 0,
        ManagerId: item.ManagerId ?? item.managerId ?? null,
      })) : []
      const mappedGroups = Array.isArray(groupsData) ? groupsData.map((item: any) => ({
        Id: item.Id || item.id,
        Name: item.Name || item.name || '',
      })) : []
      const mappedRoles = Array.isArray(rolesData) ? rolesData.map((item: any) => ({
        Id: item.Id || item.id,
        Name: item.Name || item.name || '',
        DisplayName: item.DisplayName || item.displayName || null,
      })) : []
      setItens(mappedUsers as UsuarioRow[])
      setGroups(mappedGroups as GroupRow[])
      setRoles(mappedRoles as RoleRow[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar usuários')
      console.error('Erro ao carregar usuários:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const list = itens.filter(i => {
    const username = (i.Username || '').toLowerCase()
    const email = (i.Email || '').toLowerCase()
    const search = filtro.toLowerCase()
    return username.includes(search) || email.includes(search)
  })

  const clearForm = () => setForm({ Username: '', Email: '', GroupId: '', RoleId: '', Password: '' })

  const salvar = async () => {
    if (!form.Username || !form.Email || form.GroupId === '' || form.RoleId === '') return
    try {
      setLoading(true)
      if (editingId) {
        await api.admin.users.update(editingId, {
          Username: form.Username,
          Email: form.Email,
          GroupId: Number(form.GroupId),
          RoleId: Number(form.RoleId),
        })
        setEditingId(null)
      } else {
        await request(`/api/admin/users`, { method: 'POST', body: {
          Username: form.Username,
          Email: form.Email,
          Password: form.Password,
          GroupId: Number(form.GroupId),
          RoleId: Number(form.RoleId),
        } })
      }
      clearForm()
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar usuário')
    } finally {
      setLoading(false)
    }
  }

  const editar = (id: number) => {
    const e = itens.find(i => i.Id === id)
    if (!e) return
    setEditingId(id)
    setForm({ Username: e.Username, Email: e.Email, GroupId: e.GroupId, RoleId: e.RoleId })
  }

  const remover = async (id: number) => {
    if (!confirm('Deseja remover este usuário?')) return
    try {
      setLoading(true)
      await api.admin.users.remove(id)
      if (editingId === id) { setEditingId(null); clearForm() }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao remover usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased py-10 px-6">
      <main className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Usuários</h1>
            <p className="mt-1 text-sm text-slate-300">Gerencie usuários e suas associações.</p>
          </div>
          <div>
            <input value={filtro} onChange={e=>setFiltro(e.target.value)} placeholder="Buscar por nome ou email" className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[360px,1fr]">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="m-0 text-base font-semibold">{editingId ? 'Editar usuário' : 'Novo usuário'}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-300">Nome</label>
                <input value={form.Username} onChange={e=>setForm(f=>({...f, Username:e.target.value}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
              </div>
              <div>
                <label className="block text-xs text-slate-300">Email</label>
                <input value={form.Email} onChange={e=>setForm(f=>({...f, Email:e.target.value}))} type="email" className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-xs text-slate-300">Senha (novo usuário)</label>
                  <input value={form.Password || ''} onChange={e=>setForm(f=>({...f, Password:e.target.value}))} type="password" className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black" />
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-300">Grupo</label>
                <select value={form.GroupId} onChange={e=>setForm(f=>({...f, GroupId: Number(e.target.value) as any}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">
                  <option value="">Selecione...</option>
                  {groups.map(g => (
                    <option key={g.Id} value={g.Id}>{g.Name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-300">Perfil</label>
                <select value={form.RoleId} onChange={e=>setForm(f=>({...f, RoleId: Number(e.target.value) as any}))} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black">
                  <option value="">Selecione...</option>
                  {roles.map(r => (
                    <option key={r.Id} value={r.Id}>{r.DisplayName || r.Name}</option>
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
                  <th className="py-2">Email</th>
                  <th className="py-2">Grupo</th>
                  <th className="py-2">Perfil</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u)=> (
                  <tr key={u.Id} className="border-t border-white/10">
                    <td className="py-2">{u.Username || '-'}</td>
                    <td className="py-2">{u.Email || '-'}</td>
                    <td className="py-2">{groups.find(g => g.Id === u.GroupId)?.Name || u.GroupId || '-'}</td>
                    <td className="py-2">{roles.find(r => r.Id === u.RoleId)?.DisplayName || roles.find(r => r.Id === u.RoleId)?.Name || u.RoleId || '-'}</td>
                    <td className="py-2 text-right space-x-2">
                      <button onClick={()=>editar(u.Id)} className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs">Editar</button>
                      <button onClick={()=>remover(u.Id)} className="rounded-md bg-red-500/80 px-3 py-1.5 text-xs text-white">Remover</button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr key="empty"><td colSpan={5} className="py-6 text-center text-slate-400">Nenhum usuário encontrado</td></tr>
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

