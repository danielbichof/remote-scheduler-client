import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Informe seu email')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Integrar com API real de recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 1200))
      setSuccess('Enviamos um link de recuperação para o seu email (simulado).')
    } catch (err) {
      setError('Não foi possível enviar o email. Tente novamente.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/30">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="mt-6 bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Recuperar senha
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Lembre-se de verificar a caixa de spam.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                Lembrou da senha?{' '}
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

        <div className="text-center">
          <p className="text-xs text-slate-500">
            📬 Recuperação em desenvolvimento • Qualquer email funciona para testes
          </p>
        </div>
      </div>
    </div>
  )
}


