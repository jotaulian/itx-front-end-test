import { Outlet } from 'react-router-dom'
import Header from '@/shared/components/Header.jsx'

// Layout route: shared Header on every view, routed page content via Outlet.
// Header reads the cart count from CartContext itself (see main.jsx), so no
// prop is threaded through here.
function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
