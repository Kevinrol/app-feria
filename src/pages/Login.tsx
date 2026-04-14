import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, BarChart3, Info } from 'lucide-react';
import incosLogo from '../assets/LOGOINCOS.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'participante';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with", email, password, role);
    navigate('/dashboard');
  };

  // Por ahora, usamos el diseño de Admin para todos, pero personalizado.
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left section - Info */}
      <div className="md:w-5/12 bg-gray-50 flex flex-col justify-center px-12 py-16 lg:px-20 relative">
        <div className="absolute top-8 left-8">
          <Link to="/select-role?action=login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#005c4b]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-8 mt-8">
          <img src={incosLogo} alt="Incos" className="w-8 h-8 object-contain" />
          <span className="font-heading font-bold text-[#005c4b] tracking-wider text-sm">INCOS FERIA TÉCNICA</span>
        </div>

        <h1 className="font-heading text-5xl lg:text-7xl font-extrabold text-[#005c4b] leading-[1.1] tracking-tight mb-6 capitalize">
          {role === 'admin' ? (
            <>Administrador</>
          ) : (
            <>{role}</>
          )}
        </h1>
        
        <p className="font-description text-xl text-[#005c4b] mb-16 max-w-md">
          {role === 'admin' 
            ? 'Gestión y supervisión técnica del sistema INCOS.' 
            : 'Acceso al portal de evaluación y gestión de proyectos.'}
        </p>

        <div className="space-y-8">
          {role === 'admin' ? (
            <>
              <div className="flex gap-4 items-start">
                <ShieldCheck className="w-6 h-6 text-[#005c4b] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-gray-900">Control Total</h3>
                  <p className="font-description text-sm text-gray-600 mt-1 leading-relaxed">Acceso privilegiado a la gestión de proyectos y usuarios.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <BarChart3 className="w-6 h-6 text-[#005c4b] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-gray-900">Reportes en Tiempo Real</h3>
                  <p className="font-description text-sm text-gray-600 mt-1 leading-relaxed">Supervisión integral de cronogramas y entregas académicas.</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Right section - Form */}
      <div className="flex-1 flex flex-col justify-center px-12 py-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">Credenciales de Acceso</h2>
          <p className="font-description text-gray-600 mb-10 text-sm">
            Ingrese sus datos institucionales para activar su perfil de {role === 'admin' ? 'administración' : 'acceso'}.
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#005c4b] uppercase tracking-wider mb-2">
                Correo Electrónico Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">@</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-transparent bg-gray-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005c4b] focus:bg-white transition-colors sm:text-sm font-description"
                  placeholder="ejemplo@incos.edu.bo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#005c4b] uppercase tracking-wider mb-2">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-transparent bg-gray-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005c4b] focus:bg-white transition-colors sm:text-sm font-description tracking-widest"
                  placeholder="••••••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-gray-400 uppercase">Mínimo 12 caracteres</span>
                <a href="#" className="font-heading text-xs font-bold text-[#005c4b] hover:text-[#004a3c] uppercase">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-4 text-sm tracking-wide font-bold uppercase rounded-lg group">
                Iniciar Sesión Como {role}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 flex gap-3 text-xs text-gray-500 font-description">
            <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" />
            <p className="leading-relaxed">
              Este portal es de uso exclusivo para el personal docente y administrativo debidamente autorizado por la dirección del INCOS. Cada acción realizada dentro del sistema de gestión es auditada.
            </p>
          </div>
          
          <div className="mt-8 flex justify-between text-[10px] text-gray-400 uppercase tracking-wider font-bold">
            <span>© 2024 INCOS FERIA TÉCNICA</span>
            <div className="space-x-4">
              <a href="#" className="hover:text-gray-600">Privacidad</a>
              <a href="#" className="hover:text-gray-600">Soporte</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
