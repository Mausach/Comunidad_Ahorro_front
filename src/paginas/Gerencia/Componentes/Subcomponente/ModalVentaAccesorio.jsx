import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { starCrearVentaAcc } from '../../Helpers/AltaVentaAccesorio';

export const ModalVentaAccesorio = ({ 
    showModalAccesorio,
    handleCloseVentaAccesorioModal,
    setRefreshData, 
    navigate, 
    usuario,
    reporte, 
    producto  }) => {
    const [accesorio, setAccesorio] = useState('');
    const [monto, setMonto] = useState('');
    const [vendedor, setVendedor] = useState('');
    const [metodoPago, setMetodoPago] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const ventaData = {
            productoId: producto.id,
            reporteId:reporte,
            accesorio,
            monto,
            vendedor,
            metodoPago,
        };

        console.log('Venta de accesorio realizada:', ventaData);
        starCrearVentaAcc(ventaData,setRefreshData,navigate);
        handleClose();
    };

    return (
        <Modal show={showModalAccesorio} onHide={handleCloseVentaAccesorioModal}>
            <Modal.Header closeButton>
                <Modal.Title>Venta de Accesorio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Accesorio</Form.Label>
                        <Form.Control
                            type="text"
                            value={accesorio}
                            onChange={(e) => setAccesorio(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Vendedor</Form.Label>
                        <Form.Control
                            type="text"
                            value={vendedor}
                            onChange={(e) => setVendedor(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Metodo de pago</Form.Label>
                        <Form.Control
                            type="text"
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Confirmar Venta
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
