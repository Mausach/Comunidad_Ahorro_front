import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'; // Importar InputGroup para íconos
import { Eye, EyeSlash } from 'react-bootstrap-icons'; // Importar íconos
import { starCrearUsuario } from '../../Helpers/AltaUsuario';
import Swal from 'sweetalert2';

export const ModalCrearUsuario = ({ showCreateModal, handleCloseCreateModal, setRefreshData, navigate, roles }) => {

  const [newUser, setNewUser] = useState({
    nombres: '',
    apellido: '',
    direccion: '',
    dni: '', //cambiar en el modal a tipo number y ver de parsearlo a string antes de mandarlo al backend para cuil y tel tambn
    cuil: null,
    email: '',
    numero_telefono: '',
    numero_telefono_2: null,
    apellido_familiar: '',
    nombre_familiar: '',
    fecha_ingreso: new Date().toLocaleDateString('en-CA'), // Fecha actual en 'YYYY-MM-DD' según tu zona horaria, // Fecha actual en formato 'YYYY-MM-DD'
    fecha_despido_renuncia: null, // Campo solo para edición futura
    estado_acceso: true, // Campo fijo, no se modifica en el formulario
    estado_rendimiento: '', // Campo solo para edición futura
    monotributo: false, // Campo booleano que se ingresa en el formulario
    objetivo: 0, // Campo solo para edición futura
    sueldo: 0, // Campo solo para edición futura
    nombre_de_usuario: '',
    contraseña: '',
    rolId: 0, // Cambiado de "rol" a "rolId" para coincidir con el backend
  });

  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

  // Función para alternar la visibilidad de la contraseña
  const togglePassword = () => setShowPassword(!showPassword);

  // Manejar cambios en el formulario de creación
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'rolId' ? parseInt(value, 10) : value,
    }));
  };

  //para crear el usuario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (
      !newUser.nombres.trim() ||
      !newUser.apellido.trim() ||

      !newUser.numero_telefono.trim() ||
      !newUser.nombre_de_usuario.trim()


    ) {
      console.log(newUser)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios. Por favor, complete todos los datos.',
      });
      return;
    }

    // Validación del rol seleccionado
    if (!newUser.rolId) {
      Swal.fire({
        icon: 'error',
        title: 'Rol no seleccionado',
        text: 'Por favor, seleccione un rol válido.',
      });
      return;
    }

    // Validación del nombre
    if (newUser.nombres.length > 0 && !/^[a-zA-Z\s]+$/.test(newUser.nombres)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre inválido',
        text: 'El nombre solo puede contener letras y espacios.',
      });
      return;
    }

    // Validación apellido
    if (newUser.apellido.length > 0 && !/^[a-zA-Z\s]+$/.test(newUser.apellido)) {
      Swal.fire({
        icon: 'error',
        title: 'Apellido inválido',
        text: 'El apellido solo puede contener letras y espacios.',
      });
      return;
    }


    // Validación del email
    if (newUser.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor, ingrese un email válido.',
      });
      return;
    }

    // Validación de la direccion
    if (newUser.direccion.length > 0 && !/^[a-zA-Z0-9\s]+$/.test(newUser.direccion)) {
      Swal.fire({
        icon: 'error',
        title: 'Dirección inválida',
        text: 'La dirección solo puede contener letras, números y espacios.',
      });
      return;
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

    //falta validacion de un numero de telefono
    if (newUser.numero_telefono.length > 12 || isNaN(newUser.numero_telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Telefono inválido',
        text: 'El Telefono debe tener 8 caracteres numéricos.',
      });
      return;
    }




    // Validación de la contraseña
    if (newUser.contraseña.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña demasiado corta',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }



    // Aquí enviarías los datos a la API
    console.log('Usuario creado:', newUser.fecha_ingreso);
    starCrearUsuario(newUser, setRefreshData, navigate)
    console.log('Usuario creado:', newUser);


    // Resetear formulario
    setNewUser({
      nombres: '',
      apellido: '',
      direccion: '',
      dni: '',
      cuil: null,
      email: '',
      numero_telefono: '',
      numero_telefono_2: null,
      apellido_familiar: '',
      nombre_familiar: '',
      fecha_ingreso: new Date().toLocaleDateString('en-CA'), // Fecha actual en 'YYYY-MM-DD' según tu zona horaria, // Fecha actual en formato 'YYYY-MM-DD'
      fecha_despido_renuncia: null, // Campo solo para edición futura
      estado_acceso: true, // Campo fijo, no se modifica en el formulario
      estado_rendimiento: '', // Campo solo para edición futura
      monotributo: false, // Campo booleano que se ingresa en el formulario
      objetivo: 0, // Campo solo para edición futura
      sueldo: 0, // Campo solo para edición futura
      nombre_de_usuario: '',
      contraseña: '',
      rolId: 0, // Cambiado de "rol" a "rolId" para coincidir con el backend
    });

    handleCloseCreateModal(); // Cierra el modal
  };

  return (
    <div>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg" centered >
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body >
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
                    name="nombres"
                    value={newUser.nombres}
                    onChange={handleChange}
                    isInvalid={!newUser.nombres} // Muestra error si está vacío
                    required
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
                    isInvalid={!newUser.apellido} // Muestra error si está vacío
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* Selección de Rol */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    name="rolId"
                    value={newUser.rolId}
                    onChange={handleChange}
                    isInvalid={!newUser.rolId} // Muestra error si está vacío
                    required
                  >
                    <option value="0">Seleccione un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

              </Col>

              {/* Dirección */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={7}
                    maxLength={65}
                    name="direccion"
                    value={newUser.direccion}
                    onChange={handleChange}
                    isInvalid={!newUser.direccion} // Muestra error si está vacío
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* Email y DNI CUL */}
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
                    isInvalid={!newUser.email} // Muestra error si está vacío
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-3">DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu DNI (sin punto)"
                    minLength={8}
                    maxLength={8}
                    name="dni"
                    value={newUser.dni}
                    onChange={handleChange}
                    isInvalid={!newUser.dni} // Muestra error si está vacío
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>CUIL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu CUIL (sin guiones)"
                    maxLength={11}
                    name="cuil"
                    value={newUser.cuil}
                    onChange={handleChange}
                    isInvalid={!newUser.cuil} // Muestra error si está vacío
                    required
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
                    maxLength={12}
                    name="numero_telefono"
                    value={newUser.numero_telefono}
                    onChange={handleChange}
                    isInvalid={!newUser.numero_telefono} // Muestra error si está vacío
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono secundario</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={12}
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
              {/* Nombre de Usuario y Contraseña */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    minLength={3}
                    maxLength={25}
                    name="nombre_de_usuario"
                    value={newUser.nombre_de_usuario}
                    onChange={handleChange}
                    isInvalid={!newUser.nombre_de_usuario} // Muestra error si está vacío
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      minLength={6}

                      name="contraseña"
                      value={newUser.contraseña}
                      onChange={handleChange}
                      isInvalid={!newUser.contraseña} // Muestra error si está vacío
                      required
                    />
                    <InputGroup.Text onClick={togglePassword} style={{ cursor: 'pointer' }}>
                      {showPassword ?   <Eye />: <EyeSlash />}
                    </InputGroup.Text>
                  </InputGroup>

                </Form.Group>




              </Col>

              {/* Monotributo */}
              <Col md={12}>
                {/* Monotributo */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Monotributo"
                    name="monotributo"
                    checked={newUser.monotributo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

            </Row>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseCreateModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Usuario
              </Button>
            </Modal.Footer>

          </Form>
        </Modal.Body>

      </Modal>

    </div>
  )
}
