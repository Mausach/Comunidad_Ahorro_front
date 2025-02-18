import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { deshabilitarProducto } from '../../Helpers/DeshabilitarProducto';
import { starEditarProductos } from '../../Helpers/EditProductos';
import { habilitarProducto } from '../../Helpers/habilitarProducto';


export const CardPrestamo = ({ productos, setRefreshData, navigate }) => {
  const {
    nombre,
    descripcion,
    prestamo_bandera,
    monto_max_prestar,
    tipo_cobranza_prestamo,
  } = productos;
  const [showModal, setShowModal] = useState(false);
  const [productoEditado, setProductoEditado] = useState({
    nombre: '',
    descripcion: '',
    monto_max_prestar: 0,
    tipo_cobranza_prestamo: [],
  });

  // Función para abrir el modal y cargar la información del producto
  const handleEditClick = (producto) => {
    setProductoEditado(producto);  // Llenar el formulario con los datos actuales
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleActivate = (productos) => {
    Swal.fire({
      title: '¿Desea activar este producto?',
      text: `${productos.nombre} ${productos.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
    }).then((result) => {
      if (result.isConfirmed) {
        //ActivateUser(user.id);
        habilitarProducto(productos.id)

        setRefreshData(true);
        console.log(productos.id, productos.estado_producto)
      }
    });
  };

  const handleDeactivate = (productos) => {
    Swal.fire({
      title: '¿Inhabilitar este producto?',
      text: `${productos.nombre} ${productos.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja',
    }).then((result) => {
      if (result.isConfirmed) {
        //DeactivateUser(user.id);
        deshabilitarProducto(productos.id)
        console.log(productos.id, productos.estado_producto)
        setRefreshData(true);
      }
    });
  };

  // Función para manejar los cambios de los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setProductoEditado((prev) => {
        const updatedCobranza = checked
          ? [...prev.tipo_cobranza_prestamo, value]
          : prev.tipo_cobranza_prestamo.filter((item) => item !== value);
        return { ...prev, tipo_cobranza_prestamo: updatedCobranza };
      });
    } else {
      setProductoEditado((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Función para guardar los cambios en el producto
  const handleSaveChanges = (e) => {
    e.preventDefault();


    e.preventDefault();
    const form = e.target;

    const updatedProducto = {
      id: productoEditado.id,
      nombre: productoEditado.nombre || '', // Si no hay nombre, deja vacío
      descripcion: productoEditado.descripcion || '', // Si no hay descripción, deja vacío
      monto_max_prestar: productoEditado.monto_max_prestar || 0, // Si no hay monto, usa 0 como valor por defecto
      tipo_cobranza_prestamo: productoEditado.tipo_cobranza_prestamo || [], // Si no hay tipo de cobranza, deja un arreglo vacío
      // Otros campos relacionados con productoEditado
      plan_bandera: productoEditado.plan_bandera || false, // Esto es un ejemplo para un campo booleano
      cantidad_cuotas_plan: productoEditado.cantidad_cuotas_plan || 0, // Valor por defecto en caso de que no exista
      cuotas_entrega_pactada: productoEditado.cuotas_entrega_pactada || [], // En caso de que no existan cuotas, se pone vacío
      // Agregar más campos según sea necesario
    };


    // Validar nombre
    if (!updatedProducto.nombre || updatedProducto.nombre.trim().length < 7) {

      Swal.fire({
        icon: 'error',
        title: 'Nombre no valido',
        text: 'El nombre debe tener al menos 7 caracteres.',
      });
      return;
    }

    // Validar descripción
    if (!updatedProducto.descripcion || updatedProducto.descripcion.trim().length < 8) {

      Swal.fire({
        icon: 'error',
        title: 'Descripcion no valida',
        text: 'La descripción debe tener al menos 8 caracteres.',
      });
      return;

    }

    if (!updatedProducto.monto_max_prestar || updatedProducto.monto_max_prestar <= 0) {


      Swal.fire({
        icon: 'error',
        title: 'Monto maximo no valido',
        text: 'El monto maximo a prestar debe ser mayor a 0.',
      });
      return;


    }

    // Validar que tipo_cobranza_prestamo no esté vacío
    if (updatedProducto.tipo_cobranza_prestamo.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Selección inválida',
        text: 'Debe seleccionar al menos un tipo de cobranza.',
      });
      return;
    }

    starEditarProductos(updatedProducto, setRefreshData, navigate);
    console.log(updatedProducto); // Aquí podrías actualizar el estado o realizar otra acción
    handleCloseModal(); // Cerrar el modal después de guardar
  };

  return (
    <div className="card-container">
      <Card className="card bg-light text-dark p-3 mb-5 bg-white m-3 col-3 p-2 col-md-4 col-xl-3 shadow-lg rounded-start-5"
        border="light"
        style={{ width: '20rem', height: '30rem', overflow: 'auto' }}
      >
        <Card.Body >
          <Card.Title>{nombre}</Card.Title>
          <Card.Text>{descripcion || 'Sin descripción disponible.'}</Card.Text>
          <hr />
          <Card.Text>
            <strong>Monto maximo a prestar:</strong> ${monto_max_prestar}
          </Card.Text>

          {/* Mostrar tipos de cobranza de préstamo */}
          {tipo_cobranza_prestamo && tipo_cobranza_prestamo.length > 0 && (
            <Card.Text>
              <strong>Tipos de cobranza:</strong>
              <ul>
                {tipo_cobranza_prestamo.map((tipo, index) => (
                  <li key={index}>{tipo}</li>
                ))}
              </ul>
            </Card.Text>
          )}
          <div className="d-flex flex-column gap-2">

            {productos.estado_producto ? (
              <Button
                variant="danger"
                onClick={() => handleDeactivate(productos)}
              >
                baja de producto
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => handleActivate(productos)}
              >
                activar producto
              </Button>
            )}
            <Button variant="primary" onClick={() => handleEditClick(productos)}> Editar informacion de prestamo </Button>

          </div>


        </Card.Body>

      </Card>

      {/* Modal para editar el producto */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto Préstamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveChanges}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={productoEditado.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="descripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={productoEditado.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="monto_max_prestar" className="mt-3">
              <Form.Label>Monto Máximo a Prestar</Form.Label>
              <Form.Control
                type="number"
                name="monto_max_prestar"
                value={productoEditado.monto_max_prestar}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Tipo de Cobranza</Form.Label>
              <div>
                {["diario", "semanal", "quincenal", "mensual"].map((tipo_cobranza_prestamo) => (
                  <Form.Check
                    key={tipo_cobranza_prestamo}
                    inline
                    label={tipo_cobranza_prestamo.charAt(0).toUpperCase() + tipo_cobranza_prestamo.slice(1)}
                    name="tipo_cobranza_prestamo"
                    value={tipo_cobranza_prestamo}
                    type="checkbox"
                    checked={productoEditado.tipo_cobranza_prestamo.includes(tipo_cobranza_prestamo)}
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Guardar cambios
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};