import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { starCrearCliente } from '../../Helpers/AltaCliente';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearPlanCliente } from '../../Helpers/AltaPlanCliente';
import { starCrearVentaPermutada } from '../../Helpers/AltaVtaPermutada';

export const ModalPermutaClienteNuevo = ({ showCreateModal, handleCloseCreateModal, setRefreshData, navigate, usuario, reporte, cobradores, producto }) => {

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


        //datos permutado
        nombrePer: producto.nombre,
        objeto_recibido: '',
        valor_obj_recibido: 0,
        objeto_entregado: '',
        monto_adicional_recibido: 0,
        cant_cuotas_restantes: 0,
        monto_cuota: 0,
        productoId: producto.id,
        tipo: '',

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
        starCrearVentaPermutada(newUser, setRefreshData, navigate);

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


            //datos permutado
            nombrePer: producto.nombre,
            objeto_recibido: '',
            valor_obj_recibido: 0,
            objeto_entregado: '',
            monto_adicional_recibido: 0,
            cant_cuotas_restantes: 0,
            monto_cuota: 0,
            productoId: producto.id,
            tipo: '',

            //id de quien manda la venta
            vendedorId: usuario,
            cobradorId: 0,
            reporteId: reporte,//cobrador

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
                            {/* Producto y num de contrato */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Objeto recibido:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        min={4}
                                        name="objeto_recibido"
                                        value={newUser.objeto_recibido}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>valor objeto recibido </Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="valor_obj_recibido"
                                        value={newUser.valor_obj_recibido}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row>
                            {/* Producto y num de contrato */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Monto adicional recibido:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="monto_adicional_recibido"
                                        value={newUser.monto_adicional_recibido}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select
                                        name="tipo"
                                        value={newUser.tipo}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione el tipo</option>
                                        <option value="diario">Día</option>
                                        <option value="semanal">Semana</option>
                                        <option value="quincenal">Quincena</option>
                                        <option value="mensual">Mensual</option>
                                    </Form.Select>
                                </Form.Group>

                            </Col>
                        </Row>

                        <Row>
                            {/* monto cuota y suscripcion */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Monto de las cuotas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        name="monto_cuota"
                                        value={newUser.monto_cuota}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            {/* Selección de Cobrador */}
                            <Col md={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>N° Cuotas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        name="cant_cuotas_restantes"
                                        value={newUser.cant_cuotas_restantes}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>
                            {/* Cantidad de cuotas */}
                            <Col md={6}>

                                <Form.Group className="mb-3">
                                    <Form.Label>objeto entregado por la empresa</Form.Label>
                                    <Form.Control
                                        type="text"
                                        min={4}
                                        name="objeto_entregado"
                                        value={newUser.objeto_entregado}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                            </Col>

                            {/* Selección de Cobrador */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cobrador asigado</Form.Label>
                                    <Form.Select
                                        name="cobradorId"
                                        value={newUser.cobradorId}
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