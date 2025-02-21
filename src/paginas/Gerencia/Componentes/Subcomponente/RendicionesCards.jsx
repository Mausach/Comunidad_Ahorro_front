import React from 'react';
import { Row, Col, Card, Button, Accordion, Alert } from 'react-bootstrap';
import { confirmarRendicion } from '../../Helpers/ConfirmarRendicion';

const RendicionList = ({ rendiciones, setRefreshData, navigate }) => {

  const handleEdit = (rendicion) => {
    console.log("Rendición seleccionada:", rendicion);
    
    confirmarRendicion(rendicion.id,setRefreshData, navigate);
};

 // Filtrar solo las rendiciones pendientes
 const rendicionesPendientes = rendiciones.filter(rendicion => !rendicion.estado);

  // Función para formatear la fecha en formato argentino
  const formatFechaArgentina = (fecha) => {
    if (!fecha) return "No disponible";

    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    return new Date(fecha).toLocaleDateString('es-AR', options);
};


  return (
    <div style={{ overflowX: 'auto', padding: '10px' }}>
    <Row className="d-flex justify-content-center">
      {rendicionesPendientes.length > 0 ? (
        rendicionesPendientes.map((rendicion) => (
          <Col key={rendicion.id} xs={12} className="mb-4">
            <Card
              style={{
                width: '95%',
                maxWidth: '900px',
                margin: 'auto',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
              }}
              className="shadow-lg rounded-5"
            >
              <Card.Body>
                <Card.Title>
                  Rendición de {rendicion.cobrador.nombres} {rendicion.cobrador.apellido}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Monto a Rendir: ${rendicion.monto_rendir}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Estado:</strong> Pendiente ⏳
                </Card.Text>

                {/* Acordeón para los detalles de las cuotas */}
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header> Ver Detalles de Cuotas</Accordion.Header>
                    <Accordion.Body>
                      {rendicion.datos_de_cuotas.length > 0 ? (
                        <ul className="list-group">
                          {rendicion.datos_de_cuotas.map((cuota, idx) => (
                            <li key={idx} className="list-group-item">
                              <strong>Cuota #{cuota.numero_cuota}:</strong> ${cuota.monto}
                              <br />
                              <strong>Cliente:</strong> {cuota.cliente}
                              <br />
                              <strong>Método de pago:</strong> {cuota.metodo_pago}
                              <br />
                              <strong>Categoría:</strong> {cuota.categoria}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Alert variant="warning">⚠️ No hay cuotas registradas.</Alert>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {/* Botón de acción */}
                <Button className="mt-2" variant="success" onClick={() => handleEdit(rendicion)}>
                  Rendido
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <Alert className='rounded-5' variant="info">🎉 No hay rendiciones pendientes.</Alert>
      )}
    </Row>
  </div>
  );
};

export default RendicionList;