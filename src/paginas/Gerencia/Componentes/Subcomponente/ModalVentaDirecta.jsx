import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { starCrearCliente } from '../../Helpers/AltaCliente';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearPlanCliente } from '../../Helpers/AltaPlanCliente';
import { starCrearVentaDirecta } from '../../Helpers/AltaVentaDirecta';

export const ModalVentaDirecta = ({ show, handleClose, setRefreshData, navigate, usuario, reporte, cobradores, producto }) => {

  console.log(reporte)
  const [newUser, setNewUser] = useState({ //usaremos user pero es de clientes esto luego se movera
    apellido: '', // Apellido del cliente
    nombre: '', // Nombre del cliente
    direccion_comersial: '', // Dirección comercial
    direccion_hogar: '', // Dirección del hogar
    dni: '', // DNI único
    cuil: null, // CUIL único
    //falta agregar la fecha
    tarjeta: '', // Tarjeta (opcional)
    email: '', // Email único
    numero_telefono: '', // Teléfono principal único
    numero_telefono_2: '', // Teléfono secundario único
    apellido_familiar: '', // Apellido de un familiar
    nombre_familiar: '', // Nombre de un familiar
    situacion_veraz: 0, // Situación veraz (entero, por defecto 0)
    numero_cliente: '', // Número de cliente único (generado)


    //datos venta directa
    nombreProd: producto.nombre,
    objeto_en_venta: '',
    monto: 0,
    metodoPago:'',
    productoId: producto.id,

    //id de quien manda la venta
    vendedorId: usuario,
    reporteId: reporte,//cobrador

    esNuevoCliente: true,

  });


  // Manejar cambios en el formulario de creación
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  //para crear el cliente
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    const requiredFields = [
      'apellido',
      'nombre',
      'direccion_hogar',
      'dni',
      'email',
      'numero_telefono',
      'apellido_familiar',
      'nombre_familiar',
    ];

    for (const field of requiredFields) {
      if (!newUser[field] || newUser[field].trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `El campo ${field} es obligatorio. Por favor, complételo.`,
        });
        return;
      }
    }

    // Validación del DNI
    if (newUser.dni.length !== 8 || isNaN(newUser.dni)) {
      Swal.fire({
        icon: 'error',
        title: 'DNI inválido',
        text: 'El DNI debe tener 8 caracteres numéricos.',
      });
      return;
    }

    if (newUser.cuil && newUser.cuil.trim() !== null) {
      // Validar longitud y que sea numérico
      if (newUser.cuil.length !== 11 || isNaN(newUser.cuil)) {
        Swal.fire({
          icon: 'error',
          title: 'CUIL inválido',
          text: 'El CUIL debe tener 11 caracteres numéricos.',
        });
        return;
      }

      // Verificar que el CUIL contenga el DNI
      if (!newUser.cuil.includes(newUser.dni)) {
        Swal.fire({
          icon: 'error',
          title: 'CUIL inválido',
          text: 'El CUIL debe contener el número de DNI como parte de su estructura.',
        });
        return;
      }
    }

    // Validación del email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor, ingrese un email válido.',
      });
      return;
    }

    //falta validacion de un numero de telefono
    if (newUser.numero_telefono.length > 12 || isNaN(newUser.numero_telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Telefono inválido',
        text: 'El Telefono debe tener 8 caracteres numéricos.',
      });
      return;
    }



    // Enviar datos a la API
    console.log('Creando cliente:', newUser);
    starCrearVentaDirecta(newUser, setRefreshData, navigate);
    //starCrearPlanCliente(newUser, setRefreshData, navigate);

    // Resetear formulario
    setNewUser({
      apellido: '', // Apellido del cliente
      nombre: '', // Nombre del cliente
      direccion_comersial: '', // Dirección comercial
      direccion_hogar: '', // Dirección del hogar
      dni: '', // DNI único
      cuil: null, // CUIL único
      //falta agregar la fecha
      tarjeta: '', // Tarjeta (opcional)
      email: '', // Email único
      numero_telefono: '', // Teléfono principal único
      numero_telefono_2: '', // Teléfono secundario único
      apellido_familiar: '', // Apellido de un familiar
      nombre_familiar: '', // Nombre de un familiar
      situacion_veraz: 0, // Situación veraz (entero, por defecto 0)
      numero_cliente: '', // Número de cliente único (generado)



      //datos venta directa
      nombreProd: producto.nombre,
      objeto_en_venta: '',
      monto: 0,
      metodoPago: '',
      productoId: producto.id,

      //id de quien manda la venta
      vendedorId: usuario,
      reporteId: reporte,//cobrador

      esNuevoCliente: true,
    });


    handleClose();


  };


  return (
    <div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Formulario de un Nuevo Prestamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Nombres y Apellido */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={3}
                    maxLength={25}
                    name="nombre"
                    value={newUser.nombre}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={3}
                    maxLength={25}
                    name="apellido"
                    value={newUser.apellido}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {/* Dirección y Contacto */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección comercial</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={7}
                    maxLength={65}
                    name="direccion_comersial"
                    value={newUser.direccion_comersial}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección del hogar</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={7}
                    maxLength={65}
                    name="direccion_hogar"
                    value={newUser.direccion_hogar}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {/* Más detalles */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={8}
                    maxLength={8}
                    name="dni"
                    value={newUser.dni}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CUIL</Form.Label>
                  <Form.Control
                    type="text"

                    maxLength={11}
                    name="cuil"
                    value={newUser.cuil}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {/* Selección de situacion veraz */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Situacion veraz</Form.Label>
                  <Form.Select
                    name="situacion_veraz"
                    value={newUser.situacion_veraz}
                    onChange={handleChange}
                  >
                    <option value="0">Seleccione la situacion</option>
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      // Determina la clase de color en función del número
                      let colorClass = "";
                      if (num <= 2) colorClass = "text-success";
                      else if (num <= 4) colorClass = "text-warning";
                      else if (num <= 6) colorClass = "text-danger";

                      return (
                        <option key={num} value={num} className={colorClass}>
                          {num}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tarjeta</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={4}
                    maxLength={25}
                    name="tarjeta"
                    value={newUser.tarjeta}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    minLength={13}
                    maxLength={35}
                    name="email"
                    value={newUser.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {/* Telefonos */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={7}
                    maxLength={13}
                    name="numero_telefono"
                    value={newUser.numero_telefono}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono secundario</Form.Label>
                  <Form.Control
                    type="text"

                    maxLength={13}
                    name="numero_telefono_2"
                    value={newUser.numero_telefono_2}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {/* Nombres y Apellido familiar*/}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres familiar directo</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={25}
                    name="nombre_familiar"
                    value={newUser.nombre_familiar}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido familiar directo</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={25}
                    name="apellido_familiar"
                    value={newUser.apellido_familiar}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {/* Producto y num de contrato */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Producto en venta:</Form.Label>
                  <Form.Control
                    type="text"
                    min={0}
                    name="objeto_en_venta"
                    value={newUser.objeto_en_venta}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Metodo de Pago </Form.Label>
                  <Form.Control
                    type="text"
                    min={0}
                    name="metodoPago"
                    value={newUser.metodoPago}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Monto </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    name="monto"
                    value={newUser.monto}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="dark" type="submit">
                Guardar Cliente
              </Button>
            </Modal.Footer>

          </Form>
        </Modal.Body>

      </Modal>

    </div>
  )
}