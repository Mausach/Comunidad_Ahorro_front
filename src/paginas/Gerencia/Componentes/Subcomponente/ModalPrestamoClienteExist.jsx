import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { starCrearCliente } from '../../Helpers/AltaCliente';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearPrestamoCliente } from '../../Helpers/AltaPretamoCliente';

export const ModalPrestamoClienteExist = ({ showExistModal, handleCloseExistModal, setRefreshData, navigate, usuario, reporte, cobradores,prestamoNombre }) => {

    const [newUser, setNewUser] = useState({ //usaremos user pero es de clientes esto luego se movera

        dni: '', // DNI único


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
        starCrearPrestamoCliente(newUser, setRefreshData, navigate);

        // Resetear formulario
        setNewUser({

            dni: '', // DNI único


            //estos datos son del prestamo
            monto_prestado: 0,
            interes_agregado: 0,
            tipo: '',
            cantidad_tipo: 0,

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
