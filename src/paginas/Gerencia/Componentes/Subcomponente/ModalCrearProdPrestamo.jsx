import React, { useState } from 'react'
import { Accordion, Button, Form, Modal } from 'react-bootstrap';
import { starCrearProducto } from '../../Helpers/AltaProducto';
import Swal from 'sweetalert2';

export const ModalCrearProdPrestamo = ({ showModal, handleCloseModal, setRefreshData, navigate }) => {

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        descripcion: '',
        prestamo_bandera: true,
        monto_max_prestar: 0,
        tipo_cobranza_prestamo: [],
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setNuevoProducto((prev) => {
                const selectedCobranza = prev.tipo_cobranza_prestamo;
                return {
                    ...prev,
                    tipo_cobranza_prestamo: checked
                        ? [...selectedCobranza, value]
                        : selectedCobranza.filter((item) => item !== value),
                };
            });
        } else {
            setNuevoProducto({ ...nuevoProducto, [name]: value });
        }
    };


    const handleCreateProducto = (e) => {
        e.preventDefault(); // Prevenir la acción predeterminada del formulario

        console.log('Nuevo producto:', nuevoProducto);

        // Validar nombre
        if (!nuevoProducto.nombre || nuevoProducto.nombre.trim().length < 7 && !/^[a-zA-Z0-9\s]+$/.test(nuevoProducto.nombre)) {
            Swal.fire({
                icon: 'error',
                title: 'Nombre no válido',
                text: 'El nombre debe tener al menos 7 caracteres y solo puede contener letras, números y espacios.',
            });
            return;
        }

        // Validar descripción
        if (!nuevoProducto.descripcion || nuevoProducto.descripcion.trim().length < 8 && !/^[a-zA-Z0-9\s]+$/.test(nuevoProducto.descripcion)) {
            Swal.fire({
                icon: 'error',
                title: 'Descripción no válida',
                text: 'La descripción debe tener al menos 8 caracteres y solo puede contener letras, números y espacios.',
            });
            return;
        }

        // Validar préstamo si está marcado
        if (nuevoProducto.prestamo_bandera) {
            if (!nuevoProducto.monto_max_prestar || nuevoProducto.monto_max_prestar <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Monto máximo no válido',
                    text: 'El monto máximo a prestar debe ser mayor a 0.',
                });
                return;
            }

            if (!nuevoProducto.tipo_cobranza_prestamo || nuevoProducto.tipo_cobranza_prestamo.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Tipo de cobranza no válido',
                    text: 'Debe seleccionar al menos un tipo de cobranza (diario, semanal, quincenal, mensual).',
                });
                return;
            }
        }

        // Si todas las validaciones pasan, proceder a crear el producto
        starCrearProducto(nuevoProducto, setRefreshData, navigate);
        console.log('Producto creado:', nuevoProducto);

        // Limpiar el estado después de crear el producto
        setNuevoProducto({
            nombre: '',
            descripcion: '',
            prestamo_bandera: true,
            monto_max_prestar: 0,
            tipo_cobranza_prestamo: [],
        });

        // Cerrar el modal
        handleCloseModal();
    };


    return (
        <div>
            {/* Modal para crear un nuevo producto */}

            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Producto Prestamo</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleCreateProducto}>
                        <Form.Group controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={nuevoProducto.nombre}
                                onChange={handleInputChange}
                                isInvalid={!nuevoProducto.nombre} // Muestra error si está vacío
                                required

                            />

                        </Form.Group>

                        <Form.Group controlId="descripcion" className="mt-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                value={nuevoProducto.descripcion}
                                onChange={handleInputChange}
                                isInvalid={!nuevoProducto.descripcion} // Muestra error si está vacío
                                required

                            />

                        </Form.Group>

                        <Form.Group controlId="monto_max_prestar" className="mt-3">
                            <Form.Label>Monto Máximo a Prestar</Form.Label>
                            <Form.Control
                                type="number"
                                name="monto_max_prestar"
                                value={nuevoProducto.monto_max_prestar}
                                onChange={handleInputChange}
                                isInvalid={!nuevoProducto.monto_max_prestar} // Muestra error si está vacío
                                required

                            />

                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Tipo de Cobranza</Form.Label>
                            <div>
                                {["diario", "semanal", "quincenal", "mensual"].map((tipo_cobranza_prestamo) => (
                                    <Form.Check
                                        key={tipo_cobranza_prestamo}
                                        inline
                                        label={tipo_cobranza_prestamo.charAt(0).toUpperCase() + tipo_cobranza_prestamo.slice(1)}
                                        name="tipo_cobranza_prestamo"
                                        value={tipo_cobranza_prestamo}
                                        type="checkbox"
                                        checked={nuevoProducto.tipo_cobranza_prestamo.includes(tipo_cobranza_prestamo)}
                                        onChange={handleInputChange}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                        <Modal.Footer>

                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" type="submit" >
                                Guardar
                            </Button>

                        </Modal.Footer>



                    </Form>
                </Modal.Body>

            </Modal>


        </div>
    )
}
