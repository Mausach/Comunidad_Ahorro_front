import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, ListGroup, Accordion, Card, Badge } from 'react-bootstrap';
import { CargarProductosClienteCuota } from '../../Helpers/CargarProductosClienteCuota';
import CuotaItem from './CoutaItem';

export const ListaClientes = ({ clientes, navigate, usuario }) => {

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCards, setShowCards] = useState(false);
  const [refreshData, setRefreshData] = useState(false);//estado para refrescar

  const [productos, setProductos] = useState([]);  // Almacena planes, préstamos, ventas permutadas y ventas directas
  const [cuotas, setCuotas] = useState({});  // Un objeto donde cada clave es un ID de producto y su valor es la lista de cuotas


  const handleCloseDetailsModal = () => setShowDetailsModal(false);
  const handleShowDetailsModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowDetailsModal(true);
  };

  const handleShowCards = (cliente) => {
    setSelectedCliente(cliente);
    setShowCards(true);

  };

  const handleBackToList = () => {
    setShowCards(false);
    setSelectedCliente(null);
  };

  const filteredClientes = clientes.filter(cliente =>
    Object.values(cliente).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    if (selectedCliente?.id) {
      if (refreshData) {
        CargarProductosClienteCuota(selectedCliente.id, setProductos, setCuotas, navigate)
        setRefreshData(false);
      } else {
        CargarProductosClienteCuota(selectedCliente.id, setProductos, setCuotas, navigate)
      }
    }

  }, [selectedCliente, navigate, refreshData]);

  return (
    <div className="p-4">
      <h2>Gestión de Clientes</h2>

      {!showCards ? (
        <>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <ListGroup className="card text-dark shadow p-3 mb-5 bg-white rounded m-3">
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <ListGroup.Item key={cliente.id} className="d-flex justify-content-between align-items-center">
                  <span>
                    {cliente.nombre} {cliente.apellido}
                  </span>
                  <div>
                    <Button variant="outline-info" onClick={() => handleShowDetailsModal(cliente)} className="me-2">
                      <i className="bi bi-eye"></i>
                    </Button>
                    <Button variant="outline-warning" onClick={() => handleShowCards(cliente)}>
                      <i className="bi bi-three-dots"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-center">No hay clientes registrados.</ListGroup.Item>
            )}
          </ListGroup>

        </>
      ) : (
        <div>
          <Button variant="outline-secondary" onClick={handleBackToList} className="mb-3">
            <i className="bi bi-arrow-left"></i> Volver a la lista
          </Button>

          {/* Renderizar una card por cada producto del cliente */}
          {productos
            .filter(producto => producto.clienteId === selectedCliente.id)
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map((producto) => (
              <Card key={producto.id} className="mb-3 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                  <strong>{producto.cat}</strong>
                  <Badge bg="light" text="dark">ID: {producto.id}</Badge>
                </Card.Header>

                <Card.Body>


                  {producto.cat === "Préstamo" && (
                    <p>
                      <strong>Nombre:</strong> {producto.nombre} <br />
                      <strong>Fecha realizado:</strong> {new Date(producto.fecha_realizado).toLocaleDateString("es-AR")} <br />
                      <strong>Monto:</strong> ${producto.monto_prestado.toLocaleString("es-AR")} <br />
                      <strong>Tipo:</strong> {producto.tipo} <br />
                    </p>
                  )}

                  {producto.cat === "Plan" && (
                    <p>
                      <strong>Nombre:</strong> {producto.nombre} <br />
                      <strong>Fecha realizado:</strong> {new Date(producto.fecha_realizado).toLocaleDateString("es-AR")} <br />
                      <strong>Producto:</strong> {producto.objeto_venta} <br />
                      <strong>N° contrato:</strong> {producto.numero_de_contraro} <br />
                    </p>
                  )}

                  {producto.cat === "Venta Permutada" && (
                    <p>
                      <strong>Nombre:</strong> {producto.nombre} <br />
                      <strong>Fecha realizado:</strong> {new Date(producto.fecha_realizado).toLocaleDateString("es-AR")} <br />
                      <strong>Producto permutado:</strong> {producto.objeto_entregado} <br />
                      <strong>Objeto recibido:</strong> {producto.objeto_recibido} <br />
                      <strong>Monto adicional recibido:</strong> ${producto.monto_adicional_recibido.toLocaleString("es-AR")} <br />
                    </p>
                  )}

                  {producto.cat === "Venta Directa" && (
                    <p>
                      <strong>Nombre:</strong> {producto.nombre_objeto} <br />
                      <strong>Fecha realizada:</strong> {new Date(producto.fecha_y_hora).toLocaleDateString("es-AR")} <br />
                      <strong>Producto:</strong> {producto.objeto_en_venta} <br />
                      <strong>Valor:</strong> ${producto.monto.toLocaleString("es-AR")} <br />
                      <strong>Método de pago:</strong> {producto.metodo_de_pago} <br />

                    </p>
                  )}

                  <Badge
                    bg={
                      producto.estado === "pendiente"
                        ? "warning"
                        : producto.estado === "cancelado"
                          ? "success"
                          : producto.estado === "Caducado"
                            ? "danger"
                            : "secondary"
                    }
                    text="dark"
                    className="ms-2"
                  >
                    {producto.estado}
                  </Badge>


                  {/* Verificar si tiene cuotas antes de acceder */}
                  {producto.cuotas ? (
                    <>
                      <p><strong>Total de Cuotas:</strong> {producto.cuotas.length}</p>

                      {/* Acordeón de Cuotas */}
                      {producto.cuotas ? (
                        <>


                          {/* Acordeón de Cuotas */}
                          {producto.cuotas.length > 0 ? (
                            <Accordion>
                              <Accordion.Item eventKey={producto.id.toString()}>
                                <Accordion.Header>Ver Cuotas</Accordion.Header>
                                <Accordion.Body>
                                  <ListGroup>
                                    {producto.cuotas
                                      .sort((a, b) => a.numero_cuota - b.numero_cuota) // Ordenar por número de cuota
                                      .map((cuota, index) => (
                                        <CuotaItem
                                          key={cuota.id}
                                          cuota={cuota}
                                          index={index}
                                          producto={producto}
                                          cliente={selectedCliente}
                                          setRefreshData={setRefreshData}
                                          navigate={navigate}
                                          usuario={usuario}
                                        />
                                      ))}
                                  </ListGroup>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          ) : (
                            <p className="text-muted">No hay cuotas registradas.</p>
                          )}
                        </>
                      ) : (
                        <p className="text-muted">Venta directa - No aplica cuotas.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted">Venta directa - No aplica cuotas.</p>
                  )}
                </Card.Body>
              </Card>
            ))}
        </div>
      )}

      {/* Modal para ver detalles del cliente */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCliente && (
            <div>
              <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
              <p><strong>Apellido:</strong> {selectedCliente.apellido}</p>
              <p><strong>Dirección Comercial:</strong> {selectedCliente.direccion_comersial}</p>
              <p><strong>Dirección del Hogar:</strong> {selectedCliente.direccion_hogar}</p>
              <p><strong>DNI:</strong> {selectedCliente.dni}</p>
              <p><strong>CUIL:</strong> {selectedCliente.cuil}</p>
              <p><strong>Tarjeta:</strong> {selectedCliente.tarjeta}</p>
              <p><strong>Email:</strong> {selectedCliente.email}</p>
              <p><strong>N° Teléfono:</strong> {selectedCliente.numero_telefono}</p>
              <p><strong>N° Teléfono 2:</strong> {selectedCliente.numero_telefono_2}</p>
              <p><strong>Apellido Familiar Directo:</strong> {selectedCliente.apellido_familiar}</p>
              <p><strong>Nombre Familiar Directo:</strong> {selectedCliente.nombre_familiar}</p>
              <p><strong>Situación Veraz:</strong> {selectedCliente.situacion_veraz}</p>
              <p><strong>N° Cliente:</strong> {selectedCliente.numero_cliente}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};