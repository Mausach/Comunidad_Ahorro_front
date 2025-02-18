import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { starCrearCliente } from '../../Helpers/AltaCliente';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { starCrearVentaDirecta } from '../../Helpers/AltaVentaDirecta';

export const ModalVentaDirExist = ({ showExistModal, handleCloseExistModal, setRefreshData, navigate, usuario, reporte, cobradores, producto }) => {

    const [newUser, setNewUser] = useState({ //usaremos user pero es de clientes esto luego se movera

        dni: '', // DNI único

        //datos venta directa
        nombreProd: producto.nombre,
        objeto_en_venta: '',
        monto: 0,
        metodoPago: '',
        productoId: producto.id,

        //id de quien manda la venta
        vendedorId: usuario,
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
        starCrearVentaDirecta(newUser, setRefreshData, navigate);

        // Resetear formulario
        setNewUser({

            dni: '', // DNI único


            //estos datos son del prestamo
            nombreProd: producto.nombre,
            objeto_en_venta: '',
            monto: 0,
            metodoPago: '',
            productoId: producto.id,

            //id de quien manda la venta
            vendedorId: usuario,
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