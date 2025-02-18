import React from 'react';
import { Row, Col, Card, Button, Accordion, Alert } from 'react-bootstrap';

const RendicionList = ({ rendiciones, setRefreshData, navigate }) => {
  const handleEdit = (rendicion) => {
    console.log("Editando rendición", rendicion);
  };

  const handleDelete = (id) => {
    console.log("Eliminando rendición con ID:", id);
  };

  return (
    <div style={{ overflowX: 'auto', padding: '10px' }}>
      <Row className="d-flex justify-content-center">
        {rendiciones.map((rendicion) => (
          <Col key={rendicion.id} xs={12} className="mb-4"> 
            <Card style={{ width: '95%', maxWidth: '900px', margin: 'auto', boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' }} className="shadow-lg rounded-5">
              <Card.Body>
                <Card.Title> Rendición de {rendicion.cobrador.nombres} {rendicion.cobrador.apellido}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Monto a Rendir: ${rendicion.monto_rendir}</Card.Subtitle>
                <Card.Text>
                  <strong>Estado:</strong> {rendicion.estado ? 'Completado ✅' : 'Pendiente ⏳'}
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
                              <br />
                              <strong>Fecha:</strong> {cuota.fecha ? cuota.fecha : 'No disponible'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Alert variant="warning">⚠️ No hay cuotas registradas.</Alert>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {/* Botones de acciones */}
                <Card.Footer className="d-flex justify-content-between mt-3">
                  <Button variant="primary" onClick={() => handleEdit(rendicion)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDelete(rendicion.id)} className="ms-2">Eliminar</Button>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RendicionList;