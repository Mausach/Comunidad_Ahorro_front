import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { starCrearCliente } from '../../Helpers/AltaCliente';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearPrestamoCliente } from '../../Helpers/AltaPretamoCliente';

export const ModalCrearClientePrestamo = ({ showCreateModal, handleCloseCreateModal, setRefreshData, navigate, usuario, reporte, cobradores, prestamoNombre, tipoCobranza }) => {

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

        //estos datos son del prestamo
        nombrePres: prestamoNombre,
        monto_prestado: 0,
        interes_agregado: 0,
        tipo: '',
        cantidad_tipo: 0,


        //id de quien manda la venta
        vendedorId: usuario,
        cobradorId: 0,
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
        starCrearPrestamoCliente(newUser, setRefreshData, navigate);

        // Resetear formulario
        setNewUser({
            apellido: '', // Apellido del cliente
            nombre: '', // Nombre del cliente
            direccion_comersial: '', // Dirección comercial
            direccion_hogar: '', // Dirección del hogar
            dni: '', // DNI único
            cuil: '', // CUIL único
            //falta agregar la fecha
            tarjeta: '', // Tarjeta (opcional)
            email: '', // Email único
            numero_telefono: '', // Teléfono principal único
            numero_telefono_2: '', // Teléfono secundario único
            apellido_familiar: '', // Apellido de un familiar
            nombre_familiar: '', // Nombre de un familiar
            situacion_veraz: 0, // Situación veraz (entero, por defecto 0)
            numero_cliente: '', // Número de cliente único (generado)

            //estos datos son del prestamo
            monto_prestado: 0,
            interes_agregado: 0,
            tipo: '',
            cantidad_tipo: 0,

            //id de quien manda la venta
            vendedorId: usuario,
            cobradorId: 0,//cobrador
            reporteId: reporte,//reporte

            esNuevoCliente: true,

        });


        handleCloseCreateModal();


    };


    return (
        <div>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
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
                            {/* Monto y Interés */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Monto Prestado</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="monto_prestado"
                                        value={newUser.monto_prestado}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Interés Agregado (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        max={100}
                                        name="interes_agregado"
                                        value={newUser.interes_agregado}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            {/* Tipo y Cantidad */}
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select
                                        name="tipo"
                                        value={newUser.tipo} // Este es el valor seleccionado, puedes adaptarlo según tu estado
                                        onChange={handleChange} // Asegúrate de tener la lógica de cambio del valor
                                    >
                                        <option value="">Seleccione el tipo</option>
                                        {tipoCobranza && tipoCobranza.map((tipo, index) => (
                                            <option key={index} value={tipo}>
                                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)} {/* Esto es para capitalizar la primera letra */}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        name="cantidad_tipo"
                                        value={newUser.cantidad_tipo}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            {/* Selección de Cobrador */}
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cobrador asigado</Form.Label>
                                    <Form.Select
                                        name="cobradorId"
                                        value={newUser.cobrador}
                                        onChange={handleChange}
                                    >
                                        <option value="0">Seleccione un cobrador</option>
                                        {cobradores.map((usuarios) => (
                                            <option key={usuarios.id} value={usuarios.id}>
                                                {usuarios.nombres}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                            </Col>

                        </Row>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreateModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Guardar Cliente
                            </Button>
                        </Modal.Footer>

                    </Form>
                </Modal.Body>

            </Modal>

        </div>
    )
}
