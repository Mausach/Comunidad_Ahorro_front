import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { starCrearCliente } from '../../Helpers/AltaCliente';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearPrestamoCliente } from '../../Helpers/AltaPretamoCliente';
import { starCrearVentaPermutada } from '../../Helpers/AltaVtaPermutada';

export const ModalPermutaClienteExist = ({ showExistModal, handleCloseExistModal, setRefreshData, navigate, usuario, reporte, cobradores, producto }) => {

    const [newUser, setNewUser] = useState({ //usaremos user pero es de clientes esto luego se movera

        dni: '', // DNI único


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
        starCrearVentaPermutada(newUser, setRefreshData, navigate);

        // Resetear formulario
        setNewUser({

            dni: '', // DNI único


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