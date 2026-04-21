import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { CareerCard } from '../components/CareerCard';
import { ProjectCard } from '../components/ProjectCard';
import { MonitorPlay, Landmark, Megaphone, Briefcase, Building2, Globe } from 'lucide-react';
import incosLogo from '../assets/LOGOINCOS.png';
import incosCover from '../assets/incos_cover.jpg';
import { fetchProjects, fetchCareers } from '../api/fetch';

const IconMap: Record<string, React.ReactNode> = {
  MonitorPlay: <MonitorPlay className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
  Megaphone: <Megaphone className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />
};

export const Home: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const projs = await fetchProjects();
      const cars = await fetchCareers();
      setProjects(projs);
      setCareers(cars);
    };
    loadData();
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0">
           {/* Incos Cover Background */}
           <div 
             className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40 filter grayscale mix-blend-multiply"
             style={{ backgroundImage: `url(${incosCover})` }}
           ></div>
           
           {/* Fade overlay horizontal (left-to-right) */}
           <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
           
           {/* Fade overlay vertical (bottom-to-top) para desvanecer abajo */}
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-[#e6f2ef] px-3 py-1 text-sm font-semibold text-[#064136] shadow-sm mb-6">
              <span className="flex w-2 h-2 rounded-full bg-[#045042] mr-2"></span>
              ABRIL - 2026
            </div>
            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold text-[#064e3b] tracking-tight leading-tight mb-6">
              Feria de <br/>
              <span className="font-heading text-[#059669]">Innovación</span> <br/>
              Tecnológica
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Impulsando el talento técnico y comercial de la ciudad de El Alto. Descubre las soluciones disruptivas creadas por nuestra comunidad académica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <a href="#proyectos">
                 <Button variant="primary">Explorar Proyectos</Button>
               </a>
               <Link to="/resultados">
                 <Button variant="secondary">Ver Resultados</Button>
               </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-16 lg:mt-0 flex justify-center lg:justify-end relative">
             {/* Logo card floating */}
             <div className="relative bg-white p-8 rounded-3xl shadow-2xl z-10 transform lg:-rotate-1 border border-white">
                <div className="absolute -top-6 -left-6 bg-[#005c4b] rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                   <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                   </svg>
                </div>
                <div className="w-64 h-64 flex flex-col items-center justify-center p-4">
                   <img src={incosLogo} alt="Logo INCOS" className="w-full h-full object-contain" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="font-heading text-3xl font-bold mb-12 inline-flex flex-col">
            Carreras Participantes
            <span className="w-12 h-1 bg-[#059669] mt-3"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career, idx) => (
              <CareerCard 
                key={career.id_carrera || idx}
                icon={career.icon && IconMap[career.icon] ? IconMap[career.icon] : <MonitorPlay className="w-6 h-6" />}
                title={career.nombre_carrera || career.title}
                description={career.descripcion || career.description || "Carrera técnica del INCOS El Alto."}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">Catálogo de Proyectos</h2>
              <p className="text-gray-500">Explora las investigaciones y desarrollos de esta gestión.</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            {(showAllProjects ? projects : projects.slice(0, 3)).map((project, idx) => (
              <ProjectCard 
                key={project.id_proyecto || project.id || idx}
                projectId={project.id_proyecto?.toString() || project.id}
                imageSrc={project.imageSrc || "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                category={project.area_tematica || project.category || "General"}
                title={project.titulo || project.title}
                description={project.descripcion || project.description || ""}
              />
            ))}
          </div>

          {/* Ver todos los proyectos */}
          {projects.length > 3 && !showAllProjects && (
            <div className="mt-10 text-center">
              <button 
                onClick={() => setShowAllProjects(true)}
                className="inline-flex items-center gap-2 bg-[#005c4b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#004a3c] transition-colors shadow-sm"
              >
                Ver todos los proyectos
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
          {showAllProjects && (
            <div className="mt-10 text-center">
              <button 
                onClick={() => setShowAllProjects(false)}
                className="inline-flex items-center gap-2 bg-white text-[#005c4b] border border-[#005c4b] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm"
              >
                Ver menos
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
