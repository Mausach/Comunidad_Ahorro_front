import React, { useEffect, useRef, useState } from "react";
import { Carousel, Card, Button, Modal, Form, ListGroup, Badge, Row, Col } from "react-bootstrap";
import gsap from "gsap";
import Swal from "sweetalert2";
import { starEliminarEquipoVenta } from "../../Helpers/EliminarEquipoVenta";
import { starEditarEquipoVenta } from "../../Helpers/EditarEquipoVenta";

const CardsEquiposVentas = ({ equipos, users, setRefreshData, navigate }) => {
  const cardRefs = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre_equipo: "", id_supervisor: "", vendedores: [] });

  useEffect(() => {
    if (equipos.length > 0) {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
      );
    } else {
      cardRefs.current = []; // Limpiar las referencias si no hay equipos
    }
  }, [equipos]);

  const handleEdit = (equipo) => {
    setEquipoEditando(equipo);
    setFormData({
      nombre_equipo: equipo.nombre_equipo,
      id_supervisor: equipo.id_supervisor,
      vendedores: equipo.vendedores.map((v) => v.id), // Solo los IDs de los vendedores
    });
    setShowModal(true);
  };

  const saveChanges = async () => {
    const updatedEquipo = {
      id: equipoEditando.id, // Asegúrate de incluir el ID del equipo
      nombre_equipo: formData.nombre_equipo,
      id_supervisor: formData.id_supervisor,
      vendedores: formData.vendedores.map((id) => ({
        id,
        nombres: users.find((user) => user.id === id).nombres,
        apellido: users.find((user) => user.id === id).apellido,
      })),
    };
  
    console.log("Enviando datos al backend:", updatedEquipo);
    await starEditarEquipoVenta(updatedEquipo, setRefreshData, navigate);
    setShowModal(false);
  };

  const handleDelete = async (equipoId) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (confirmacion.isConfirmed) {
      await starEliminarEquipoVenta(equipoId, setRefreshData, navigate);
    }
  };

  // Filtrar supervisores y vendedores
  const filteredSupervisors = users?.filter(user => user.rol?.nombre === "supervisor_ventas") || [];
  const filteredSellers = users?.filter(user => user.rol?.nombre === "vendedor") || [];

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <Row className="d-flex justify-content-center">
          {equipos.map((equipo, index) => (
            <Col key={equipo.id} xs={12} sm={6} md={3} lg={3} className="mb-4">
              <Card ref={(el) => (cardRefs.current[index] = el)} style={{ width: "100%", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }} className="shadow-lg rounded-5">
                <Card.Body>
                  <Card.Title>{equipo.nombre_equipo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Supervisor: {equipo.supervisor.nombres} {equipo.supervisor.apellido}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Vendedores:</strong>
                    <ul>
                      {equipo.vendedores.map((vendedor, idx) => (
                        <li key={idx}>{vendedor.nombres} {vendedor.apellido}</li>
                      ))}
                    </ul>
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleEdit(equipo)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(equipo.id)} className="ms-2">Eliminar</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Nombre del equipo */}
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Equipo</Form.Label>
              <Form.Control
                type="text"
                name="nombre_equipo"
                value={formData.nombre_equipo}
                onChange={(e) => setFormData({ ...formData, nombre_equipo: e.target.value })}
              />
            </Form.Group>

            {/* Selección de Supervisor */}
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Supervisor</Form.Label>
              <Form.Select
                name="id_supervisor"
                value={formData.id_supervisor}
                onChange={(e) => setFormData({ ...formData, id_supervisor: e.target.value })}
              >
                <option value="">Seleccione un supervisor</option>
                {filteredSupervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.nombres} ({sup.rol.nombre})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Selección de Vendedores */}
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Vendedores</Form.Label>
              <Form.Select
                onChange={(e) => {
                  const sellerId = parseInt(e.target.value);
                  if (!formData.vendedores.includes(sellerId)) {
                    setFormData((prev) => ({
                      ...prev,
                      vendedores: [...prev.vendedores, sellerId],
                    }));
                  }
                }}
                value=""
              >
                <option value="">Seleccione un vendedor</option>
                {filteredSellers
                  .filter((seller) => !formData.vendedores.includes(seller.id) && seller.id !== formData.id_supervisor)
                  .map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.nombres} {seller.apellido}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            {/* Lista de Vendedores Seleccionados */}
            <ListGroup className="mt-3">
              {formData.vendedores.map((id) => {
                const seller = users.find((user) => user.id === id);
                return (
                  <ListGroup.Item key={id} className="d-flex justify-content-between align-items-center">
                    {seller.nombres} {seller.apellido}
                    <Badge bg="danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveSeller(id)}>
                      X
                    </Badge>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={saveChanges}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CardsEquiposVentas;