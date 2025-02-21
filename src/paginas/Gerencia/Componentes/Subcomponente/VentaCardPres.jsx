import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';

import { ModalCrearClientePrestamo } from './ModalCrearClientePrestamo';
import Swal from 'sweetalert2';
import { CargarCobradores } from '../../Helpers/CargarCobradores';
import { ModalPrestamoClienteExist } from './ModalPrestamoClienteExist';

export const VentaCardPres = ({ prestamo, setRefreshData, navigate, usuario, reporte }) => {
    const { //revisar si me lo manda bien , por que es un solo objeto pero se lo envia como si mapearan un array
        nombre,
        descripcion,
        tipo_cobranza_prestamo,
        monto_max_prestar
    } = prestamo;

    const [cobradores, setCobradores] = useState([]); //estado para el usuario

    const [showCreateModal, setShowCreateModal] = useState(false); // Modal para crear usuario

    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleCloseCreateModal = () => setShowCreateModal(false);

    const [showExistModal, setShowExistModal] = useState(false); // Modal para crear prestamo a cliente ya existente

    const handleShowExistModal = () => setShowExistModal(true);
    const handleCloseExistModal = () => setShowExistModal(false);


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

    useEffect(() => {

        CargarCobradores(setCobradores, navigate);

    }, [navigate]);


    return (
        <div>
            <Card className='shadow-lg  rounded-5'>
                <Card.Header as="h5">Prestamo</Card.Header>
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
    <strong>Tipo:</strong>
    <ul>
        {tipo_cobranza_prestamo.map((tipo, index) => (
            <li key={index}>{tipo}</li>
        ))}
    </ul>
</Card.Text>
                   
                    {/* Posicionar el botón a la derecha */}
                    <div className="d-flex justify-content-between align-items-center">
                        <span></span>
                        <Button variant="primary" onClick={handleRealizarPrestamo}>Realizar prestamo</Button>
                    </div>
                </Card.Body>
            </Card>

            {/* modal para cliente nuevo */}
            <ModalCrearClientePrestamo showCreateModal={showCreateModal}
             handleCloseCreateModal={handleCloseCreateModal} setRefreshData={setRefreshData}
              navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} prestamoNombre={nombre} tipoCobranza={tipo_cobranza_prestamo}/>

            {/* modal para cliente existente */}
              <ModalPrestamoClienteExist showExistModal={showExistModal}
             handleCloseExistModal={handleCloseExistModal} setRefreshData={setRefreshData}
              navigate={navigate} usuario={usuario} reporte={reporte} cobradores={cobradores} prestamoNombre={nombre} tipoCobranza={tipo_cobranza_prestamo}/>


        </div>
    )
}
