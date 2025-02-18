import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup'; // Importar InputGroup para íconos
import { Eye, EyeSlash } from 'react-bootstrap-icons'; // Importar íconos
import { starEditarUsuario } from '../../Helpers/EditUsuarios';
import Swal from 'sweetalert2';

export const ModalEditUsuarios = ({ showModal, showModalER, handleCloseModal, handleCloseModalER, setRefreshData, navigate, roles, selectedUser }) => {

    const [editedUser, setEditedUser] = useState({
        id: '', // ID del usuario seleccionado, necesario para identificar al usuario a editar
        nombres: '',
        apellido: '',
        direccion: '',
        dni: '',
        cuil: '',
        email: '',
        numero_telefono: '',
        numero_telefono_2: '',
        apellido_familiar: '',
        nombre_familiar: '',
        fecha_ingreso: new Date().toLocaleDateString('en-CA'), // Fecha actual en 'YYYY-MM-DD' según tu zona horaria, // Fecha actual como valor inicial
        fecha_despido_renuncia: null, // Campo opcional
        estado_acceso: true, // Booleano
        estado_rendimiento: '', // Puede cambiarse si corresponde *** podemos hacer algo a laa hora de rendicion sobre todo ver a lo largo del tiempo o fechas
        monotributo: false, // Booleano
        objetivo: 0, // Numérico, puede cambiar ***total vendido en la empresa para ver mas detalles en los reportes
        sueldo: 0, // Numérico, puede cambiar *** podemos acumular el total facturado en al empresa
        nombre_de_usuario: '',
        contraseña: '', // Puede permanecer vacío si no se edita
        rolId: 0, // ID relacionado con el rol en backend
    });

    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    // Función para alternar la visibilidad de la contraseña
    const togglePassword = () => setShowPassword(!showPassword);

    // Manejar cambios en el formulario de edicion
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'rolId' ? parseInt(value, 10) : value,
        }));
    };
    //para editar
    const handleUpdate = (e) => {
        e.preventDefault();
        const form = e.target;

        const newUser = {
            id: selectedUser.id,
            nombres: form.nombres?.value || selectedUser.nombres,
            apellido: form.apellido?.value || selectedUser.apellido,
            direccion: form.direccion?.value || selectedUser.direccion,
            dni: form.dni?.value || selectedUser.dni,
            cuil: form.cuil?.value || selectedUser.cuil,
            email: form.email?.value || selectedUser.email,
            numero_telefono: form.numero_telefono?.value || selectedUser.numero_telefono,
            numero_telefono_2: form.numero_telefono_2?.value || selectedUser.numero_telefono_2,
            apellido_familiar: form.apellido_familiar?.value || selectedUser.apellido_familiar,
            nombre_familiar: form.nombre_familiar?.value || selectedUser.nombre_familiar,
            fecha_ingreso: form.fecha_ingreso?.value || selectedUser.fecha_ingreso,
            fecha_despido_renuncia: form.fecha_despido_renuncia?.value || selectedUser.fecha_despido_renuncia,
            estado_acceso: form.estado_acceso?.checked || selectedUser.estado_acceso,
            estado_rendimiento: form.estado_rendimiento?.value || selectedUser.estado_rendimiento,
            monotributo: form.monotributo?.checked || false,
            objetivo: form.objetivo?.value || selectedUser.objetivo,
            sueldo: form.sueldo?.value || selectedUser.sueldo,
            nombre_de_usuario: form.nombre_de_usuario?.value || selectedUser.nombre_de_usuario,
            // Solo incluir la contraseña si es proporcionada
            contraseña: form.contraseña && form.contraseña.value ? form.contraseña.value : undefined,
            rolId: form.rolId?.value || selectedUser.rolId
        };

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

        // Verificar que el CUIL contenga el DNI
        if (!newUser.cuil.includes(newUser.dni)) {
            Swal.fire({
                icon: 'error',
                title: 'CUIL inválido',
                text: 'El CUIL debe contener el número de DNI como parte de su estructura.',
            });
            return;
        }



        // Validación de la contraseña
        if (newUser.contraseña !== undefined && newUser.contraseña.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña demasiado corta',
                text: 'La contraseña debe tener al menos 6 caracteres.',
            });
            return;
        }

        console.log(newUser, selectedUser.contraseña);

        // Actualizar el usuario
        starEditarUsuario(newUser, setRefreshData, navigate);

        //debo limpiar el check cuando termine de guardar cambios el de monotributo
        handleCloseModal()
        handleCloseModalER()

    };


    return (
        <div>
            {/* Modal para editar datos personales usuario */}
            {selectedUser && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Información del Usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdate}>
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
                                            defaultValue={selectedUser.nombres}
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
                                            defaultValue={selectedUser.apellido}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Selección de Rol */}
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Select
                                            name="rolId"
                                            defaultValue={selectedUser.rolId}
                                            onChange={handleChange}
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

                                {/* Dirección y Contacto */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            type="text"
                                            minLength={7}
                                            maxLength={65}
                                            name="direccion"
                                            defaultValue={selectedUser.direccion}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            minLength={13}
                                            maxLength={35}
                                            name="email"
                                            defaultValue={selectedUser.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Más detalles */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>DNI</Form.Label>
                                        <Form.Control
                                            type="text"
                                            minLength={8}
                                            maxLength={8}
                                            name="dni"
                                            defaultValue={selectedUser.dni}
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
                                            defaultValue={selectedUser.cuil}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Teléfonos */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            minLength={7}
                                            maxLength={12}
                                            name="numero_telefono"
                                            defaultValue={selectedUser.numero_telefono}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Teléfono secundario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={12}
                                            name="numero_telefono_2"
                                            defaultValue={selectedUser.numero_telefono_2}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Familiares */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombres familiar directo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={25}
                                            name="nombre_familiar"
                                            defaultValue={selectedUser.nombre_familiar}
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
                                            defaultValue={selectedUser.apellido_familiar}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Nombre de Usuario y Contraseña */}
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre de Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            minLength={3}
                                            maxLength={25}
                                            name="nombre_de_usuario"
                                            defaultValue={selectedUser.nombre_de_usuario}
                                            onChange={handleChange}
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
                                                defaultValue={selectedUser.contraseña}
                                                onChange={handleChange}
                                            />
                                            <InputGroup.Text onClick={togglePassword} style={{ cursor: 'pointer' }}>
                                                {showPassword ?   <Eye />: <EyeSlash />}
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>

                                {/* Monotributo */}
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Monotributo:</Form.Label>
                                        <Form.Check
                                            type="checkbox"

                                            checked={editedUser.monotributo}
                                            onChange={(e) =>
                                                setEditedUser({ ...editedUser, monotributo: e.target.checked })
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary"  type="submit">
                                Guardar Cambios
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}

            {/* Modal para editar datos rendimientos usuario */}
            {selectedUser && (
                <Modal show={showModalER} onHide={handleCloseModalER}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Rendimiento del Usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdate}>
                            {/* Sueldo y objetivo*/}
                            <Form.Group className="mb-3">
                                <Form.Label>Sueldo</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sueldo"
                                    defaultValue={selectedUser.sueldo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Objetivo</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="objetivo"
                                    defaultValue={selectedUser.objetivo}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {/* Rendimiento y Despido */}
                            <Form.Group className="mb-3">
                                <Form.Label>Estado de Rendimiento</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxLength={25}
                                    name="estado_rendimiento"
                                    defaultValue={selectedUser.estado_rendimiento}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Modal.Footer>
                                <Button variant="danger" >
                                    Baja o despido
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
