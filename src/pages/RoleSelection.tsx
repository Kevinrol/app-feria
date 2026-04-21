import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, ArrowLeft, Gavel } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'login'; // 'login' or 'register'
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    if (action === 'login') {
      navigate(`/login?role=${role}`);
    } else {
      navigate(`/signup?role=${role}`);
    }
  };

  const isLogin = action === 'login';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-8 left-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#005c4b]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center mb-10">
        <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-[#005c4b] sm:text-4xl">
          {isLogin ? '¿Cómo deseas ingresar?' : 'Elige tu tipo de cuenta'}
        </h2>
        <p className="mt-3 text-center text-base font-description text-gray-600 sm:text-lg">
          Selecciona tu rol en la Feria de Innovación Tecnológica
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isLogin ? 'lg:grid-cols-3' : 'max-w-3xl mx-auto'} justify-center px-4`}>
          
          {/* Participante */}
          <div 
            onClick={() => handleRoleSelect('participante')}
            className="bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-gray-100 cursor-pointer transition-all hover:-translate-y-2 hover:border-[#005c4b] group flex flex-col"
          >
            <div className="px-6 py-10 flex flex-col items-center flex-1">
              <div className="w-20 h-20 bg-[#e6f2ef] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-10 h-10 text-[#005c4b]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Participante</h3>
              <p className="text-sm font-description text-gray-500 text-center">
                Estudiantes que exponen sus proyectos y compiten con soluciones innovadoras.
              </p>
            </div>
          </div>

          {/* Jurado */}
          <div 
            onClick={() => handleRoleSelect('jurado')}
            className="bg-white overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-gray-100 cursor-pointer transition-all hover:-translate-y-2 hover:border-[#005c4b] group flex flex-col"
          >
            <div className="px-6 py-10 flex flex-col items-center flex-1">
              <div className="w-20 h-20 bg-[#e6f2ef] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gavel className="w-10 h-10 text-[#005c4b]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">Jurado Calificador</h3>
              <p className="text-sm font-description text-gray-500 text-center">
                Especialistas encargados de evaluar y asignar puntajes a los proyectos.
              </p>
            </div>
          </div>

          {/* Admin (Solo visible en Iniciar Sesión) */}
          {isLogin && (
            <div 
              onClick={() => handleRoleSelect('admin')}
              className="bg-slate-800 overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border border-slate-700 cursor-pointer transition-all hover:-translate-y-2 hover:border-slate-500 group flex flex-col"
            >
              <div className="px-6 py-10 flex flex-col items-center flex-1">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">Administrador</h3>
                <p className="text-sm font-description text-slate-300 text-center">
                  Gestión completa del sistema, control de usuarios y resultados de la feria.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
