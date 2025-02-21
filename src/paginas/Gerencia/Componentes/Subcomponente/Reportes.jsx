import React, { useState } from 'react';
import { Card, Button, Collapse, Alert, Modal, Form, Row, Col, Container } from 'react-bootstrap';
import { starEditarReporte } from '../../Helpers/EditarReporte';
import { ModalRegistGasto } from './ModalRegGastos';
import Swal from 'sweetalert2';
import PieChartComponent from './GraficoTOrta';
import ListaDeProductos from './ListaProdReportes';
import ListaDeGastos from './ListaGastos';

export const ReporteGeneral = ({ reportes, reportesPrestamos, reportesPlanes, setRefreshData, navigate }) => {
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showGastoModal, setShowGastoModal] = useState(false);
    const [vistaActual, setVistaActual] = useState('reportes'); // 'reportes', 'planes', 'prestamos'
    const [reporteIdGasto, setReporteIdGasto] = useState(null);
    const [reporteEditado, setReporteEditado] = useState({
      total_ganancias: 0,
      total_perdidas: 0,
      total_gastos: 0,
      total_vendido: 0,
      total_suscripciones: 0,
      total: 0,
      total_a_prestar: 0,
      objetivo_ventas_plan: 0,
      total_prestado: 0,
      total_a_cobrar: 0,
      total_sueldos: 0,
    });
  
    const totalReporte = reportes.reduce(
      (acumulador, reporte) => ({
        total_ganancias: acumulador.total_ganancias + (reporte.total_ganancias || 0),
        total_perdidas: acumulador.total_perdidas + (reporte.total_perdidas || 0),
        total_gastos: acumulador.total_gastos + (reporte.total_gastos || 0),
        total_vendido: acumulador.total_vendido + (reporte.total_vendido || 0),
        total_suscripciones: acumulador.total_suscripciones + (reporte.total_suscripciones || 0),
        total: acumulador.total + (reporte.total || 0),
        total_a_prestar: acumulador.total_a_prestar + (reporte.total_a_prestar || 0),
        objetivo_ventas_plan: acumulador.objetivo_ventas_plan + (reporte.objetivo_ventas_plan || 0),
        total_prestado: acumulador.total_prestado + (reporte.total_prestado || 0),
        total_a_cobrar: acumulador.total_a_cobrar + (reporte.total_a_cobrar || 0),
        total_sueldos: acumulador.total_sueldos + (reporte.total_sueldos || 0),
      }),
      {
        total_ganancias: 0,
        total_perdidas: 0,
        total_gastos: 0,
        total_vendido: 0,
        total_suscripciones: 0,
        total: 0,
        total_a_prestar: 0,
        objetivo_ventas_plan: 0,
        total_prestado: 0,
        total_a_cobrar: 0,
        total_sueldos: 0,
      }
    );
  
    const handleEditClick = (reporte) => {
      setReporteEditado(reporte);
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setReporteEditado((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };
  
    const handleSaveChanges = (e) => {
      e.preventDefault();
  
      const valoresNegativos = Object.values(reporteEditado).some((valor) => valor < 0);
      if (valoresNegativos) {
        Swal.fire({
          icon: 'error',
          title: 'Valores inválidos',
          text: 'Los valores no pueden ser negativos.',
        });
        return;
      }
  
      starEditarReporte(reporteEditado, setRefreshData, navigate);
      console.log('Reporte actualizado:', reporteEditado);
  
      handleCloseModal();
    };
  
    const handleRegistrarGasto = (reporteId) => {
      setReporteIdGasto(reporteId);
      setShowGastoModal(true);
    };
  
    const handleSaveGasto = (gasto) => {
      console.log('Gasto registrado:', gasto);
      Swal.fire({
        icon: 'success',
        title: 'Gasto registrado',
        text: `Monto: $${gasto.monto}, Descripción: ${gasto.descripcion}`,
      });
    };

    const handleVerPlanes = () => {
      setVistaActual('Plan');
      setMostrarDetalles(false);
    };

    const handleVerPrestamos = () => {
      setVistaActual('Préstamo');
      setMostrarDetalles(false);
    };

    const handleVolverAReportes = () => {
      setVistaActual('reportes');
    };

    const handleVerGasto = (reporteId) => {
      setReporteIdGasto(reporteId);
      setVistaActual('Gastos');
    };
  
    const hayTotalAPrestarCero = reportesPrestamos.some((reporte) => reporte.total_a_prestar === 0);
    const hayObjetivoVentasCero = reportesPlanes.some((reporte) => reporte.objetivo_ventas_plan === 0);
    const objetivoVentasSuperado =
      totalReporte.objetivo_ventas_plan !== 0 && totalReporte.total_vendido > totalReporte.objetivo_ventas_plan;
  
    const resumenData = [
      { name: 'Ganancias', value: totalReporte.total_ganancias },
      { name: 'Pérdidas', value: totalReporte.total_perdidas },
      { name: 'Gastos', value: totalReporte.total_gastos },
      { name: 'Total Vendido planes y prestamos', value: totalReporte.total_vendido },
      { name: 'Suscripciones', value: totalReporte.total_suscripciones },
      { name: 'Total', value: totalReporte.total },
      { name: 'Total a Prestar', value: totalReporte.total_a_prestar },
      { name: 'Objetivo Ventas Plan', value: totalReporte.objetivo_ventas_plan },
      { name: 'Total Prestado', value: totalReporte.total_prestado },
      { name: 'Total a Cobrar', value: totalReporte.total_a_cobrar },
      { name: 'Sueldos', value: totalReporte.total_sueldos },
    ];

    const renderContenido = () => {
      switch (vistaActual) {
        case 'Plan':
          return (
            <Card className="mb-2 rounded-5">
              <Card.Body>
                <Card.Title>📋 Listado de Planes</Card.Title>
                <Button variant="secondary" onClick={handleVolverAReportes}>
                  Volver a Reportes
                </Button>
                <ListaDeProductos cat="Plan" navigate={navigate} />
                
              </Card.Body>
            </Card>
          );
        case 'Préstamo':
          return (
            <Card className="mb-2 rounded-5">
              <Card.Body>
                <Card.Title>💰 Listado de Préstamos</Card.Title>
                <Button variant="secondary" onClick={handleVolverAReportes}>
                  Volver a Reportes
                </Button>
                <ListaDeProductos cat="Préstamo" navigate={navigate} />
                
              </Card.Body>
            </Card>
          );
          case 'Gastos':
          return (
            <Card className="mb-2 rounded-5">
              <Card.Body>
                <Card.Title>💰 Listado de Gastos</Card.Title>
                <Button variant="secondary" onClick={handleVolverAReportes}>
                  Volver a Reportes
                </Button>
                <ListaDeGastos reporteId={reporteIdGasto} navigate={navigate} />
                
              </Card.Body>
            </Card>
          );
        default:
          return (
            <>
              <Card className="mb-5 rounded-5">
                <Card.Body>
                  <Card.Title>📊 Resumen General</Card.Title>
                  {hayTotalAPrestarCero && <Alert variant="warning">⚠️ Al menos un reporte tiene un monto a prestar de 0.</Alert>}
                  {hayObjetivoVentasCero && <Alert variant="danger">⚠️ Al menos un reporte tiene un objetivo de ventas en 0.</Alert>}
                  {objetivoVentasSuperado && <Alert variant="success">🎉 ¡El total vendido ha superado el objetivo de ventas!</Alert>}
                  <PieChartComponent data={resumenData} />
                  <Button variant="primary" onClick={() => setMostrarDetalles(!mostrarDetalles)}>
                    {mostrarDetalles ? 'Ocultar Detalles' : 'Ver Detalles por Reporte'}
                  </Button>
                </Card.Body>
              </Card>
              {/*prestamo*/}
              <Collapse in={mostrarDetalles}>
                <div>
                  {reportesPrestamos.map((reporte, index) => {
                    const reporteData = [
                      { name: 'Ganancias', value: reporte.total_ganancias || 0 },
                      { name: 'Pérdidas', value: reporte.total_perdidas || 0 },
                      { name: 'Gastos', value: reporte.total_gastos || 0 },
                      { name: 'Total Vendido', value: reporte.total_vendido || 0 },
                      { name: 'Suscripciones', value: reporte.total_suscripciones || 0 },
                      { name: 'Total', value: reporte.total || 0 },
                      { name: 'Total a Prestar', value: reporte.total_a_prestar || 0 },
                      { name: 'Total Prestado', value: reporte.total_prestado || 0 },
                      { name: 'Total a Cobrar', value: reporte.total_a_cobrar || 0 },
                      { name: 'Sueldos', value: reporte.total_sueldos || 0 },
                    ];

                    return (
                      <Card key={index} className="mb-2 rounded-5">
                        <Card.Body>
                          <Card.Title>📄 Reporte: {reporte.tipo || `Reporte ${index + 1}`}</Card.Title>
                          {reporte.total_a_prestar === 0 && <Alert variant="warning">⚠️ Este reporte tiene un monto a prestar de 0.</Alert>}
                          <PieChartComponent data={reporteData} />
                          <Card.Footer>
                            <Button variant="primary" onClick={() => handleEditClick(reporte)}>
                              Editar reporte de préstamo
                            </Button>
                            <Button variant="success" className="ms-2" onClick={() => handleRegistrarGasto(reporte.id)}>
                              💸 Registrar Gasto
                            </Button>
                            <Button variant="success" className="ms-2" onClick={() => handleVerGasto(reporte.id)}>
                               Ver Gasto
                            </Button>
                            <Button variant="success" className="ms-2" onClick={handleVerPrestamos}>
                              Ver Prestamos
                            </Button>
                          </Card.Footer>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </div>
              </Collapse>

              {/*planes*/}
              <Collapse in={mostrarDetalles}>
                <div>
                  {reportesPlanes.map((reporte, index) => {
                    const reporteData = [
                      { name: 'Ganancias', value: reporte.total_ganancias || 0 },
                      { name: 'Pérdidas', value: reporte.total_perdidas || 0 },
                      { name: 'Gastos', value: reporte.total_gastos || 0 },
                      { name: 'Total Vendido', value: reporte.total_vendido || 0 },
                      { name: 'Suscripciones', value: reporte.total_suscripciones || 0 },
                      { name: 'Total', value: reporte.total || 0 },
                      { name: 'Objetivo Ventas Plan', value: reporte.objetivo_ventas_plan || 0 },
                      { name: 'Total a Cobrar', value: reporte.total_a_cobrar || 0 },
                      { name: 'Sueldos', value: reporte.total_sueldos || 0 },
                    ];

                    return (
                      <Card key={index} className="mb-2 rounded-5">
                        <Card.Body>
                          <Card.Title>📄 Reporte: {reporte.tipo || `Reporte ${index + 1}`}</Card.Title>
                          {reporte.objetivo_ventas_plan === 0 && <Alert variant="danger">⚠️ Este reporte tiene un objetivo de ventas en 0.</Alert>}
                          <PieChartComponent data={reporteData} />
                          <Card.Footer>
                            <Button variant="primary" onClick={() => handleEditClick(reporte)}>
                              Editar reporte del plan
                            </Button>
                            <Button variant="success" className="ms-2" onClick={() => handleRegistrarGasto(reporte.id)}>
                              💸 Registrar Gasto
                            </Button>
                            <Button variant="success" className="ms-2" onClick={() => handleVerGasto(reporte.id)}>
                               Ver Gasto
                            </Button>
                            <Button variant="success" className="ms-2" onClick={handleVerPlanes}>
                              Ver Planes
                            </Button>
                          </Card.Footer>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </div>
              </Collapse>
            </>
          );
      }
    };
  
    return (
      <div>
        <Container>
          {renderContenido()}

          <ModalRegistGasto
            show={showGastoModal}
            handleClose={() => setShowGastoModal(false)}
            handleSave={handleSaveGasto}
            setRefreshData={setRefreshData}
            navigate={navigate}
            reporteId={reporteIdGasto}
          />
  
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static" centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Editar Reporte {reporteEditado.tipo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSaveChanges}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="total_ganancias" className="mt-3">
                      <Form.Label>💰 Ganancias</Form.Label>
                      <Form.Control type="number" name="total_ganancias" value={reporteEditado.total_ganancias} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_perdidas" className="mt-3">
                      <Form.Label>📉 Pérdidas</Form.Label>
                      <Form.Control type="number" name="total_perdidas" value={reporteEditado.total_perdidas} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_gastos" className="mt-3">
                      <Form.Label>💸 Gastos</Form.Label>
                      <Form.Control type="number" name="total_gastos" value={reporteEditado.total_gastos} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_vendido" className="mt-3">
                      <Form.Label>🛒 Total Vendido</Form.Label>
                      <Form.Control type="number" name="total_vendido" value={reporteEditado.total_vendido} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_suscripciones" className="mt-3">
                      <Form.Label>📢 Suscripciones</Form.Label>
                      <Form.Control type="number" name="total_suscripciones" value={reporteEditado.total_suscripciones} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="total" className="mt-3">
                      <Form.Label>💼 Total</Form.Label>
                      <Form.Control type="number" name="total" value={reporteEditado.total} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_a_prestar" className="mt-3">
                      <Form.Label>🏦 Total a Prestar</Form.Label>
                      <Form.Control type="number" name="total_a_prestar" value={reporteEditado.total_a_prestar} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="objetivo_ventas_plan" className="mt-3">
                      <Form.Label>🎯 Objetivo Ventas Plan</Form.Label>
                      <Form.Control type="number" name="objetivo_ventas_plan" value={reporteEditado.objetivo_ventas_plan} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_prestado" className="mt-3">
                      <Form.Label>📊 Total Prestado</Form.Label>
                      <Form.Control type="number" name="total_prestado" value={reporteEditado.total_prestado} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_a_cobrar" className="mt-3">
                      <Form.Label>💳 Total a Cobrar</Form.Label>
                      <Form.Control type="number" name="total_a_cobrar" value={reporteEditado.total_a_cobrar} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="total_sueldos" className="mt-3">
                      <Form.Label>👷‍♂️ Sueldos</Form.Label>
                      <Form.Control type="number" name="total_sueldos" value={reporteEditado.total_sueldos} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Guardar cambios
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
};

export default ReporteGeneral;
