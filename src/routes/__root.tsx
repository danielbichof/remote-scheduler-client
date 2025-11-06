import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '../components/Header/Header'

const RootLayout = () => {
  const location = useLocation()
  const showHeader = !['/login', '/register', '/forgot-password'].includes(location.pathname)

  return (
    <>
      {showHeader && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({ component: RootLayout })
