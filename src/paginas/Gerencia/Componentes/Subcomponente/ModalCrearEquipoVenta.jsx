import React, { useState } from "react";
import { Button, Modal, Form, ListGroup, Badge } from "react-bootstrap";
import { starCrearEquipoVenta } from "../../Helpers/AltaEqupoVenta";
import Swal from "sweetalert2";

const ModalCrearEquipoVenta = ({
    showCreateEquipoven,
    handleCloseCreateEquipo,
    setRefreshData,
    navigate,
    roles,
    users
}) => {
    const [equipoNombre, setEquipoNombre] = useState("");
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [selectedSellers, setSelectedSellers] = useState([]);

    // Filtrar supervisores y vendedores
    const filteredSupervisors = users?.filter(user => user.rol?.nombre === "supervisor_ventas") || [];
    const filteredSellers = users?.filter(user => user.rol?.nombre === "vendedor") || [];

    // Manejar selección de supervisor
    const handleSelectSupervisor = (event) => {
        const supervisor = users.find(user => user.id === parseInt(event.target.value));
        setSelectedSupervisor(supervisor);
        setSelectedSellers(prev => prev.filter(seller => seller.id !== supervisor?.id));
    };

    // Manejar selección de vendedores
    const handleSelectSeller = (event) => {
        const seller = users.find(user => user.id === parseInt(event.target.value));
        if (seller && !selectedSellers.some(s => s.id === seller.id)) {
            setSelectedSellers(prev => [...prev, { id: seller.id, nombres: seller.nombres, apellido: seller.apellido }]);
        }
    };

    // Eliminar un vendedor de la lista
    const handleRemoveSeller = (sellerId) => {
        setSelectedSellers(prev => prev.filter(seller => seller.id !== sellerId));
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!equipoNombre.trim()) {
            alert("Ingrese un nombre para el equipo");
            return;
        }
        if (!selectedSupervisor) {
            alert("Seleccione un supervisor");
            return;
        }
        if (selectedSellers.length === 0) {
            alert("Seleccione al menos un vendedor");
            return;
        }
    
        // Mostrar SweetAlert de confirmación antes de crear el equipo
        const confirmacion = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas crear este equipo de ventas?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, crear",
            cancelButtonText: "Cancelar",
        });
    
        if (confirmacion.isConfirmed) {
            const equipoVenta = {
                nombre_equipo: equipoNombre,
                id_supervisor: selectedSupervisor.id,
                vendedores: selectedSellers
            };
    
            console.log(equipoVenta);
    
            // Llamada a la función para crear el equipo
            await starCrearEquipoVenta(equipoVenta, setRefreshData, navigate);
    
            // Resetear campos del formulario
            setEquipoNombre("");
            setSelectedSupervisor(null);
            setSelectedSellers([]);
    
            // Cerrar el modal o formulario de creación
            handleCloseCreateEquipo();
        }
    };
    return (
        <Modal show={showCreateEquipoven} onHide={handleCloseCreateEquipo} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Equipo de Venta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Nombre del equipo */}
                    <Form.Group>
                        <Form.Label>Nombre del Equipo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="ej: Equipo 1"
                            value={equipoNombre}
                            onChange={(e) => setEquipoNombre(e.target.value)}
                            isInvalid={!equipoNombre} // Muestra error si está vacío
                            required
                            
                        />
                    </Form.Group>

                    {/* Supervisor */}
                    <Form.Group className="mt-3">
                        
                        <Form.Select 
                        onChange={handleSelectSupervisor} value={selectedSupervisor?.id || ""}
                        isInvalid={!selectedSupervisor} // Muestra error si está vacío
                        required
                        >
                            <option value="">Seleccione un supervisor</option>
                            {filteredSupervisors.map(sup => (
                                <option key={sup.id} value={sup.id}>
                                    {sup.nombres} 
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Vendedores */}
                    <Form.Group className="mt-3">
                        
                        <Form.Select 
                        onChange={handleSelectSeller} value=""
                        
                        >
                            <option value="">Seleccione los vendedores</option>
                            {filteredSellers
                                .filter(seller => !selectedSellers.some(s => s.id === seller.id) && seller.id !== selectedSupervisor?.id)
                                .map(seller => (
                                    <option key={seller.id} value={seller.id}>
                                        {seller.nombres} {seller.apellido}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Lista de vendedores seleccionados */}
                    <ListGroup className="mt-3">
                        {selectedSellers.map(seller => (
                            <ListGroup.Item key={seller.id} className="d-flex justify-content-between align-items-center">
                                {seller.nombres} {seller.apellido}
                                <Badge bg="danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveSeller(seller.id)}>X</Badge>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    {/* Botón */}
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Crear Equipo</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCrearEquipoVenta;
