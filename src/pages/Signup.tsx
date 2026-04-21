import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, BarChart3, GraduationCap, Briefcase, Key } from 'lucide-react';
import { registerUsuario } from '../api/fetch';

export const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'participante'; // 'jurado' or 'participante'
  const navigate = useNavigate();

  // Common State
  const [ci, setCi] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Jurado specific
  const [institucion, setInstitucion] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [clave, setClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Participante specific
  const [tipoParticipante, setTipoParticipante] = useState<'Estudiante' | 'Docente'>('Estudiante');
  const [carrera, setCarrera] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isJurado && !aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }
    
    setLoading(true);
    setError('');

    const payload = {
      role: isJurado ? 'jurado' : tipoParticipante.toLowerCase(),
      ci,
      nombre,
      apellido,
      telefono,
      correo: email,
      password,
      carrera: !isJurado ? carrera : undefined,
      institucion: isJurado ? institucion : undefined,
      especialidad: isJurado ? especialidad : undefined,
      clave: isJurado ? clave : undefined
    };

    try {
      await registerUsuario(payload);
      // Registro exitoso, navegar a login
      navigate(`/login?role=${payload.role === 'jurado' ? 'jurado' : 'participante'}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const isJurado = role === 'jurado';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left section - Info */}
      <div className="md:w-[45%] bg-[#eef0ef] flex flex-col justify-center px-12 py-16 lg:px-20 relative">
        <div className="absolute top-8 left-8">
          <Link to="/select-role?action=register" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#005c4b]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Selección
          </Link>
        </div>

        <div className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#005c4b] shadow-sm mb-8 self-start border border-gray-200">
           <ShieldCheck className="w-4 h-4 mr-2" />
           {isJurado ? 'PORTAL ACADÉMICO OFICIAL' : 'REGISTRO DE FERIA'}
        </div>

        <h1 className="font-heading text-5xl lg:text-6xl font-extrabold text-[#004a3c] leading-[1.1] tracking-tight mb-6">
          {isJurado ? (
            <>Registro de<br/>Jurado</>
          ) : (
            <>Únete a la<br/>Excelencia<br/>Técnica</>
          )}
        </h1>
        
        <p className="font-description text-lg text-gray-600 mb-12 max-w-sm">
          {isJurado 
            ? 'Garantizando la transparencia y calidad técnica institucional.' 
            : 'Forma parte del encuentro tecnológico más importante de INCOS El Alto. Registra tus datos para participar como expositor o guía académico.'}
        </p>

        <div className="space-y-8">
          {isJurado ? (
            <>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-[#004a3c] rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#004a3c]">Evaluación Objetiva</h3>
                  <p className="font-description text-sm text-gray-600 mt-1 leading-relaxed">Acceso a rúbricas estandarizadas para la evaluación de proyectos tecnológicos.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-[#004a3c] rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#004a3c]">Seguimiento en Tiempo Real</h3>
                  <p className="font-description text-sm text-gray-600 mt-1 leading-relaxed">Carga digital de puntajes y retroalimentación inmediata para los estudiantes.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`flex gap-4 items-start transition-opacity duration-300 ${tipoParticipante !== 'Estudiante' ? 'opacity-50' : 'opacity-100'}`}>
                <div className={`p-2 rounded-lg transition-colors duration-300 ${tipoParticipante === 'Estudiante' ? 'bg-[#004a3c]' : 'bg-[#d1e5e0]'}`}>
                  <GraduationCap className={`w-6 h-6 ${tipoParticipante === 'Estudiante' ? 'text-white' : 'text-[#004a3c]'}`} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#004a3c]">Perfil Estudiante</h3>
                  <p className="font-description text-sm text-gray-600 mt-1 leading-relaxed">Postula tus proyectos y demuestra tus competencias técnicas en el área de especialización.</p>
                </div>
              </div>
              <div className={`flex gap-4 items-start transition-opacity duration-300 ${tipoParticipante !== 'Docente' ? 'opacity-50' : 'opacity-100'}`}>
                <div className={`p-2 rounded-lg transition-colors duration-300 ${tipoParticipante === 'Docente' ? 'bg-[#004a3c]' : 'bg-[#d1e5e0]'}`}>
                  <Briefcase className={`w-6 h-6 ${tipoParticipante === 'Docente' ? 'text-white' : 'text-[#004a3c]'}`} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#004a3c]">Perfil Docente</h3>
                  <p className="font-description text-sm text-gray-600 mt-1 leading-relaxed">Registra tu participación como mentor y guía de los proyectos innovadores de la institución.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right section - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 items-center bg-gray-50/50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-gray-100 relative">
          
          <h2 className="font-heading text-2xl font-bold text-[#004a3c] mb-1">
            {isJurado ? 'Formulario de Habilitación' : ' '}
          </h2>
          {isJurado && (
            <p className="font-description text-gray-500 mb-8 text-sm italic">
              Complete todos los campos para activar su credencial de evaluador.
            </p>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignup}>
            
            {/* Toggle Participante */}
            {!isJurado && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Tipo de Participante
                </label>
                <div className="flex rounded-md p-1 bg-gray-100">
                  <button
                    type="button"
                    onClick={() => setTipoParticipante('Estudiante')}
                    className={`flex-1 flex justify-center items-center py-2 text-sm font-bold rounded-md transition-colors ${tipoParticipante === 'Estudiante' ? 'bg-white text-[#004a3c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" /> Estudiante
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoParticipante('Docente')}
                    className={`flex-1 flex justify-center items-center py-2 text-sm font-bold rounded-md transition-colors ${tipoParticipante === 'Docente' ? 'bg-white text-[#004a3c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Briefcase className="w-4 h-4 mr-2" /> Docente
                  </button>
                </div>
              </div>
            )}

            {/* Fila 1 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {isJurado ? 'CI / Documento' : 'Cédula de Identidad (CI)'}
                </label>
                <input
                  type="text"
                  required
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                  placeholder={isJurado ? "Número de identidad" : "1234567 LP"}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {isJurado ? 'Institución de Procedencia' : 'Teléfono'}
                </label>
                <input
                  type="text"
                  required
                  value={isJurado ? institucion : telefono}
                  onChange={(e) => isJurado ? setInstitucion(e.target.value) : setTelefono(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                  placeholder={isJurado ? "Ej. INCOS Potosí" : "700 00000"}
                />
              </div>
            </div>

            {/* Fila 2 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nombre(s)
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                  placeholder={isJurado ? "Nombres completos" : "Ej. Juan Carlos"}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Apellido(s)
                </label>
                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                  placeholder={isJurado ? "Apellidos completos" : "Ej. Pérez Quispe"}
                />
              </div>
            </div>

            {/* Especialidad/Carrera y Correo/Telefono */}
            {isJurado ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Especialidad Técnica</label>
                  <select 
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                  >
                    <option value="" disabled>Seleccione una área de peritaje</option>
                    <option value="Sistemas">Sistemas Informáticos</option>
                    <option value="Contaduria">Contaduría General</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                      placeholder="+591 ..."
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Correo Electrónico Inst.</label>
                    <input
                      type="email"
                      className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                      placeholder="@ usuario@incos.edu.bo"
                    />
                  </div>
                </div>

                {/* Clave Admin Jurado */}
                <div className="p-4 bg-[rgb(254,242,242)] border-l-4 border-red-500 rounded-r-md mt-4">
                  <div className="flex items-center mb-2">
                    <Key className="w-4 h-4 text-red-600 mr-2" />
                    <label className="block text-xs font-bold text-red-700 uppercase tracking-wider">Clave de Acceso Especial</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      className="block w-full px-3 py-2 border border-red-200 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-sm bg-white pr-10"
                      placeholder="Clave proporcionada por rectorado"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-red-500 uppercase mt-2 font-bold tracking-wider">Campo obligatorio para validación de rol administrativo</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                    placeholder="usuario@incos.edu.bo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm pr-10"
                      placeholder="••••••••••••"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5 text-gray-400 hover:text-[#005c4b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 hover:text-[#005c4b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Carrera</label>
                  <select 
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-gray-100 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005c4b] sm:text-sm"
                  >
                    <option value="" disabled>Seleccione una carrera</option>
                    <option value="Sistemas">Sistemas Informáticos</option>
                    <option value="Contaduria">Contaduría General</option>
                    <option value="Mercadotecnia">Mercadotecnia</option>
                  </select>
                </div>
                
                {/* Terminos */}
                <div className="flex items-start mt-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#004a3c] focus:ring-[#004a3c]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-description text-gray-600">
                      Acepto términos y condiciones de la feria.
                    </label>
                  </div>
                  
                  <div className="ml-auto">
                    <Button type="submit" variant="primary" className="py-2.5 px-6 font-bold uppercase rounded-md text-sm bg-[#004a3c] hover:bg-[#003d32] whitespace-nowrap" disabled={loading}>
                      {loading ? 'Registrando...' : 'Finalizar Registro'}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {isJurado && (
              <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full py-4 text-sm tracking-wide font-bold rounded-lg bg-[#004a3c] hover:bg-[#003d32]" disabled={loading}>
                  {loading ? 'Procesando...' : 'Finalizar Registro de Evaluador >'}
                </Button>
                <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed">
                  Al registrarse, acepta los términos de confidencialidad académica institucionales de INCOS.
                </p>
              </div>
            )}
            
          </form>

        </div>
      </div>
    </div>
  );
};
