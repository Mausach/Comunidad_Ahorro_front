import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Spinner } from 'react-bootstrap';
import AdminNavbar from './Componentes/NavbarAdmin';
import { GestPeriodoRep } from '../Gerencia/Componentes/GestPeriodoRep';
import { Gestion_Empleados } from '../Gerencia/Componentes/GestEmp';
import { GestClientes } from '../Gerencia/Componentes/GestClientes';
import { VentaProductos } from '../Gerencia/Componentes/VentaProductos';
import { GestCobranza } from '../Gerencia/Componentes/GestCobranza';
import GestNotificaciones from '../Gerencia/Componentes/GestNotificaciones';


export const Admin = () => {

  const location = useLocation();
	const usuario = location.state;//recibe el onjeto
  console.log(usuario) //deberia mostrar solo el id

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
    switch (selectedOption) { //las rutas estaran traidas de gerencia , esto debe cambiarse luego
      case 'Gestion de empleados':
        return (
          <div className="content">
            <Gestion_Empleados navigate={navigate}/>
          </div>
        );
      case 'Gestion de clientes':
        return (
          <div className="content">
            <GestClientes navigate={navigate}/>
          </div>
        );
      case 'Realizar venta':
        return <div className="content">
          <VentaProductos navigate={navigate} usuario={usuario}/>
           </div>;
      case 'Realizar cobro':
        return <div className="content">
          <GestCobranza navigate={navigate} usuario={usuario}/>
          </div>;
      case 'Reportes':
        return <div className="content">
          <h1>
          <GestPeriodoRep navigate={navigate}/>
          </h1>
          </div>;
        case 'Notificaciones':
        return <div className="content">
          <GestNotificaciones navigate={navigate}/>
          </div>;
      default:
        return <div className="content">
        <GestPeriodoRep navigate={navigate}/> 
        </div>;
    }
  };

  return (
    <div>
      {/* Navbar pasa la función que actualiza la opción seleccionada */}
      <AdminNavbar onSelect={handleSelection} />

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
  );
}
