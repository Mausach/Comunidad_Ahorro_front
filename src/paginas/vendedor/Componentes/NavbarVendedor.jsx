import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Logo1_Black-removebg-preview.png'
import Swal from 'sweetalert2';


const NavbarVendedor = ({ onSelect }) => {
  const [expanded, setExpanded] = useState(false); // Estado para controlar el colapso del menú
  const navigate = useNavigate(); 


  // Manejar el cierre del menú
  const handleSelect = (option) => {
    onSelect(option); // Llamar a la función pasada como prop
    setExpanded(false); // Colapsar el menú
  };



const ir_LogOut = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/");
      }
    });
  }

  return (
    <div >
     <Navbar
        collapseOnSelect expand="lg" bg="dark" sticky="top"
        expanded={expanded} // Controlar el estado del colapso
        onToggle={(isExpanded) => setExpanded(isExpanded)} // Actualizar el estado al alternar
        className="navbar-dark navbar-expand-lg fondo_nav_footer"
      >
        <Container fluid>
          <Navbar.Brand onClick={ir_LogOut}>
            <h3 className="text-light">
              <div className=''>
                <img className="logo img-fluid" style={{ width: '200px', height: '100px', objectFit: 'cover' }} src={Logo} alt="Logo" />
              </div>
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
                onClick={() => handleSelect('Realizar venta')}
              >
                Registrar venta
              </Button>
             
             
              <Button
                className="m-2 rounded-3 custom-dropdown-toggle"
                variant="outline-light"
                onClick={ir_LogOut}
              >
                <i className="bi bi-box-arrow-left"> </i>
                Salir
              </Button>



            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarVendedor;

