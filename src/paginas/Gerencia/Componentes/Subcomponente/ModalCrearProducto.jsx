import React, { useEffect, useState } from 'react'
import { Accordion, Button, Form, Modal } from 'react-bootstrap';
import { starCrearProducto } from '../../Helpers/AltaProducto';
import Swal from 'sweetalert2';

export const ModalCrearProducto = ({ showModal, handleCloseModal, setRefreshData, navigate }) => {

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        descripcion: '',
        venta_directa_bandera: false,
        venta_permutada_bandera: false,
        accesorio_bandera: false,
        servicio_bandera: false,
        plan_bandera: false,
        plan_descripcion: '',
        cantidad_cuotas_plan: 0,
        monto_cuotas_plan: 0,
        entrega_pactada_bandera: false,
        cuotas_entrega_pactada: [],
    });

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setNuevoProducto({ ...nuevoProducto, [id]: checked });
        } else {
            setNuevoProducto({ ...nuevoProducto, [id]: value });
        }
    };

    const handleCheckboxChange = (e, field) => {
        setNuevoProducto({ ...nuevoProducto, [field]: e.target.checked });
    };

    const handleCreateProducto = (e) => {
        e.preventDefault(); // Prevenir la acción predeterminada del formulario

        console.log('Nuevo producto:', nuevoProducto);

        // Validar nombre
        if (!nuevoProducto.nombre || nuevoProducto.nombre.trim().length < 7  && !/^[a-zA-Z0-9\s]+$/.test(nuevoProducto.nombre)) {

            Swal.fire({
                icon: 'error',
                title: 'Nombre no valido',
                text: 'El nombre debe tener al menos 7 caracteres y solo puede contener letras, números y espacios.',
            });
            return;
        }


        // Validar descripción
        if (!nuevoProducto.descripcion || nuevoProducto.descripcion.trim().length < 8 && !/^[a-zA-Z0-9\s]+$/.test(nuevoProducto.descripcion)) {

            Swal.fire({
                icon: 'error',
                title: 'Descripcion no valida',
                text: 'La descripción debe tener al menos 8 caracteres y solo puede contener letras, números y espacios.',
            });
            return;

        }

        // Validar plan si está marcado
        if (nuevoProducto.plan_bandera) {
            if (!nuevoProducto.plan_descripcion || nuevoProducto.plan_descripcion.trim().length < 8 && !/^[a-zA-Z0-9\s]+$/.test(nuevoProducto.plan_descripcion)) {

                Swal.fire({
                    icon: 'error',
                    title: 'Descripcion del plan no valida',
                    text: 'La descripción del plan debe tener al menos 8 caracteres y solo puede contener letras, números y espacios.',
                });
                return;

            }
            if (!nuevoProducto.cantidad_cuotas_plan || nuevoProducto.cantidad_cuotas_plan <= 0) {

                Swal.fire({
                    icon: 'error',
                    title: 'Cantidad de cuotas no valido',
                    text: 'La cantidad de cuotas debe ser mayor a 0.',
                });
                return;

            }
            if (!nuevoProducto.monto_cuotas_plan || nuevoProducto.monto_cuotas_plan <= 0) {


                Swal.fire({
                    icon: 'error',
                    title: 'Monto de cuotas no valido',
                    text: 'El monto de las cuotas debe ser mayor a 0.',
                });
                return;


            }
        }

        // Validar entrega pactada si está marcada
        // Validar entrega pactada si está marcada
        if (nuevoProducto.entrega_pactada_bandera) {
            if (
                !nuevoProducto.cuotas_entrega_pactada ||
                nuevoProducto.cuotas_entrega_pactada.length === 0
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cuotas para la entrega no válidas',
                    text: 'Debe ingresar al menos una cuota para la entrega pactada.',
                });
                return;
            }

            // Validar que las cuotas no contengan ceros ni valores repetidos
            const cuotasUnicas = [...new Set(nuevoProducto.cuotas_entrega_pactada.map(Number))];
            const contieneCero = cuotasUnicas.includes(0);

            if (contieneCero) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cuotas inválidas',
                    text: 'Las cuotas no pueden contener el valor 0.',
                });
                return;
            }

            if (cuotasUnicas.length !== nuevoProducto.cuotas_entrega_pactada.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cuotas duplicadas',
                    text: 'No puede ingresar cuotas repetidas.',
                });
                return;
            }
        }

        //validaciones

        starCrearProducto(nuevoProducto, setRefreshData, navigate)
        console.log('producto creado', nuevoProducto)
        // Limpiar el estado después de crear el producto
        setNuevoProducto({
            nombre: '',
            descripcion: '',
            venta_directa_bandera: false,
            venta_permutada_bandera: false,
            accesorio_bandera: false,
            servicio_bandera: false,
            plan_bandera: false,
            plan_descripcion: '',
            cantidad_cuotas_plan: 0,
            monto_cuotas_plan: 0,
            entrega_pactada_bandera: false,
            cuotas_entrega_pactada: [],
        });

        // Cerrar el modal
        handleCloseModal();


    };

      // Efecto para manejar el cierre del modal
      // Restablecer estilos del body cuando el modal se cierra
    useEffect(() => {
        if (!showModal) {
            document.body.style.paddingRight = '';
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
    }, [showModal]);


    return (
        <div>
            {/* Modal para crear un nuevo producto */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear un Nuevo Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateProducto}>
                        {/* Nombre */}
                        <Form.Group controlId="nombre">
                            <Form.Label>Nombre del Producto</Form.Label>
                            <Form.Control
                                type="text"
                                minLength={7}
                                maxLength={30}
                                placeholder="Ingrese el nombre"
                                value={nuevoProducto.nombre}
                                onChange={handleInputChange}
                                isInvalid={!nuevoProducto.nombre} // Muestra error si está vacío
                                required

                            />
                        </Form.Group>

                        {/* Descripción */}
                        <Form.Group controlId="descripcion" className="mt-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                minLength={8}

                                placeholder="Ingrese una descripción"
                                value={nuevoProducto.descripcion}
                                onChange={handleInputChange}
                                isInvalid={!nuevoProducto.descripcion} // Muestra error si está vacío
                                required
                            />
                        </Form.Group>

                        {/* Checkbox para Plan */}
                        <Form.Group controlId="plan_bandera" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Es un plan?"
                                checked={nuevoProducto.plan_bandera}
                                onChange={(e) => handleCheckboxChange(e, 'plan_bandera')}
                            />
                        </Form.Group>

                        {/* Acordeón para Plan */}
                        {nuevoProducto.plan_bandera && (
                            <Accordion defaultActiveKey="0" className="mt-3">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Detalles del Plan</Accordion.Header>
                                    <Accordion.Body>
                                        <Form.Group controlId="plan_descripcion">
                                            <Form.Label>Descripción del Plan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                minLength={8}

                                                placeholder="Ingrese la descripción del plan"
                                                value={nuevoProducto.plan_descripcion}
                                                onChange={handleInputChange}
                                                isInvalid={!nuevoProducto.plan_descripcion} // Muestra error si está vacío
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="cantidad_cuotas_plan" className="mt-3">
                                            <Form.Label>Cantidad de Cuotas</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Ingrese la cantidad de cuotas"
                                                value={nuevoProducto.cantidad_cuotas_plan}
                                                onChange={handleInputChange}
                                                isInvalid={!nuevoProducto.cantidad_cuotas_plan} // Muestra error si está vacío
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="monto_cuotas_plan" className="mt-3">
                                            <Form.Label>Monto de las Cuotas</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Ingrese el monto de las cuotas"
                                                value={nuevoProducto.monto_cuotas_plan}
                                                onChange={handleInputChange}
                                                isInvalid={!nuevoProducto.monto_cuotas_plan} // Muestra error si está vacío
                                                required
                                            />
                                        </Form.Group>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )}

                        {/* Checkbox para Entrega Pactada */}
                        <Form.Group controlId="entrega_pactada_bandera" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Es una entrega pactada?"
                                checked={nuevoProducto.entrega_pactada_bandera}
                                onChange={(e) => handleCheckboxChange(e, 'entrega_pactada_bandera')}
                            />
                        </Form.Group>

                        {/* Acordeón para Entrega Pactada */}
                        {nuevoProducto.entrega_pactada_bandera && (
                            <Accordion defaultActiveKey="0" className="mt-3">
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Detalles de Entrega Pactada</Accordion.Header>
                                    <Accordion.Body>
                                        <Form.Group controlId="cuotas_entrega_pactada">
                                            <Form.Label>Cuotas de Entrega Pactada</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ejemplo: 3,5,7,9,12"
                                                value={nuevoProducto.cuotas_entrega_pactada.join(', ')}
                                                onChange={(e) => {
                                                    const cuotas = e.target.value
                                                        .split(',')
                                                        .map((item) => item.trim());
                                                    setNuevoProducto({
                                                        ...nuevoProducto,
                                                        cuotas_entrega_pactada: cuotas,
                                                    });
                                                }}
                                                
                                            />
                                        </Form.Group>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )}

                        {/* Checkbox para Venta Directa */}
                        <Form.Group controlId="venta_directa_bandera" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Es venta directa?"
                                checked={nuevoProducto.venta_directa_bandera}
                                onChange={(e) => handleCheckboxChange(e, 'venta_directa_bandera')}
                            />
                        </Form.Group>

                        {/* Checkbox para Venta Permutada */}
                        <Form.Group controlId="venta_permutada_bandera" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Es venta permutada?"
                                checked={nuevoProducto.venta_permutada_bandera}
                                onChange={(e) => handleCheckboxChange(e, 'venta_permutada_bandera')}
                            />
                        </Form.Group>

                        {/* Checkbox para Accesorios */}
                        <Form.Group controlId="accesorio_bandera" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Es un accesorio?"
                                checked={nuevoProducto.accesorio_bandera}
                                onChange={(e) => handleCheckboxChange(e, 'accesorio_bandera')}
                            />
                        </Form.Group>

                        {/* Checkbox para Servicios */}
                        <Form.Group controlId="servicio_bandera" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Es un servicio?"
                                checked={nuevoProducto.servicio_bandera}
                                onChange={(e) => handleCheckboxChange(e, 'servicio_bandera')}
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Guardar
                            </Button>
                        </Modal.Footer>

                    </Form>
                </Modal.Body>

            </Modal>


        </div>
    )
}
