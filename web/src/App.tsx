import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { LayoutDashboard, Megaphone, Sparkles, Workflow, FileBarChart, Plug, CreditCard } from 'lucide-react'
import { cx } from './lib/format'

/**
 * React app shell. The full, data-rich screens are designed in the
 * dependency-free prototype at `web/prototype/index.html` and are being
 * ported into the `src/pages/*` components below. Each page currently
 * renders a placeholder so the scaffold typechecks and builds cleanly.
 */

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/creative', label: 'Creative Studio', icon: Sparkles },
  { to: '/automation', label: 'Automation', icon: Workflow },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/connections', label: 'Connections', icon: Plug },
  { to: '/billing', label: 'Billing & Plans', icon: CreditCard },
]

function Placeholder({ title }: { title: string }) {
  return (
    <div className="card pad">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-ink-muted text-sm mt-1">
        Designed in <code>web/prototype/index.html</code> — porting into React components.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <div className="grid grid-cols-[248px_1fr] min-h-screen">
      <aside className="bg-[#0b1023] text-slate-300 p-4 flex flex-col gap-1 sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-2 py-3 mb-2">
          <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-brand-500 to-purple-500 grid place-items-center text-white font-extrabold text-lg">A</div>
          <div>
            <div className="text-white font-bold leading-none">AdPilot</div>
            <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Ads Autopilot</div>
          </div>
        </div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-sm font-semibold',
                isActive ? 'bg-[#1c2442] text-white' : 'text-slate-400 hover:bg-[#161c33] hover:text-white',
              )
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </aside>

      <main className="p-6 max-w-[1280px] w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {NAV.map(({ to, label }) => (
            <Route key={to} path={to} element={<Placeholder title={label} />} />
          ))}
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Routes>
      </main>
    </div>
  )
}
