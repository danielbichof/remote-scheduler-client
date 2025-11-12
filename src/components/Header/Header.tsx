import React from 'react'
import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xl drop-shadow-[0_0_6px_rgba(100,108,255,0.7)]" aria-hidden>
          ⌛
        </span>
        <h1 className="m-0 text-base font-semibold tracking-wide">Hybrid Scheduler</h1>
        <nav aria-label="mini-nav" className="ml-[6px] text-xs">
          <Link to="/" className="text-slate-200 hover:underline">
            Início
          </Link>
          <span className="mx-1 text-slate-400">|</span>
          <Link to="/calendar" className="text-slate-200 hover:underline">
            Calendário
          </Link>
          <span className="mx-1 text-slate-400">|</span>
          <Link to="/about" className="text-slate-200 hover:underline">
            Sobre
          </Link>
        </nav>
      </div>

      <div className="flex items-center">
        <Link
          to="/login"
          className="rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          Entrar
        </Link>
      </div>
    </header>
  )
}

export default Header
