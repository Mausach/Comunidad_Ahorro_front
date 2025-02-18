import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { CargarReportes } from '../Helpers/CargarReportes';
import { ModalCrearPeriodo } from './Subcomponente/ModalCrearPeriodo';
import { ReporteGeneral } from './Subcomponente/Reportes';

import { CargarProductos } from '../Helpers/Cargarroductos';
import { CargarRendiciones } from '../Helpers/CargarRendiciones';
import RendicionList from './Subcomponente/RendicionesCards';


export const GestPeriodoRep = ({ navigate, usuario }) => {
    const [selectedOption, setSelectedOption] = useState(''); // Estado para la opción seleccionada
    const [loading, setLoading] = useState(false); // Estado para manejar el cargando
    const [refreshData, setRefreshData] = useState(false);//estado para refrescar

    const [reportes, setReportes] = useState([]); //estado para reportes
    const [rendicion, setRendicion] = useState([]); //para las rendiciones
    const [productos, setProductos] = useState([]); //estado para tipo de productos planes de diferentes cosas



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
            CargarRendiciones(setRendicion, navigate)

            setRefreshData(false);
        } else {

            CargarReportes(setReportes, navigate);
            CargarProductos(setProductos, navigate);
            CargarRendiciones(setRendicion, navigate)
        }
    }, [refreshData, navigate]);


    const renderContent = () => {
        if (reportes.length === 0 || productos.length === 0) {
            return <Spinner animation="border" />;
        }

        // Filtrar reportes según el producto al que pertenecen
        const reportesPrestamos = reportes.filter(reporte => {
            const productoRelacionado = productos.find(producto => producto.nombre === reporte.tipo);
            return productoRelacionado && productoRelacionado.prestamo_bandera; // Solo préstamos
        });

        const reportesPlanes = reportes.filter(reporte => {
            const productoRelacionado = productos.find(producto => producto.nombre === reporte.tipo);
            return productoRelacionado && productoRelacionado.plan_bandera; // Solo planes
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

                <RendicionList rendiciones={rendicion} setRefreshData={setRefreshData} 
                navigate={navigate} />

            </>
        );
    };


    return (
        <Container className="mt-5">

            {renderContent()}

        </Container>
    );
}



