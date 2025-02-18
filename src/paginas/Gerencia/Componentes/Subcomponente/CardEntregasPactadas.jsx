import React from 'react';
import { Card, Accordion, Badge, ListGroup } from 'react-bootstrap';

const CardCuotaPactada = ({ pactadas }) => {
  if (!pactadas || pactadas.length === 0) {
    return <p className="text-center text-muted">No hay cuotas pactadas disponibles.</p>;
  }

  return (
    <div>
      {pactadas.map((resultado, index) => {
        const { cliente, cuotas, plan } = resultado;
        console.log(`📌 Cliente: ${cliente?.nombre}`, "📌 Cuotas:", cuotas);
        return (
          <Card key={index} className="mb-3 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
              <strong>{cliente?.nombre} {cliente?.apellido}</strong>
              <Badge bg="light" text="dark">ID: {cliente?.id}</Badge>
            </Card.Header>

            <Card.Body>
              {/* Datos del cliente */}
              <h5>Datos del Cliente</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Email:</strong> {cliente?.email || 'No disponible'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Teléfono:</strong> {cliente?.telefono || 'No disponible'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>DNI:</strong> {cliente?.dni || 'No disponible'}
                </ListGroup.Item>
              </ListGroup>

              {/* Datos del plan o préstamo */}
              <h5 className="mt-3">Datos del Plan</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>ID del Plan:</strong> {plan?.id || 'No disponible'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Cuotas de Entrega Pactada:</strong> {Array.isArray(plan?.cuotas_entrega_pactada) ? plan.cuotas_entrega_pactada.join(', ') : 'No especificadas'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Monto Total:</strong> ${plan?.monto_total || 'No disponible'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Duración:</strong> {plan?.duracion_meses ? `${plan.duracion_meses} meses` : 'No especificada'}
                </ListGroup.Item>
              </ListGroup>

              {/* Lista de cuotas pagas */}
              <h5 className="mt-3">Cuotas Pagas</h5>
              {cuotas && cuotas.length > 0 ? (
                <Accordion>
                  <Accordion.Item eventKey="cuotas">
                    <Accordion.Header>Ver Cuotas</Accordion.Header>
                    <Accordion.Body>
                      <ListGroup>
                        {cuotas.map((cuota, idx) => (
                          <ListGroup.Item key={idx}>
                            <strong>Cuota {cuota.numero_cuota}:</strong> ${cuota.monto_cuota} (Pagada el {new Date(cuota.fecha_cobrada).toLocaleDateString()})
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <p className="text-muted">No hay cuotas pagas.</p>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default CardCuotaPactada;