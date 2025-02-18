import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Spinner } from 'react-bootstrap';
import { NavbarCobrador } from './Componente/NavbarCobrador';


export const Cobrador = () => {

  const [selectedOption, setSelectedOption] = useState(''); // Estado para la opción seleccionada
  const [loading, setLoading] = useState(false); // Estado para manejar el cargando
  const [content, setContent] = useState(null); // Contenido que se renderizará después del loading

  const navigate = useNavigate();

  // Función para manejar el cambio de contenido con loading
  const handleSelection = (option) => {
    setLoading(true); // Activamos el estado de "cargando"
    setContent(null); // Limpiamos el contenido actual
    setTimeout(() => {
      setSelectedOption(option);
      setLoading(false); // Desactivamos "cargando" después de un breve tiempo simulado
    }, 1000); // Tiempo simulado para la carga (1 segundo)
  };

  useEffect(() => {
    // Animación con GSAP para la entrada del contenido
    if (!loading && selectedOption) {
      gsap.fromTo(
        ".content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [loading, selectedOption]);

  // Renderizar contenido según la opción seleccionada
  const renderContent = () => {
    switch (selectedOption) {
      case 'Realizar cobro':
        return <div className="content">Contenido para realizar un cobro</div>;
      case 'Reportes':
        return <div className="content">Reportes de Rendicion</div>;
        case 'Notificaciones':
            return <div className="content">Notificaciones</div>;  
      default:
        return <div className="content">Selecciona una opción del menú</div>;
    }
  };

  return (
    <div>
    {/* Navbar pasa la función que actualiza la opción seleccionada */}
    <NavbarCobrador onSelect={handleSelection} />

    {/* Mostrar animación de "cargando" o el contenido */}
    {loading ? (
      <div className="loading">
        <h2 className='d-flex justify-content-center align-items-center min-vh-100'>
          <Spinner animation="grow" variant="dark" />
          </h2>
        {/* Animación con GSAP */}
        <div className="spinner"></div>
      </div>
    ) : (
      renderContent()
    )}

    
  </div>
  )
}
