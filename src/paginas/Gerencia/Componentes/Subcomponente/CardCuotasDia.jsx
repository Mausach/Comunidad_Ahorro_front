import React from "react";
import { Card, Accordion, Badge, ListGroup, Container } from "react-bootstrap";

export const CardCuotasDia = ({ cuotasHoy }) => {
  if (!cuotasHoy || cuotasHoy.length === 0) {
    return <p className="text-center text-muted">No hay cuotas para cobrar hoy.</p>;
  }

  return (
    <div>

   
      <h2 className="mb-4 text-center">Cuotas a Cobrar Hoy</h2>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ver Todas las Cuotas</Accordion.Header>
          <Accordion.Body>
            {cuotasHoy.map((cuotaItem, index) => {
              const { cliente, cuota, objetoRelacionado } = cuotaItem;

              return (
                <Card key={index} className="mb-3 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-danger text-white">
                    <strong>{cliente?.nombre} {cliente?.apellido}</strong>
                    <Badge bg="light" text="dark">ID: {cliente?.id}</Badge>
                  </Card.Header>

                  <Card.Body>
                    {/* Datos del Cliente */}
                    <h5>Datos del Cliente</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Email:</strong> {cliente?.email || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Teléfono:</strong> {cliente?.telefono || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>DNI:</strong> {cliente?.dni || "No disponible"}
                      </ListGroup.Item>
                    </ListGroup>

                    {/* Datos de la Cuota */}
                    <h5 className="mt-3">Datos de la Cuota</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Producto:</strong> {objetoRelacionado?.nombre || "No especificado"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Monto:</strong> ${cuota?.monto || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Fecha Límite:</strong> {cuota?.fechaVencimiento || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Estado:</strong> {cuota?.pagado ? "Pagado ✅" : "Pendiente ❌"}
                      </ListGroup.Item>
                    </ListGroup>

                    {/* Sección adicional con detalles dentro de otro acordeón */}
                    <h5 className="mt-3">Más Detalles</h5>
                  
                      
                          <ListGroup>
                            <ListGroup.Item>
                              <strong>Número de Cuota:</strong> {cuota?.numero || "No disponible"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <strong>Fecha de Pago:</strong> {cuota?.fechaPago ? new Date(cuota.fechaPago).toLocaleDateString() : "No pagada"}
                            </ListGroup.Item>
                          </ListGroup>
                        
                  </Card.Body>
                </Card>
              );
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      </div>
  );
};
