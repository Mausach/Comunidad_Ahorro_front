import React from "react";
import { Card, Badge, Accordion, ListGroup } from "react-bootstrap";
import CuotaItem from "../../Gerencia/Componentes/Subcomponente/CoutaItem"; // Asegúrate de tener este componente de cuotas

const CardCuotasHoyCob = ({ cuotasHoy, setRefreshData, navigate, usuario }) => {
    if (!cuotasHoy || cuotasHoy.length === 0) {
        return <p className="text-center text-muted">No hay cuotas para cobrar hoy.</p>;
    }


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
        <div>
            <h2 className="mb-4 text-center">Cuotas a Cobrar Hoy</h2>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Ver Todas las Cuotas</Accordion.Header>
                    <Accordion.Body>
                        {cuotasHoy.map((cuotaItem, index) => {
                            const { cliente, cuota, objetoRelacionado } = cuotaItem;
                            console.log(objetoRelacionado); // Verifica que el objetoRelacionado no sea undefined

                            return (
                                <Card key={index} className="mb-3 shadow-sm">
                                    <Card.Header className="d-flex justify-content-between align-items-center bg-danger text-white">
                                        <strong>{cliente?.nombre} {cliente?.apellido}</strong>
                                        <Badge bg="light" text="dark">ID: {cliente?.id}</Badge>
                                    </Card.Header>

                                    <Card.Body>
                                        {/* Datos del Cliente */}
                                        <h5>Datos del Cliente</h5>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <strong>Nombre: {cliente?.nombre} {cliente?.apellido}</strong>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Email:</strong> {cliente?.email || "No disponible"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Teléfono:</strong> {cliente?.numero_telefono || "No disponible"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>DNI:</strong> {cliente?.dni || "No disponible"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Direccion:</strong> {cliente?.direccion_hogar || "No disponible"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Segunda direccion:</strong> {cliente?.direccion_comersial || "No disponible"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Familiar Directo:</strong> {cliente?.nombre_familiar} {cliente?.apellido_familiar}
                                            </ListGroup.Item>
                                        </ListGroup>

                                        {/* Datos de la Cuota */}
                                        <h5 className="mt-3">Datos del producto</h5>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <strong>Producto:</strong> {objetoRelacionado?.objeto_venta || '$' + objetoRelacionado?.monto_prestado || "No especificado"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Cantidad de cuotas:</strong> {objetoRelacionado?.cantidad_cuotas || objetoRelacionado?.cantidad_tipo || "No especificado"}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong>Fecha Realizada:</strong> {formatFechaArgentina(objetoRelacionado?.fecha_realizado)}
                                            </ListGroup.Item>
                                        </ListGroup>



                                        {/* Renderiza el CuotaItem aquí */}
                                        <CuotaItem
                                            key={cuota.id}
                                            cuota={cuota}
                                            index={index}
                                            producto={objetoRelacionado} // Pasa el objetoRelacionado como producto
                                            cliente={cliente}
                                            setRefreshData={setRefreshData}
                                            navigate={navigate}
                                            usuario={usuario}
                                        />
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default CardCuotasHoyCob;