import React from 'react';
import { Button } from '../components/Button';
import { CareerCard } from '../components/CareerCard';
import { ProjectCard } from '../components/ProjectCard';
import { MonitorPlay, Landmark, Megaphone, Briefcase, Building2, Globe } from 'lucide-react';
import incosLogo from '../assets/LOGOINCOS.png';
import incosCover from '../assets/incos_cover.jpg';

export const Home: React.FC = () => {
  const careers = [
    {
      icon: <MonitorPlay className="w-6 h-6" />,
      title: "Sistemas Informáticos",
      description: "Desarrollo de software, IA y soluciones tecnológicas avanzadas."
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Contaduría General",
      description: "Gestión financiera estratégica y auditoría corporativa."
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: "Mercadotecnia",
      description: "Investigación de mercados y estrategias de posicionamiento digital."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Secretariado Ejecutivo",
      description: "Alta gestión administrativa y comunicación institucional."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Administración de Empresas",
      description: "Liderazgo organizacional y optimización de recursos técnicos."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Lingüística",
      description: "Comunicación bilingüe técnica aplicada al comercio exterior."
    }
  ];

  const projects = [
    {
      id: "1",
      imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Innovación Digital",
      title: "Sistema IA para Gestión de Almacenes Pyme",
      description: "Implementación de modelos predictivos para la optimización de inventarios en empresas comerciales de El Alto."
    },
    {
      id: "2",
      imageSrc: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Finanzas Éticas",
      title: "Auditoría Digital en el Marco de la Ley 1448",
      description: "Análisis de la transición digital para la transparencia tributaria en cooperativas locales."
    },
    {
      id: "3",
      imageSrc: "https://images.unsplash.com/photo-1533580556209-77f0a71676ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Trade Marketing",
      title: "Omnicanalidad en el Comercio Minorista Alteño",
      description: "Estrategias de integración entre puntos de venta físicos y plataformas digitales."
    }
  ];

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
              <span className="text-[#059669]">Innovación</span> <br/>
              Tecnológica
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Impulsando el talento técnico y comercial de la ciudad de El Alto. Descubre las soluciones disruptivas creadas por nuestra comunidad académica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <Button variant="primary">Explorar Proyectos</Button>
               <Button variant="secondary">Ver Resultados</Button>
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
          <h2 className="font-heading text-3xl font-bold text-[#005c4b] mb-12 inline-flex flex-col">
            Carreras Participantes
            <span className="w-12 h-1 bg-[#005c4b] mt-3"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career, idx) => (
              <CareerCard 
                key={idx}
                icon={career.icon}
                title={career.title}
                description={career.description}
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
              <h2 className="text-3xl font-bold text-[#005c4b] mb-2">Catálogo de Proyectos</h2>
              <p className="text-gray-500">Explora las investigaciones y desarrollos de esta gestión.</p>
            </div>
            {/* Filter button mockup */}
            <button className="hidden sm:flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-[#005c4b]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                projectId={project.id}
                imageSrc={project.imageSrc}
                category={project.category}
                title={project.title}
                description={project.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
