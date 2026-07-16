import { Outlet } from 'react-router-dom'
import Header from '@/shared/components/Header.jsx'

// Layout route: shared Header on every view, routed page content via Outlet.
function App() {
  return (
    <>
      {/* Real cart count wiring lands in PR5 (CartContext); 0 is a safe
          placeholder that keeps Header's contract stable until then. */}
      <Header cartCount={0} />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
