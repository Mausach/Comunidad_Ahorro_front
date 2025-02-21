import React, { useState, useEffect } from "react";
import { Card, Alert, Form, Row, ListGroup, Spinner } from "react-bootstrap";

import { CargarGastosDeReporte } from "../../Helpers/CargarGastosDeReporte";


const ListaDeGastos = ({ reporteId,navigate }) => {
    
    const [gastos, setGastos] = useState([]);
    const [gastosFiltrados, setGastosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError(null);
                await CargarGastosDeReporte(reporteId,setGastos, navigate);
            } catch (error) {
                console.error("Error cargando gastos:", error);
                setError("Hubo un problema al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [ reporteId,navigate]);

    useEffect(() => {
        if (mes && anio) {
            const filtrados = gastos.filter((gasto) => {
                const fecha = new Date(gasto.fecha);
                return fecha.getMonth() + 1 === parseInt(mes) && fecha.getFullYear() === parseInt(anio);
            });
            setGastosFiltrados(filtrados);
        } else {
            setGastosFiltrados(gastos);
        }
    }, [mes, anio, gastos]);

    const formatFechaArgentina = (fecha) => {
        if (!fecha) return "No disponible";
        return new Date(fecha).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <Form className="mb-3">
                <Row>
                    <Form.Group className="col-md-6" controlId="formMes">
                        <Form.Label>Mes</Form.Label>
                        <Form.Control as="select" value={mes} onChange={(e) => setMes(e.target.value)}>
                            <option value="">Seleccione un mes</option>
                            {[...Array(12).keys()].map((i) => (
                                <option key={i} value={i + 1}>
                                    {new Date(0, i).toLocaleString("es-AR", { month: "long" })}
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
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </Form.Control>
                    </Form.Group>
                </Row>
            </Form>

            {gastosFiltrados.length === 0 ? (
                <Alert variant="warning">No hay gastos disponibles para este mes y año.</Alert>
            ) : (
                gastosFiltrados.map((gasto, index) => (
                    <Card key={index} className="mb-3 shadow-sm">
                        <Card.Header className="bg-danger text-white">
                            <strong>Gastos</strong>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Fecha: </strong> {formatFechaArgentina(gasto.fecha)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Monto: </strong> ${gasto.Monto_gasto}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Descripcion: </strong> {gasto.descripcion_gasto || "No especificada"}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    );
};

export default ListaDeGastos;