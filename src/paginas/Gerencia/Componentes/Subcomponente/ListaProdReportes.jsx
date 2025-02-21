import React, { useState, useEffect } from "react";
import { Card, Badge, Accordion, ListGroup, Spinner, Alert, Form, Row } from "react-bootstrap";
import { CargarProductosCategoria } from "../../Helpers/CargarProdsCatReport";
import PieChartComponent from "./GraficoTOrta";

const ListaDeProductos = ({ cat, navigate }) => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError(null);
                await CargarProductosCategoria(cat, setProductos, navigate);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setError("Hubo un problema al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [cat, navigate]);

    useEffect(() => {
        // Filtrar productos por mes y año
        if (mes && anio) {
            const productosFiltrados = productos.filter((producto) => {
                const fecha = new Date(producto.producto.fecha_realizado);
                return (
                    fecha.getMonth() + 1 === parseInt(mes) && fecha.getFullYear() === parseInt(anio)
                );
            });

            setProductosFiltrados(productosFiltrados);
        } else {
            setProductosFiltrados(productos); // Mostrar todos si no hay filtro
        }
    }, [mes, anio, productos]);

    // Función para calcular los montos totales
    const calcularMontos = () => {
        const totalCobrado = productosFiltrados.reduce((total, producto) => {
            const totalProducto = producto.cuotas
                .filter(cuota => cuota.estado === "pago")
                .reduce((totalCuota, cuota) => totalCuota + cuota.monto_cuota, 0);
            return total + totalProducto;
        }, 0);

        const totalPrestado = productosFiltrados.reduce((total, producto) => {
            return total + (producto.producto.monto_prestado || 0);
        }, 0);

        const totalACobrar = productosFiltrados.reduce((total, producto) => {
            return total + producto.producto.total_a_cobrar;
        }, 0);

        // Calcular total de sueldos pagados (suscripcion_inicial)
        const totalSueldos = productosFiltrados.reduce((total, producto) => {
            return total + (producto.producto.suscripcion_inicial || 0);
        }, 0);

        return [
            { name: 'Total Cobrado', value: totalCobrado },
            { name: 'Total Prestado', value: totalPrestado },
            { name: 'Total a Cobrar', value: totalACobrar },
            { name: 'Total Sueldos Pagados', value: totalSueldos }, // Agregar total de sueldos
        ];
    };

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

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
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

            {/* Gráfico general de montos */}
            {productosFiltrados.length > 0 ? (
                <PieChartComponent data={calcularMontos()} />
            ) : (
                <Alert variant="info">No hay datos disponibles para mostrar el gráfico.</Alert>
            )}

            {/* Mostrar productos filtrados */}
            {productosFiltrados.length === 0 ? (
                <Alert variant="warning">No hay productos disponibles para este mes y año.</Alert>
            ) : (
                productosFiltrados.map((producto, index) => {
                    const { cliente, cuotas, producto: datosProducto } = producto;

                    const reporteData = [
                        { name: 'Ganancias', value: datosProducto.ganancias || 0 },
                        { name: 'Pérdidas', value: datosProducto.perdidas || 0 },
                        { name: 'Total Cobrado', value: datosProducto.total_cobrado || 0 },
                        { name: 'Total Prestado', value: datosProducto.total_prestado || 0 },
                        { name: 'Total a Cobrar', value: datosProducto.total_a_cobrar || 0 },
                    ];

                    return (
                        <Card key={index} className="mb-3 shadow-sm">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                                <strong>{datosProducto?.nombre || "No disponible"}</strong>
                                <Badge bg="light" text="dark">ID: {cliente?.id}</Badge>
                            </Card.Header>

                            <Card.Body>
                                {/* Gráfico general de montos */}
                                <div className="chart-placeholder" style={{ marginBottom: "20px" }}>
                                    <h5>Gráfico de Monto</h5>
                                    {reporteData.length > 0 ? (
                                        <PieChartComponent data={reporteData} />
                                    ) : (
                                        <Alert variant="info">No hay datos disponibles para mostrar el gráfico.</Alert>
                                    )}
                                </div>

                                {/* Datos del producto */}
                                <h5>Datos del {cat}</h5>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Fecha realizado:</strong> {formatFechaArgentina(datosProducto?.fecha_realizado)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Estado:</strong> {datosProducto?.estado || "No disponible"}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Situación del cliente:</strong> {datosProducto?.sit_cliente || "No especificada"}
                                    </ListGroup.Item>
                                    {datosProducto?.monto_prestado > 0 && (
                                        <ListGroup.Item>
                                            <strong>Monto prestado:</strong> {datosProducto.monto_prestado}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>

                                {/* Cuotas */}
                                <h5 className="mt-3">Cuotas</h5>
                                {cuotas && cuotas.length > 0 ? (
                                    <Accordion>
                                        <Accordion.Item eventKey="cuotas">
                                            <Accordion.Header>Ver Cuotas</Accordion.Header>
                                            <Accordion.Body>
                                                <ListGroup>
                                                    {cuotas
                                                        .sort((a, b) => a.numero_cuota - b.numero_cuota)
                                                        .map((cuota, idx) => (
                                                            <ListGroup.Item key={idx}>
                                                                <strong>Cuota {cuota.numero_cuota}:</strong> ${cuota.monto_cuota} <strong>estado:</strong> {cuota.estado}  <strong>fecha cobro:</strong> {new Date(cuota.fecha_cobro).toLocaleDateString()}
                                                            </ListGroup.Item>
                                                        ))}
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                ) : (
                                    <p className="text-muted">No hay cuotas pagas.</p>
                                )}

                                {/* Datos del Cliente */}
                                <h5 className="mt-3">Datos del Cliente</h5>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Email:</strong> {cliente?.email || "No disponible"}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Teléfono:</strong> {cliente?.numero_telefono || "No disponible"}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>DNI:</strong> {cliente?.dni || "No disponible"}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default ListaDeProductos;