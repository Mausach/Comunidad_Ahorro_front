import React, { useState, useEffect } from 'react';
import { Accordion, ListGroup, Button, Alert, Form, Row } from 'react-bootstrap';

const RendicionListaHist = ({ rendiciones }) => {
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [rendicionesFiltradas, setRendicionesFiltradas] = useState(rendiciones);

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

  useEffect(() => {
    // Filtrar rendiciones por mes y año si están seleccionados
    if (mes && anio) {
      const rendicionesFiltradas = rendiciones.filter((rendicion) => {
        const fecha = new Date(rendicion.fecha_y_hora);
        return (
          fecha.getMonth() + 1 === parseInt(mes) && fecha.getFullYear() === parseInt(anio)
        );
      });
      setRendicionesFiltradas(rendicionesFiltradas);
    } else {
      setRendicionesFiltradas(rendiciones); // Mostrar todas si no hay filtro
    }
  }, [mes, anio, rendiciones]);

  return (
    <div style={{ padding: '10px' }}>
      <h4 className="text-center mb-3">Listado de Rendiciones</h4>
      
      {/* Filtro por mes y año */}
      <Form className="mb-3">
        <Row>
          <Form.Group className="col-md-6" controlId="formMes">
            <Form.Label>Mes</Form.Label>
            <Form.Control as="select" value={mes} onChange={(e) => setMes(e.target.value)}>
              <option value="">Seleccione un mes</option>
              {[...Array(12).keys()].map((i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString('es-AR', { month: 'long' })}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-6" controlId="formAnio">
            <Form.Label>Año</Form.Label>
            <Form.Control as="select" value={anio} onChange={(e) => setAnio(e.target.value)}>
              <option value="">Seleccione un año</option>
              {[...Array(new Date().getFullYear() - 2022 + 1)].map((_, i) => {
                const year = 2023 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Row>
      </Form>

      {/* Mostrar las rendiciones filtradas */}
      {rendicionesFiltradas.length > 0 ? (
        <Accordion>
          {rendicionesFiltradas.map((rendicion, index) => (
            <Accordion.Item eventKey={index.toString()} key={rendicion.id}>
              <Accordion.Header>
                {rendicion.cobrador.nombres} {rendicion.cobrador.apellido} - ${rendicion.monto_rendir} {formatFechaArgentina(rendicion.fecha_y_hora)}
              </Accordion.Header>
              <Accordion.Body>
                {rendicion.datos_de_cuotas.length > 0 ? (
                  <ListGroup>
                    {rendicion.datos_de_cuotas.map((cuota, idx) => (
                      <ListGroup.Item key={idx}>
                        <strong>Cuota #{cuota.numero_cuota}:</strong> ${cuota.monto}
                        <br />
                        <strong>Cliente:</strong> {cuota.cliente}
                        <br />
                        <strong>Método de pago:</strong> {cuota.metodo_pago}
                        <br />
                        <strong>Categoría:</strong> {cuota.categoria}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <Alert variant="warning">⚠️ No hay cuotas registradas.</Alert>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Alert className='rounded-5' variant="info">🎉 No hay rendiciones registradas.</Alert>
      )}
    </div>
  );
};

export default RendicionListaHist;
