import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '../lib/api'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpa erro ao usuário começar a digitar
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      alert('Cadastro realizado com sucesso!')
      navigate({ to: '/login' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar cadastro. Tente novamente.'
      setError(message)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e título */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/30">
            <span className="text-3xl">⌛</span>
          </div>
          <h2 className="mt-6 bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Criar uma nova conta
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Ou{' '}
            <button
              onClick={() => navigate({ to: '/login' })}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              fazer login
            </button>
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                placeholder="••••••••"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-slate-400">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-300">
                Eu aceito os{' '}
                <button
                  type="button"
                  onClick={() => alert('Termos de uso em desenvolvimento')}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  termos de uso
                </button>
                {' '}e{' '}
                <button
                  type="button"
                  onClick={() => alert('Política de privacidade em desenvolvimento')}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  política de privacidade
                </button>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate({ to: '/login' })}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Informações de desenvolvimento */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            🔐 Autenticação em desenvolvimento • Qualquer informação funciona para testes
          </p>
        </div>
      </div>
    </div>
  )
}

