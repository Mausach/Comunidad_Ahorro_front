import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { CargarProductos } from '../Helpers/Cargarroductos';
import { Card_Planes } from './Subcomponente/CardPlan';
import { CardPrestamo } from './Subcomponente/CardPrestamo';
import { ModalCrearProducto } from './Subcomponente/ModalCrearProducto';
import Swal from 'sweetalert2';
import { ModalCrearProdPrestamo } from './Subcomponente/ModalCrearProdPrestamo';

export const GestPlanes = ({ navigate }) => {

  const [productos, setProductos] = useState([]); // Estado para tipo de productos planes de diferentes cosas
  const [refreshData, setRefreshData] = useState(false); // Estado para refrescar
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [showModalPrestamo, setShowModalPrestamo] = useState(false); // Estado para el modal de préstamos

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    // Restablecer estilos del body

  };

  const handleShowModalPrestamo = () => setShowModalPrestamo(true);
  const handleCloseModalPrestamo = () => {
    setShowModalPrestamo(false);
    // Restablecer estilos del body

  };

  const handleCrear = () => {
    Swal.fire({
      title: '¿Qué deseas crear?',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Producto plan',
      denyButtonText: 'Préstamo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
      denyButtonColor: '#0d6efd',
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          handleShowModal();
        }, 100);
      } else if (result.isDenied) {
        setTimeout(() => {
          setShowModalPrestamo(true);
        }, 100);
      }
    }).finally(() => {
      // ✅ Restablecer el scroll del body
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px"; // Evita el desplazamiento lateral
    });
  };

  const cargarCardsPlanesPrestamos = () => {
    return (
      <div>
        <Container className="mt-5 p-3">
          {productos.length > 0 ? (
            <div>
              {/* Cards de los Planes y Préstamos */}
              <Row className="mb-4 gy-4">
                {productos.map((producto) => (
                  <Col key={producto.id} md={4} sm={6} xs={12} className="mb-3">
                    {producto.prestamo_bandera ? (
                      // Si prestamo_bandera es true, renderiza el CardPrestamo
                      <CardPrestamo productos={producto} setRefreshData={setRefreshData} navigate={navigate} />
                    ) : (
                      // Si prestamo_bandera es false, renderiza el Card_Planes
                      <Card_Planes productos={producto} setRefreshData={setRefreshData} navigate={navigate} />
                    )}
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <Alert variant="danger">
              <h5>No hay datos disponibles para mostrar.</h5>
            </Alert>
          )}
        </Container>
      </div>
    );
  };

  useEffect(() => {
    if (refreshData) {
      CargarProductos(setProductos, navigate);
      setRefreshData(false);
    } else {
      CargarProductos(setProductos, navigate);
    }
  }, [refreshData, navigate]);

  return (
    <div>

      <Button variant="primary" className='mb-3 rounded-3 m-4' onClick={handleCrear}>
        Crear un Nuevo Producto
      </Button>



      <ModalCrearProducto showModal={showModal} handleCloseModal={handleCloseModal} setRefreshData={setRefreshData} navigate={navigate} />

      <ModalCrearProdPrestamo showModal={showModalPrestamo} handleCloseModal={handleCloseModalPrestamo} setRefreshData={setRefreshData} navigate={navigate} />

      {cargarCardsPlanesPrestamos()}
    </div>
  );
};
