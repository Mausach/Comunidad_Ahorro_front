import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { starCrearPeriodoReporte } from '../../Helpers/AltaPeriodoReporte';

//de momento no se usa
export const ModalCrearPeriodo = ({ showModal, setShowModal, setRefreshData, navigate }) => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validación básica
        if (!startDate || !endDate) {

            Swal.fire({
                icon: 'error',
                title: 'fecha no valido',
                text: 'Por favor, completa ambas fechas.',
            });


            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            

            Swal.fire({
                icon: 'error',
                title: 'fecha no valido',
                text: 'La fecha de inicio debe ser anterior a la fecha de fin.',
            });

            return;
        }

        // Envía las fechas al backend
        //handleCreatePeriodo({ fecha_inicio: startDate, fecha_fin: endDate });

        console.log(startDate, endDate);
        
        starCrearPeriodoReporte(startDate,endDate,setRefreshData,navigate)


        // Reinicia los campos y cierra el modal
        setStartDate('');
        setEndDate('');
        setShowModal(false);
    };

    return (
        <div>
            {/* Modal para seleccionar fechas */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Fechas del Periodo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Inicio</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Fin</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Modal.Footer>
                    </Form>
                    
                </Modal.Body>

            </Modal>

        </div>
    )
}
