import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { RoleSelection } from './pages/RoleSelection'
import { Signup } from './pages/Signup'
import { Resultados } from './pages/Resultados'
import { AdminLayout } from './components/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminDocentes } from './pages/admin/AdminDocentes'
import { AdminEstudiantes } from './pages/admin/AdminEstudiantes'
import { AdminJurados } from './pages/admin/AdminJurados'
import { AdminConfiguracion } from './pages/admin/AdminConfiguracion'
import { AdminAsignaciones } from './pages/admin/AdminAsignaciones'
import { AdminResultados } from './pages/admin/AdminResultados'
import { AdminProyectos } from './pages/admin/AdminProyectos'

import { DocenteLayout } from './components/DocenteLayout'
import { DocenteProyectos } from './pages/docente/DocenteProyectos'

import { ProyectoDetalle } from './pages/ProyectoDetalle'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isAdmin = location.pathname.startsWith('/admin')
  const isDocente = location.pathname.startsWith('/docente')
  const isLogin = location.pathname === '/login'
  const isSelectRole = location.pathname === '/select-role'
  const isSignup = location.pathname === '/signup'
  const isResultados = location.pathname === '/resultados'

  if (isDashboard || isLogin || isSelectRole || isSignup || isAdmin || isDocente || isResultados) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos/:id" element={<ProyectoDetalle />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="proyectos" element={<AdminProyectos />} />
            <Route path="docentes" element={<AdminDocentes />} />
            <Route path="estudiantes" element={<AdminEstudiantes />} />
            <Route path="jurados" element={<AdminJurados />} />
            <Route path="configuracion" element={<AdminConfiguracion />} />
            <Route path="asignaciones" element={<AdminAsignaciones />} />
            <Route path="resultados" element={<AdminResultados />} />
          </Route>

          <Route path="/docente" element={<DocenteLayout />}>
            <Route path="proyectos" element={<DocenteProyectos />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
