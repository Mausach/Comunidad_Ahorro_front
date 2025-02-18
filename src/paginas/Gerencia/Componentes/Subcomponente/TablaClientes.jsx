import React, { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { ModalEditCliente } from './ModaleDITcLIENTE.JSX';

export const TablaClientes = ({ clientes, setRefreshData, navigate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Manejo del modal de edición
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  // Filtrado de clientes basado en el término de búsqueda
  const filteredClientes = clientes.filter(cliente =>
    Object.values(cliente).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4">
      <h2>Gestión de Clientes</h2>

      {/* Buscador */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* Lista de clientes */}
      <ListGroup className="card text-dark shadow p-3 mb-5 bg-white rounded m-3">
        {filteredClientes.length > 0 ? (
          filteredClientes
            .sort((a, b) => a.apellido.localeCompare(b.apellido)) // Ordenar por apellido A-Z
            .map((cliente) => (
              <ListGroup.Item key={cliente.id} className="d-flex justify-content-between align-items-center">
                <div className="row w-100">
                  <div className="col-8">
                    <span>
                      {cliente.nombre} {cliente.apellido}
                    </span>
                  </div>

                  <div className="col-4">
                    {/* Botones en fila */}
                    <div className="d-flex flex-wrap justify-content-end">
                      {/* Ver detalles aqui iria el boton */}
                     

                      {/* Editar datos */}
                      <Button variant="outline-primary" onClick={() => handleShowModal(cliente)} className="me-2 mb-2">
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))
        ) : (
          <ListGroup.Item className="text-center">No hay clientes registrados.</ListGroup.Item>
        )}
      </ListGroup>

      {/* Modal de edición */}
      <ModalEditCliente 
        showModal={showModal} 
        handleCloseModal={handleCloseModal} 
        selectedCliente={selectedCliente} 
        setSelectedCliente={setSelectedCliente} 
        setRefreshData={setRefreshData} 
        navigate={navigate} 
      />
    </div>
  );
};
