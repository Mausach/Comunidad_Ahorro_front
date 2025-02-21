import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { CargarReportes } from '../Helpers/CargarReportes';
import { ReporteGeneral } from './Subcomponente/Reportes';
import { CargarProductos } from '../Helpers/Cargarroductos';
import { CargarRendiciones } from '../Helpers/CargarRendiciones';
import RendicionList from './Subcomponente/RendicionesCards';
import RendicionListaHist from './Subcomponente/HistorialRendiciones';


export const GestPeriodoRep = ({ navigate, usuario }) => {
    const [selectedOption, setSelectedOption] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [reportes, setReportes] = useState([]);
    const [rendicion, setRendicion] = useState([]);
    const [productos, setProductos] = useState([]);
    const [filtroRendiciones, setFiltroRendiciones] = useState('pendientes'); // Estado para el filtro

    const handleSelection = (option) => {
        setLoading(true);
        setTimeout(() => {
            setSelectedOption(option);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
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
            CargarRendiciones(setRendicion, navigate);
            setRefreshData(false);
        } else {
            CargarReportes(setReportes, navigate);
            CargarProductos(setProductos, navigate);
            CargarRendiciones(setRendicion, navigate);
        }
    }, [refreshData, navigate]);

    const renderContent = () => {
        if (reportes.length === 0 || productos.length === 0) {
            return <Spinner animation="border" />;
        }

        const reportesPrestamos = reportes.filter(reporte => {
            const productoRelacionado = productos.find(producto => producto.nombre === reporte.tipo);
            return productoRelacionado && productoRelacionado.prestamo_bandera;
        });

        const reportesPlanes = reportes.filter(reporte => {
            const productoRelacionado = productos.find(producto => producto.nombre === reporte.tipo);
            return productoRelacionado && productoRelacionado.plan_bandera;
        });

        return (
            <>
                <ReporteGeneral 
                    reportes={reportes}
                    reportesPrestamos={reportesPrestamos}
                    reportesPlanes={reportesPlanes}
                    setRefreshData={setRefreshData} 
                    navigate={navigate} 
                />

                {/* Botones para seleccionar el tipo de rendiciones */}
                <Row className="my-3 text-center">
                    <Col>
                        <Button 
                            variant={filtroRendiciones === 'pendientes' ? "primary" : "outline-primary"} 
                            onClick={() => setFiltroRendiciones('pendientes')}
                        >
                            Rendiciones Pendientes
                        </Button>
                        {' '}
                        <Button 
                            variant={filtroRendiciones === 'historial' ? "primary" : "outline-primary"} 
                            onClick={() => setFiltroRendiciones('historial')}
                        >
                            Historial de Rendiciones
                        </Button>
                    </Col>
                </Row>

                {filtroRendiciones === 'pendientes' ? (
                    <RendicionList 
                        rendiciones={rendicion.filter(rend => !rend.estado)}
                        setRefreshData={setRefreshData} 
                        navigate={navigate} 
                    />
                ) : (
                    <RendicionListaHist
                        rendiciones={rendicion.filter(rend => rend.estado)}
                    />
                )}
            </>
        );
    };

    return (
        <Container className="mt-5 mb-5">
            {renderContent()}
        </Container>
    );
}


