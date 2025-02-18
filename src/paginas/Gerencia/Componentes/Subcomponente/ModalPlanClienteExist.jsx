import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearPlanCliente } from '../../Helpers/AltaPlanCliente';

export const ModalPlanClienteExist = ({ showExistModal, handleCloseExistModal, setRefreshData, navigate, usuario, reporte, cobradores, producto }) => {

    const [newUser, setNewUser] = useState({ //usaremos user pero es de clientes esto luego se movera

        dni: '', // DNI único

        //datos plan
        nombre: producto.nombre,
        objeto_venta: '',
        cantidad_cuotas: 0,
        numero_de_contraro: 0,
        suscripcion_inicial: 0,
        monto_cuota: 0,
        productoId: producto.id,
        tipo: 'mensual',

        //id de quien manda la venta
        vendedorId: usuario,
        cobradorId: 0,
        reporteId: reporte,//cobrador

        esNuevoCliente: false,



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

            'dni',

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





        // Enviar datos a la API
        console.log('Creando cliente:', newUser);

        starCrearPlanCliente(newUser, setRefreshData, navigate);

        // Resetear formulario
        setNewUser({

            dni: '', // DNI único

            //datos plan
            nombre: producto.nombre,
            objeto_venta: '',
            cantidad_cuotas: 0,
            numero_de_contraro: 0,
            suscripcion_inicial: 0,
            monto_cuota: 0,
            productoId: producto.id,
            tipo: 'mensual',

            //id de quien manda la venta
            vendedorId: usuario,
            cobradorId: 0,
            reporteId: reporte,//cobrador

            esNuevoCliente: false,
        });

        console.log(newUser)

        handleCloseExistModal();


    };


    return (
        <div>
            <Modal show={showExistModal} onHide={handleCloseExistModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Formulario de un Nuevo Prestamo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

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
                            {/* Producto y num de contrato */}


                        </Row>

                        <Row>
                            {/* Producto y num de contrato */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Producto en venta:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        min={0}
                                        name="objeto_venta"
                                        value={newUser.objeto_venta}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>N° de contrato </Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        name="numero_de_contraro"
                                        value={newUser.numero_de_contraro}
                                        onChange={handleChange}
                                    />
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
                                    <Form.Label>Suscripcion Inicial</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        name="suscripcion_inicial"
                                        value={newUser.suscripcion_inicial}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row>
                            {/* Cantidad de cuotas */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>N° Cuotas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        name="cantidad_cuotas"
                                        value={newUser.cantidad_cuotas}
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
                            <Button variant="secondary" onClick={handleCloseExistModal}>
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