import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const NavbarVendedor = ({ onSelect }) => {

  const [expanded, setExpanded] = useState(false); // Estado para controlar el colapso del menú
  const navigate = useNavigate();

  // Manejar el cierre del menú
  const handleSelect = (option) => {
    onSelect(option); // Llamar a la función pasada como prop
    setExpanded(false); // Colapsar el menú
  };

  const ir_LogOut = () => {
    localStorage.removeItem('token');
    //usuario = null; //ver si es necesario
    navigate('/')
  }

  return (
     <div >
          <Navbar
            collapseOnSelect expand="lg" bg="dark" sticky="top"
            expanded={expanded} // Controlar el estado del colapso
            onToggle={(isExpanded) => setExpanded(isExpanded)} // Actualizar el estado al alternar
          >
            <Container fluid>
              <Navbar.Brand onClick={ir_LogOut}>
              <h3 className="text-light">
                  <span className="text-secondary text-shadow">Comunidad </span>Ahorro
                </h3>
              </Navbar.Brand>
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="custom-navbar-toggle text-light"
              />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
            
                  <Button
                    className="m-2 rounded-3 custom-dropdown-toggle"
                    variant="outline-light"
                    onClick={() => handleSelect('Reportes')}
                  >
                    Reportes
                  </Button>
                 
                  <Button
                                  className="m-2 rounded-3 custom-dropdown-toggle"
                                  variant="outline-light"
                                  onClick={() => handleSelect('Realizar venta')}
                                >
                                  Realizar venta
                    </Button>
                  <Button
                    className="m-2 rounded-3 custom-dropdown-toggle"
                    variant="outline-light"
                    onClick={() => handleSelect('Notificaciones')}
                  >
                    Notificaciones
                  </Button>
                  <Button
                    className="m-2 rounded-3 custom-dropdown-toggle"
                    variant="outline-light"
                    onClick={ir_LogOut}
                  >
                    Salir
                  </Button>
                  
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
  )
}

