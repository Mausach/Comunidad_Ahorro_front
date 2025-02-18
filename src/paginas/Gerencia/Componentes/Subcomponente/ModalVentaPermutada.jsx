import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export const ModalVentaPermutada = ({ show, handleClose, handleSave, producto, vendedor }) => {
  const [objetoRecibido, setObjetoRecibido] = useState('');
  const [valorObjetoRecibido, setValorObjetoRecibido] = useState(0);
  const [objetoEntregado, setObjetoEntregado] = useState('');
  const [montoAdicionalRecibido, setMontoAdicionalRecibido] = useState(0);
  const [cuotasRestantes, setCuotasRestantes] = useState(0);
  const [montoCuotas, setMontoCuotas] = useState(0);
  const [nombreCliente, setNombreCliente] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (
      !objetoRecibido.trim() ||
      valorObjetoRecibido <= 0 ||
      !objetoEntregado.trim() ||
      montoAdicionalRecibido < 0 ||
      cuotasRestantes < 0 ||
      montoCuotas < 0 ||
      !nombreCliente.trim()
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos o inválidos',
        text: 'Todos los campos son obligatorios y los valores numéricos deben ser válidos.',
      });
      return;
    }

    // Crear el objeto de venta permutada
    const ventaPermutada = {
      objetoRecibido,
      valorObjetoRecibido,
      objetoEntregado,
      montoAdicionalRecibido,
      cuotasRestantes,
      montoCuotas,
      nombreCliente,
      comisionVendedor: vendedor.comision, // Comisión del vendedor
      clienteId: null, // Aquí puedes agregar la lógica para obtener el clienteId si es necesario
      vendedorId: vendedor.id, // ID del vendedor
      productoId: producto.id, // ID del producto
    };

    // Llamar a la función handleSave con los datos de la venta permutada
    handleSave(ventaPermutada);

    // Limpiar el formulario y cerrar el modal
    setObjetoRecibido('');
    setValorObjetoRecibido(0);
    setObjetoEntregado('');
    setMontoAdicionalRecibido(0);
    setCuotasRestantes(0);
    setMontoCuotas(0);
    setNombreCliente('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Venta Permutada</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="objetoRecibido">
            <Form.Label>Objeto Recibido</Form.Label>
            <Form.Control
              type="text"
              value={objetoRecibido}
              onChange={(e) => setObjetoRecibido(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="valorObjetoRecibido">
            <Form.Label>Valor del Objeto Recibido</Form.Label>
            <Form.Control
              type="number"
              value={valorObjetoRecibido}
              onChange={(e) => setValorObjetoRecibido(parseFloat(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="objetoEntregado">
            <Form.Label>Objeto Entregado</Form.Label>
            <Form.Control
              type="text"
              value={objetoEntregado}
              onChange={(e) => setObjetoEntregado(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="montoAdicionalRecibido">
            <Form.Label>Monto Adicional Recibido</Form.Label>
            <Form.Control
              type="number"
              value={montoAdicionalRecibido}
              onChange={(e) => setMontoAdicionalRecibido(parseFloat(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="cuotasRestantes">
            <Form.Label>Cantidad de Cuotas Restantes</Form.Label>
            <Form.Control
              type="number"
              value={cuotasRestantes}
              onChange={(e) => setCuotasRestantes(parseInt(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="montoCuotas">
            <Form.Label>Monto de Cuotas</Form.Label>
            <Form.Control
              type="number"
              value={montoCuotas}
              onChange={(e) => setMontoCuotas(parseFloat(e.target.value))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="nombreCliente">
            <Form.Label>Nombre del Cliente</Form.Label>
            <Form.Control
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};