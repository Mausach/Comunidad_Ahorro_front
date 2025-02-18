import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { starEditarCliente } from '../../Helpers/EditCliente';
import Swal from 'sweetalert2';

export const ModalEditCliente = ({ showModal, handleCloseModal, selectedCliente, setSelectedCliente, setRefreshData, navigate }) => {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedCliente((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleUpdate = (e) => {
    e.preventDefault();

    // Crear un nuevo objeto con los datos actualizados
    const formData = new FormData(e.target);
    const newUser = { ...selectedCliente }; // Copiar datos existentes

    // Iterar sobre los campos del formulario y actualizar los valores dinámicamente
    for (let [key, value] of formData.entries()) {
      if (value.trim() !== "") {
        newUser[key] = value; // Actualizar solo si el valor no está vacío
      }
    }

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
    
        if (newUser.cuil && newUser.cuil.trim() !== '') {
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


    console.log("Datos actualizados:", newUser);
    starEditarCliente(newUser, setRefreshData, navigate)
    setRefreshData(true);

    // Aquí puedes enviar los datos al servidor o manejarlos como necesites
    // Ejemplo: actualizarClienteAPI(updatedCliente);

    // Cerrar el modal después de actualizar
    handleCloseModal();
  };

  return (
    <div>
      {/* Editar */}

      {selectedCliente && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Editar datos del cliente</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form onSubmit={handleUpdate}>
              {/* Nombres y Apellido */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombres</Form.Label>
                    <Form.Control
                      type="text"
                      minLength={3}
                      maxLength={25}
                      name="nombre"
                      defaultValue={selectedCliente.nombre}
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
                      defaultValue={selectedCliente.apellido}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Dirección y Contacto */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección comercial</Form.Label>
                    <Form.Control
                      type="text"
                      minLength={7}
                      maxLength={65}
                      name="direccion_comersial"
                      defaultValue={selectedCliente.direccion_comersial}
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
                      defaultValue={selectedCliente.direccion_hogar}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Más detalles */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control
                      type="text"
                      minLength={8}
                      maxLength={8}
                      name="dni"
                      defaultValue={selectedCliente.dni}
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
                      defaultValue={selectedCliente.cuil}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Selección de situación veraz */}
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Situación veraz</Form.Label>
                    <Form.Select
                      name="situacion_veraz"
                      defaultValue={selectedCliente.situacion_veraz}
                      onChange={handleChange}
                    >
                      <option value="0">Seleccione la situación</option>
                      {[1, 2, 3, 4, 5, 6].map((num) => {
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
                      defaultValue={selectedCliente.tarjeta}
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
                      defaultValue={selectedCliente.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Teléfonos */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      minLength={7}
                      maxLength={13}
                      name="numero_telefono"
                      defaultValue={selectedCliente.numero_telefono}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono secundario</Form.Label>
                    <Form.Control
                      type="text"
                     
                      maxLength={13}
                      name="numero_telefono_2"
                      defaultValue={selectedCliente.numero_telefono_2}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Nombres y Apellido del familiar */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombres del familiar directo</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={25}
                      name="nombre_familiar"
                      defaultValue={selectedCliente.nombre_familiar}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido del familiar directo</Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={25}
                      name="apellido_familiar"
                      defaultValue={selectedCliente.apellido_familiar}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Guardar Cambios
                </Button>
              </Modal.Footer>
            </Form>

          </Modal.Body>

        </Modal>
      )}

    </div>
  )
}
