import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';

import { ModalCrearClientePrestamo } from './ModalCrearClientePrestamo';
import Swal from 'sweetalert2';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { ModalPrestamoClienteExist } from './ModalPrestamoClienteExist';
import { ModalCrearClientePlan } from './ModalCrearClientePlan';
import { ModalPlanClienteExist } from './ModalPlanClienteExist';
import { ModalVentaDirecta } from './ModalVentaDirecta';
import { ModalVentaPermutada } from './ModalVentaPermutada';
import { ModalVentaServicio } from './ModalVentaServico';
import { ModalVentaAccesorio } from './ModalVentaAccesorio';
import { ModalVentaDirExist } from './ModalVentaDirExistente';
import { ModalPermutaClienteNuevo } from './ModalpermutaClienteNuev';
import { ModalPermutaClienteExist } from './ModalPermutaExist';

export const VentaCardPlan = ({ producto, setRefreshData, navigate, usuario, reporte }) => {
    const {
        nombre,
        descripcion,
        tipo_cobranza_prestamo,
        monto_max_prestar,
        venta_directa_bandera,
        venta_permutada_bandera,
        servicio_bandera,
        accesorio_bandera,
    } = producto;

    const [cobradores, setCobradores] = useState([]); //estado para el usuario

    const [showCreateModal, setShowCreateModal] = useState(false); // Modal para crear usuario
    //cliente nuevo
    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const [showExistModal, setShowExistModal] = useState(false); // Modal para crear prestamo a cliente ya existente
    const [showVentaDirectaModal, setShowVentaDirectaModal] = useState(false); // Modal para venta directa
    const [showVentaDirExistModal, setShowVentaDirExistModal] = useState(false); // Modal para venta directa cliente existente
    const [showVentaPermutadaModal, setShowVentaPermutadaModal] = useState(false); // Modal para venta permutada
    const [showVentaPermutadaExistModal, setShowVentaPermutadaExistModal] = useState(false); // Modal para venta directa cliente existente
    const [showVentaServicioModal, setShowVentaServicioModal] = useState(false);//venta servicio
    const [showModalAccesorio, setShowModalAccesorio] = useState(false);//venta accesorios

    //plan cliente existente
    const handleShowExistModal = () => setShowExistModal(true);
    const handleCloseExistModal = () => setShowExistModal(false);
    // venta directa
    const handleShowVentaDirectaModal = () => setShowVentaDirectaModal(true);
    const handleCloseVentaDirectaModal = () => setShowVentaDirectaModal(false);
    //venta directa cliente existente
    const handleShowVentaDirExistModal = () => setShowVentaDirExistModal(true);
    const handleCloseVentaDirExistModal = () => setShowVentaDirExistModal(false);
    //venta permutada nuevo cliente
    const handleShowVentaPermutadaModal = () => setShowVentaPermutadaModal(true);
    const handleCloseVentaPermutadaModal = () => setShowVentaPermutadaModal(false);
     //venta permutada cliente existente
     const handleShowVentaPermutaExistModal = () => setShowVentaPermutadaExistModal(true);
     const handleCloseVentaPermutaExistModal = () => setShowVentaPermutadaExistModal(false);
    //venta de servidores
    const handleShowVentaServicioModal = () => setShowVentaServicioModal(true);
    const handleCloseVentaServicioModal = () => setShowVentaServicioModal(false);
    //venta de accesorios
    const handleShowVentaAccesorioModal = () => setShowModalAccesorio(true);
    const handleCloseVentaAccesorioModal = () => setShowModalAccesorio(false);


    const handleRealizarPrestamo = () => {
        Swal.fire({
            title: 'Seleccione una opción',
            text: '¿Desea realizar el préstamo para un cliente nuevo o uno existente?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cliente Nuevo',
            cancelButtonText: 'Cliente Existente',
        }).then((result) => {
            if (result.isConfirmed) {
                // Lógica para cliente nuevo
                handleShowCreateModal();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                handleShowExistModal();
                // Lógica para cliente existente
                // Aquí puedes manejar la lógica para un cliente existente
            }
        });
    };

    const handleRealizarVentaDirecta = () => {
        Swal.fire({
            title: 'Seleccione una opción',
            text: '¿Desea registrar una venta directa para para un cliente nuevo o uno existente?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cliente Nuevo',
            cancelButtonText: 'Cliente Existente',
        }).then((result) => {
            if (result.isConfirmed) {
                // Lógica para cliente nuevo
                handleShowVentaDirectaModal();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                handleShowVentaDirExistModal();
                // Lógica para cliente existente
                // Aquí puedes manejar la lógica para un cliente existente
            }
        });
    };

    const handleRealizarVentaPermutada = () => {
        Swal.fire({
            title: 'Seleccione una opción',
            text: '¿Desea registrar una venta permutada para para un cliente nuevo o uno existente?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Cliente Nuevo',
            cancelButtonText: 'Cliente Existente',
        }).then((result) => {
            if (result.isConfirmed) {
                // Lógica para cliente nuevo
                handleShowVentaPermutadaModal();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                handleShowVentaPermutaExistModal();
                // Lógica para cliente existente
                // Aquí puedes manejar la lógica para un cliente existente
            }
        });
    };

    // Función para guardar la venta directa
    const handleSaveVentaDirecta = (ventaDirecta) => {
        console.log('Venta Directa registrada:', ventaDirecta);
        // Aquí puedes enviar los datos de la venta directa a tu API o manejarlos en el estado global
        Swal.fire({
            icon: 'success',
            title: 'Venta Directa registrada',
            text: `Monto: $${ventaDirecta.monto}, Método de Pago: ${ventaDirecta.metodoPago}`,
        });
    };

    // Función para guardar la venta permutada
    const handleSaveVentaPermutada = (ventaPermutada) => {
        console.log('Venta Permutada registrada:', ventaPermutada);
        // Aquí puedes enviar los datos de la venta permutada a tu API o manejarlos en el estado global
        Swal.fire({
            icon: 'success',
            title: 'Venta Permutada registrada',
            text: `Objeto Recibido: ${ventaPermutada.objetoRecibido}, Valor: $${ventaPermutada.valorObjetoRecibido}`,
        });
    };

    useEffect(() => {

        CargarCobradores(setCobradores, navigate);

    }, [navigate]);


    return (
        <div>
            <Card>
                <Card.Header as="h5">Producto</Card.Header>
                <Card.Body>
                    <Card.Title>
                        {nombre}
                    </Card.Title>
                    <Card.Text>
                        <strong>Descripcion :</strong> {descripcion}
                    </Card.Text>
                    <Card.Text>
                        <strong>Monto Prestado:</strong> ${monto_max_prestar}
                    </Card.Text>


                    <Card.Text>
                        <strong>Tipo:</strong> {tipo_cobranza_prestamo}
                    </Card.Text>



                    {/* Posicionar el botón a la derecha */}
                    <div className="d-flex justify-content-between align-items-center">

                        {/* Botones de venta según las banderas */}
                        <div className="d-flex flex-wrap gap-2">
                            {venta_directa_bandera && (
                                <Button variant="primary" onClick={handleRealizarVentaDirecta}>
                                    Venta Directa
                                </Button>
                            )}
                            {venta_permutada_bandera && (
                                <Button variant="secondary" onClick={handleRealizarVentaPermutada}>
                                    Venta Permutada
                                </Button>
                            )}
                            {servicio_bandera && (
                                <Button variant="success" onClick={handleShowVentaServicioModal}>
                                    Venta de Servicios
                                </Button>
                            )}
                            {accesorio_bandera && (
                                <Button variant="warning" onClick={handleShowVentaAccesorioModal}>
                                    Venta de Accesorios
                                </Button>
                            )}
                        </div>

                        {/* Botón para realizar préstamo */}


                        <span></span>
                        <Button variant="primary" onClick={handleRealizarPrestamo}>Realizar prestamo</Button>
                    </div>
                </Card.Body>
            </Card>

            {/* modal para cliente nuevo */}
            <ModalCrearClientePlan showCreateModal={showCreateModal}
                handleCloseCreateModal={handleCloseCreateModal} setRefreshData={setRefreshData}
                navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} producto={producto} />

            {/* modal para cliente existente */}
            <ModalPlanClienteExist showExistModal={showExistModal}
                handleCloseExistModal={handleCloseExistModal} setRefreshData={setRefreshData}
                navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} producto={producto} />

            {/* modal para venta directa cliente nuevo */}
            <ModalVentaDirecta show={showVentaDirectaModal}
                handleClose={handleCloseVentaDirectaModal} setRefreshData={setRefreshData}
                navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} producto={producto} />

            {/* modal para cliente existente  en venta directa*/}
            <ModalVentaDirExist showExistModal={showVentaDirExistModal}
                handleCloseExistModal={handleCloseVentaDirExistModal} setRefreshData={setRefreshData}
                navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} producto={producto} />


            {/* modal para venta permutada d enuevo cliente */}
            <ModalPermutaClienteNuevo showCreateModal={showVentaPermutadaModal}
                handleCloseCreateModal={handleCloseVentaPermutadaModal} setRefreshData={setRefreshData}
                navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} producto={producto} />

             {/* modal para venta permutada cliente existente */}
            <ModalPermutaClienteExist showExistModal={showVentaPermutadaExistModal}
                handleCloseExistModal={handleCloseVentaPermutaExistModal} setRefreshData={setRefreshData}
                navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} producto={producto} />              



            <ModalVentaServicio showVentaServicioModal={showVentaServicioModal}
                handleCloseVentaServicioModal={handleCloseVentaServicioModal}
                setRefreshData={setRefreshData}
                navigate={navigate}
                usuario={usuario}
                reporte={reporte}
                producto={producto} />

            <ModalVentaAccesorio showModalAccesorio={showModalAccesorio}
                handleCloseVentaAccesorioModal={handleCloseVentaAccesorioModal}
                setRefreshData={setRefreshData}
                navigate={navigate}
                usuario={usuario}
                reporte={reporte}
                producto={producto} />

        </div>
    )
}
