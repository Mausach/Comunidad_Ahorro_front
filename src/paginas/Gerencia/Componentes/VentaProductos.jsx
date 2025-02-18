import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { CargarPrestamo } from '../Helpers/CargarPrestamo';
import { CargarProductos } from '../Helpers/Cargarroductos';
import { VentaCardPres } from './Subcomponente/VentaCardPres';
import { CargarReportes } from '../Helpers/CargarReportes';
import { VentaCardPlan } from './Subcomponente/VentaCardPlan';


export const VentaProductos = ({ navigate, usuario }) => {
    const [selectedOption, setSelectedOption] = useState(''); // Estado para la opción seleccionada
    const [loading, setLoading] = useState(false); // Estado para manejar el cargando
    const [refreshData, setRefreshData] = useState(false);//estado para refrescar

    const [productos, setProductos] = useState([]); //estado para tipo de productos planes de diferentes cosas
    const [reportes, setReportes] = useState([]); //estado para reportes
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    // Función para manejar la selección de opciones
    const handleSelection = (option) => {
        setLoading(true); // Activamos el estado de "cargando"
        setTimeout(() => {
            setSelectedOption(option); // Establecemos la opción seleccionada
            setLoading(false); // Desactivamos el "cargando"
        }, 1000); // Simulamos un tiempo de carga de 1 segundo
    };

    useEffect(() => {
        // Animación con GSAP para la entrada del contenido
        if (!loading && selectedOption) {
            gsap.fromTo(
                ".content",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
    }, [loading, selectedOption]);

    useEffect(() => {
        if (refreshData) {
            CargarReportes(setReportes, navigate);
           
            CargarProductos(setProductos, navigate);


            setRefreshData(false);
        } else {

            CargarReportes(setReportes, navigate);
           
            CargarProductos(setProductos, navigate);
        }
    }, [refreshData, navigate]);

    console.log(reportes)


 // Renderizar contenido según la opción seleccionada
 const renderContent = () => {
    switch (selectedOption) {
        case 'Prestamos':
            // Filtrar productos habilitados para préstamos
            const productosPrestamos = productos.filter(
                (producto) => producto.prestamo_bandera === true && producto.estado_producto === true
            );

            return (
                <Row className="g-3">
                    {productosPrestamos.length > 0 ? (
                        productosPrestamos.map((prestamo) => {
                            // Buscar el reporte correspondiente al producto
                            const reporteActual = reportes.find(
                                (reporte) => reporte.tipo === prestamo.nombre
                            );

                            return (
                                <Col key={prestamo.id} md={4} sm={6} xs={12}>
                                    <Card className="h-100">
                                        <VentaCardPres
                                            prestamo={prestamo}
                                            setRefreshData={setRefreshData}
                                            navigate={navigate}
                                            usuario={usuario}
                                            reporte={reporteActual.id} // Pasar el reporte correcto
                                        />
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <Col>
                            <h1>No hay productos habilitados para préstamos.</h1>
                        </Col>
                    )}
                </Row>
            );

        case 'Planes':
            const productosPlanes = productos.filter((producto) => !producto.prestamo_bandera);

            return (
                <Row className="g-3">
                    {productosPlanes.length > 0 ? (
                        productosPlanes.map((prod) => {
                            // Buscar el reporte correspondiente al producto
                            const reporteActual = reportes.find(
                                (reporte) => reporte.tipo === prod.nombre
                            );

                            return (
                                <Col key={prod.id} md={4} sm={6} xs={12}>
                                    <Card className="h-100">
                                        <VentaCardPlan
                                            producto={prod}
                                            setRefreshData={setRefreshData}
                                            navigate={navigate}
                                            usuario={usuario}
                                            reporte={reporteActual.id} // Pasar el reporte correcto
                                        />
                                    </Card>
                                </Col>
                            );
                        })
                    ) : (
                        <Col>
                            <h1>No hay planes disponibles en este momento.</h1>
                        </Col>
                    )}
                </Row>
            );

        default:
            return (
                <Row>
                    <Col>
                        <h1>Por favor, selecciona una opción para empezar.</h1>
                    </Col>
                </Row>
            );
    }
};

    return (
        <Container className="mt-5">
            {/* Botones estilizados en una fila */}
            <Row className="justify-content-center mb-5">
                <Col xs={12} sm={6} md={4} className="mb-3">
                    <Button
                        variant="primary"
                        className="w-100 py-3 shadow"
                        onClick={() => handleSelection('Prestamos')}
                    >
                        Préstamos
                    </Button>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-3">
                    <Button
                        variant="secondary"
                        className="w-100 py-3 shadow"
                        onClick={() => handleSelection('Planes')}
                    >
                        Productos
                    </Button>
                </Col>
            </Row>

            {/* Mostrar animación de "cargando" o el contenido */}
            {loading ? (
                <div className="loading">
                    <h2 className="d-flex justify-content-center align-items-center min-vh-100">
                        <Spinner animation="grow" variant="dark" />
                    </h2>
                </div>
            ) : (
                renderContent()
            )}
        </Container>
    );
};